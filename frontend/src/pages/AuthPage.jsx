import React, { useState } from 'react';
import { UserIcon, MailIcon } from '../components/Icons';
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
  getSession,
  clearSession,
} from '../api/auth';

const emptyForm = {
  fullName: '',
  identifier: '',
  schoolId: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const modeLabels = {
  login: 'Login',
  signup: 'Sign Up',
  forgot: 'Forgot Password',
  reset: 'Reset Password',
};

export default function AuthPage({ onNavigate, triggerToast }) {
  // A reset link can bring the user straight to the "choose a new password" step.
  const initialToken = new URLSearchParams(window.location.search).get('token') || '';

  const [mode, setMode] = useState(initialToken ? 'reset' : 'login');
  const [form, setForm] = useState(emptyForm);
  const [resetToken, setResetToken] = useState(initialToken);
  const [session, setSession] = useState(() => getSession());
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';
  const isReset = mode === 'reset';

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 6) {
      return 'Your password needs at least 6 characters.';
    }
    if (password !== confirmPassword) {
      return 'Your passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (isSignup) {
      if (
        !form.fullName.trim() ||
        !form.schoolId.trim() ||
        !form.email.trim()
      ) {
        setError('Fill in your full name, school ID or email, and email address.');
        return;
      }

      const passwordError = validatePassword(form.password, form.confirmPassword);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    if (mode === 'login' && (!form.identifier.trim() || !form.password)) {
      setError('Enter your school ID or email and password.');
      return;
    }

    if (isForgot && !form.identifier.trim()) {
      setError('Enter the school ID or email linked to your account.');
      return;
    }

    if (isReset) {
      if (!resetToken) {
        setError('This reset link is missing its token. Request a new one.');
        return;
      }

      const passwordError = validatePassword(form.password, form.confirmPassword);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setSubmitting(true);

    try {
      if (isSignup) {
        await registerUser({
          fullName: form.fullName,
          schoolId: form.schoolId,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        // Registration does not return a token, so sign the new user straight in.
        await loginUser({ identifier: form.schoolId, password: form.password });
        triggerToast(`Welcome to UniMart, ${form.fullName.trim()}!`);
        setSession(getSession());
        setForm(emptyForm);
        onNavigate('home');
      } else if (mode === 'login') {
        const data = await loginUser({
          identifier: form.identifier,
          password: form.password,
        });
        triggerToast(`Welcome back, ${data.user?.full_name || form.identifier}!`);
        setSession(getSession());
        setForm(emptyForm);
        onNavigate('home');
      } else if (isForgot) {
        const data = await requestPasswordReset({ identifier: form.identifier });

        if (data.devResetToken) {
          // Development only: no email provider is configured, so the token is
          // handed straight to the page.
          setResetToken(data.devResetToken);
          setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
          setMode('reset');
          triggerToast('Reset link created. Choose a new password.');
        } else {
          setNotice(data.message);
        }
      } else if (isReset) {
        const data = await resetPassword({
          token: resetToken,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        setResetToken('');
        setMode('login');
        setForm(emptyForm);
        // Drop ?token=... from the address bar so a refresh cannot replay it.
        window.history.replaceState({}, '', window.location.pathname);
        triggerToast(data.message || 'Password updated. Please sign in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setMode('login');
    setForm(emptyForm);
    triggerToast('Signed out of UniMart.');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
    setResetToken('');
    setForm(emptyForm);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const submitLabel = () => {
    if (submitting) return 'Please wait...';
    if (isSignup) return 'Create Account';
    if (isForgot) return 'Send Reset Link';
    if (isReset) return 'Update Password';
    return 'Login';
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="shop-breadcrumbs">
        <button onClick={() => onNavigate('home')} className="crumb-link">Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">
          {session ? 'My Account' : modeLabels[mode]}
        </span>
      </div>

      <div className="auth-layout">
        <div className="auth-card">
          <div className="auth-icon-wrap">
            <UserIcon />
          </div>

          {session ? (
            <>
              <h1 className="auth-title">
                Signed in as <span className="highlight-yellow">{session.name}</span>
              </h1>
              <p className="auth-subtitle">
                You can now save favourites and check out on your campus marketplace.
              </p>

              <div className="account-links-grid">
                <button className="account-link-card" onClick={() => onNavigate('orders')}>
                  <strong>My Orders</strong>
                  <span>Track, confirm receipt and open disputes</span>
                </button>
                <button className="account-link-card" onClick={() => onNavigate('chat')}>
                  <strong>Messages</strong>
                  <span>Negotiate with sellers and agree a price</span>
                </button>
                <button className="account-link-card" onClick={() => onNavigate('notifications')}>
                  <strong>Notifications</strong>
                  <span>Order and dispute updates</span>
                </button>
                <button className="account-link-card" onClick={() => onNavigate('transactions')}>
                  <strong>Transaction History</strong>
                  <span>Every order as buyer and seller</span>
                </button>
                <button className="account-link-card" onClick={() => onNavigate('seller')}>
                  <strong>Seller Dashboard</strong>
                  <span>Acknowledge and dispatch orders</span>
                </button>
                <button className="account-link-card" onClick={() => onNavigate('admin')}>
                  <strong>Admin Panel</strong>
                  <span>Resolve disputes and audit transactions</span>
                </button>
              </div>

              <button className="btn-primary auth-submit-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <h1 className="auth-title">
                {isSignup && 'Create your '}
                {mode === 'login' && 'Welcome back to '}
                {isForgot && 'Forgot your '}
                {isReset && 'Choose a new '}
                <span className="highlight-yellow">
                  {isForgot ? 'password?' : isReset ? 'password' : 'UniMart'}
                </span>
              </h1>
              <p className="auth-subtitle">
                {isSignup && 'Join your campus marketplace to buy, sell and book services.'}
                {mode === 'login' && 'Sign in to track orders, chat with sellers and save favourites.'}
                {isForgot && 'Enter the school ID or email on your account and we will create a reset link.'}
                {isReset && 'Pick a new password for your UniMart account.'}
              </p>

              {(mode === 'login' || isSignup) && (
                <div className="auth-tabs">
                  <button
                    className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                    onClick={() => switchMode('login')}
                  >
                    Login
                  </button>
                  <button
                    className={`auth-tab ${isSignup ? 'active' : ''}`}
                    onClick={() => switchMode('signup')}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                {isSignup && (
                  <label className="auth-field">
                    <span className="auth-label">Full name</span>
                    <input
                      type="text"
                      placeholder="e.g. Amponsah Blessed"
                      value={form.fullName}
                      onChange={updateField('fullName')}
                      className="auth-input"
                      autoComplete="name"
                    />
                  </label>
                )}

                {(mode === 'login' || isForgot) && (
                  <label className="auth-field">
                    <span className="auth-label">School ID or email</span>
                    <input
                      type="text"
                      placeholder="e.g. 10887654 or you@university.edu.gh"
                      value={form.identifier}
                      onChange={updateField('identifier')}
                      className="auth-input"
                      autoComplete="username"
                    />
                  </label>
                )}

                {isSignup && (
                  <label className="auth-field">
                    <span className="auth-label">School ID or email</span>
                    <input
                      type="text"
                      placeholder="Students: e.g. 10887654 / Staff: your work email"
                      value={form.schoolId}
                      onChange={updateField('schoolId')}
                      className="auth-input"
                      autoComplete="username"
                    />
                  </label>
                )}

                {isSignup && (
                  <label className="auth-field">
                    <span className="auth-label">Email address</span>
                    <input
                      type="email"
                      placeholder="you@university.edu.gh"
                      value={form.email}
                      onChange={updateField('email')}
                      className="auth-input"
                      autoComplete="email"
                    />
                  </label>
                )}

                {!isForgot && (
                  <label className="auth-field">
                    <span className="auth-label">
                      {isReset ? 'New password' : 'Password'}
                    </span>
                    <input
                      type="password"
                      placeholder={isSignup || isReset ? 'At least 6 characters' : 'Your password'}
                      value={form.password}
                      onChange={updateField('password')}
                      className="auth-input"
                      autoComplete={isSignup || isReset ? 'new-password' : 'current-password'}
                    />
                  </label>
                )}

                {(isSignup || isReset) && (
                  <label className="auth-field">
                    <span className="auth-label">Confirm password</span>
                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={updateField('confirmPassword')}
                      className="auth-input"
                      autoComplete="new-password"
                    />
                  </label>
                )}

                {error && <p className="auth-error">{error}</p>}
                {notice && <p className="auth-note">{notice}</p>}

                <button type="submit" className="btn-primary auth-submit-btn" disabled={submitting}>
                  {submitLabel()}
                </button>
              </form>

              {mode === 'login' && (
                <p className="auth-switch-text">
                  <button className="auth-switch-btn" onClick={() => switchMode('forgot')}>
                    Forgot password?
                  </button>
                </p>
              )}

              {(isForgot || isReset) && (
                <p className="auth-switch-text">
                  <button className="auth-switch-btn" onClick={() => switchMode('login')}>
                    Back to login
                  </button>
                </p>
              )}

              {mode === 'login' && (
                <>
                  <p className="auth-switch-text">
                    Don't have an account?{' '}
                    <button className="auth-switch-btn" onClick={() => switchMode('signup')}>
                      Sign up
                    </button>
                  </p>

                  <div className="auth-divider">
                    <span>or</span>
                  </div>

                  <p className="auth-note">
                    <MailIcon /> Campus accounts use your school email address.
                  </p>
                </>
              )}

              {isSignup && (
                <p className="auth-switch-text">
                  Already have an account?{' '}
                  <button className="auth-switch-btn" onClick={() => switchMode('login')}>
                    Login
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
