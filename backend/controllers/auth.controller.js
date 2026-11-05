
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users = [];

// Register Controller
export const register = async (req, res) => {
  const { username, full_name, school_id, email, phone_number, password } = req.body;

  if (!username || !full_name || !email || !password || !school_id || !phone_number)  {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const existingUser = users.find(
    user =>
      user.username === username ||
      user.email === email
  );

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    full_name,
    email,
    password: hashedPassword,
    school_id,
    phone_number
  });

  res.status(201).json({
    message: "User registered successfully"
  });
};

// Login Controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  const user = users.find(
    user => user.username === username
  );

  if (!user) {
    return res.status(400).json({
      message: "Invalid username or password"
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid username or password"
    });
  }

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
