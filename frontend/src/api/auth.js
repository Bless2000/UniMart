// Thin client for the UniMart Express auth API.
// Requests go to the Vite dev proxy (/api -> http://localhost:3000) so the
// app works from both localhost and 127.0.0.1 without CORS issues.
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const TOKEN_KEY = 'unimart_token';
const USER_KEY = 'unimart_user';

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the UniMart server. Please try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export function saveSession(token, name) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, name);
}

export function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const name = localStorage.getItem(USER_KEY);
  return token && name ? { token, name } : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Signup collects: full name, school ID (or staff email), email, password and
// confirm password. The backend derives the account role from the identifier.
export function registerUser({ fullName, schoolId, email, password, confirmPassword, phone }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      full_name: fullName,
      school_id: schoolId,
      email,
      password,
      confirm_password: confirmPassword,
      phone: phone || null,
    }),
  });
}

// Login accepts a school ID or the email used as a school ID by staff.
export async function loginUser({ identifier, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

  saveSession(data.token, data.user?.full_name || identifier);
  return data;
}

// Step 1 of the reset flow. In development the backend returns devResetToken
// because no email provider is configured yet.
export function requestPasswordReset({ identifier }) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}

export function verifyResetToken(token) {
  return request(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
}

// Step 2 of the reset flow.
export function resetPassword({ token, password, confirmPassword }) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({
      token,
      password,
      confirm_password: confirmPassword,
    }),
  });
}
