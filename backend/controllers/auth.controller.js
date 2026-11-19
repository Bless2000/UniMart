import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const RESET_TOKEN_TTL_MINUTES = Number(process.env.RESET_TOKEN_TTL_MINUTES || 30);
const RESET_TOKEN_BYTES = 32;
const PASSWORD_MIN_LENGTH = 6;

// Password reset links are emailed in production. Until an email provider is
// configured, the token is returned in the response and logged to the console.
const RESET_TOKEN_IN_RESPONSE = process.env.NODE_ENV !== "production";

const normalize = (value) => (typeof value === "string" ? value.trim() : "");

const normalizeEmail = (value) => normalize(value).toLowerCase();

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Login accepts either the student's school ID or the email used as a school
// ID by staff, so both columns are matched case-insensitively.
async function findUserByIdentifier(identifier) {
  const result = await pool.query(
    `SELECT id, full_name, email, school_id, role, password
       FROM users
      WHERE lower(school_id) = lower($1) OR lower(email) = lower($1)
      LIMIT 1`,
    [identifier]
  );

  return result.rows[0] || null;
}

function publicUser(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    school_id: user.school_id,
    role: user.role,
  };
}

// Register Controller
export const register = async (req, res) => {
  const full_name = normalize(req.body.full_name ?? req.body.fullName);
  const school_id = normalize(
    req.body.school_id ?? req.body.schoolId ?? req.body.identifier
  );
  const email = normalizeEmail(req.body.email);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const confirm_password =
    req.body.confirm_password ?? req.body.confirmPassword ?? "";
  const phone = normalize(req.body.phone) || null;

  if (!full_name || !school_id || !email || !password || !confirm_password) {
    return res.status(400).json({
      message:
        "Full name, school ID or email, email, password and confirm password are required",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({
      message: `Your password needs at least ${PASSWORD_MIN_LENGTH} characters`,
    });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Staff sign in with their work email in place of a school ID.
  const role = school_id.includes("@") ? "staff" : "student";

  try {
    const existingUser = await pool.query(
      "SELECT 1 FROM users WHERE lower(school_id) = lower($1) OR lower(email) = lower($2)",
      [school_id, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "An account with that school ID or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, school_id, role, password, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, school_id, role`,
      [full_name, email, school_id, role, hashedPassword, phone]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: publicUser(result.rows[0]),
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "An account with that school ID or email already exists",
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  const identifier = normalize(
    req.body.identifier ??
      req.body.username ??
      req.body.school_id ??
      req.body.schoolId ??
      req.body.email
  );
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!identifier || !password) {
    return res.status(400).json({
      message: "Enter your school ID or email and password",
    });
  }

  try {
    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return res.status(400).json({
        message: "Invalid school ID/email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid school ID/email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        school_id: user.school_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const identifier = normalize(
    req.body.identifier ??
      req.body.school_id ??
      req.body.schoolId ??
      req.body.email ??
      req.body.username
  );

  if (!identifier) {
    return res.status(400).json({
      message: "Enter the school ID or email linked to your account",
    });
  }

  // Same response whether or not the account exists, so the endpoint cannot be
  // used to discover which school IDs or emails are registered.
  const genericResponse = {
    message:
      "If an account matches that school ID or email, a password reset link has been created.",
  };

  try {
    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return res.json(genericResponse);
    }

    const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    // Any earlier unused link for this user stops working.
    await pool.query(
      `UPDATE password_reset_tokens
          SET used_at = NOW()
        WHERE user_id = $1 AND used_at IS NULL`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashResetToken(token), expiresAt]
    );

    console.log(
      `[auth] Password reset requested for ${user.email} (expires ${expiresAt.toISOString()})`
    );

    const payload = {
      ...genericResponse,
      expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
    };

    if (RESET_TOKEN_IN_RESPONSE) {
      console.log(`[auth] Password reset token: ${token}`);
      payload.devResetToken = token;
      payload.resetPath = `/reset-password?token=${token}`;
    }

    res.json(payload);
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  const token = normalize(req.body.token);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const confirm_password =
    req.body.confirm_password ?? req.body.confirmPassword ?? null;

  if (!token || !password) {
    return res.status(400).json({
      message: "Reset token and new password are required",
    });
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({
      message: `Your password needs at least ${PASSWORD_MIN_LENGTH} characters`,
    });
  }

  if (confirm_password !== null && confirm_password !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT id, user_id
         FROM password_reset_tokens
        WHERE token_hash = $1
          AND used_at IS NULL
          AND expires_at > NOW()`,
      [hashResetToken(token)]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "That reset link is invalid or has expired. Request a new one.",
      });
    }

    const resetToken = result.rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    await client.query(
      `UPDATE users
          SET password = $1, updated_at = NOW()
        WHERE id = $2`,
      [hashedPassword, resetToken.user_id]
    );

    await client.query(
      `UPDATE password_reset_tokens
          SET used_at = NOW()
        WHERE user_id = $1 AND used_at IS NULL`,
      [resetToken.user_id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Password updated. You can now sign in with your new password.",
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
  }
};

// Check a reset token before showing the "choose a new password" form.
export const verifyResetToken = async (req, res) => {
  const token = normalize(req.query.token);

  if (!token) {
    return res.status(400).json({ message: "Reset token is required" });
  }

  try {
    const result = await pool.query(
      `SELECT expires_at
         FROM password_reset_tokens
        WHERE token_hash = $1
          AND used_at IS NULL
          AND expires_at > NOW()`,
      [hashResetToken(token)]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        valid: false,
        message: "That reset link is invalid or has expired",
      });
    }

    res.json({ valid: true, expiresAt: result.rows[0].expires_at });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
