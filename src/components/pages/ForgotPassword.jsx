import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../Auth/AuthLayout.jsx';
import './ForgotPassword.css';

// ── Step 1: Enter email ───────────────────────────────────────
const ForgotPasswordForm = () => {
  const navigate          = useNavigate();
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    try {
      // Skip email verification — go straight to reset screen
      // Store email in sessionStorage so ResetPassword can use it
      sessionStorage.setItem('reset_email', email.trim().toLowerCase());
      navigate('/reset-password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout footer="© 2024 Made With ♥ By Sugab">
      <div className="forgot">
        <div>
          <h1 className="forgot__title">Forgot Password?</h1>
          <p className="forgot__subtitle">
            Enter the email address you used when joined and
            we'll send reset instructions to reset your password.
          </p>
        </div>

        <form className="forgot__form" onSubmit={handleSubmit} noValidate>
          <div className="forgot__field">
            <label className="forgot__label" htmlFor="fp-email">Email</label>
            <div className="forgot__input-wrap">
              <input
                className={`forgot__input${error ? ' input--error' : ''}`}
                id="fp-email"
                type="email"
                placeholder="Your email . . ."
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
              />
            </div>
            {error && <span className="forgot__error-msg">{error}</span>}
          </div>

          <button type="submit" className="forgot__submit-btn" disabled={loading}>
            {loading ? <span className="forgot__spinner" /> : 'Send Reset Instructions'}
          </button>
        </form>

        <p className="forgot__footer-link">
          Back to log in page?
          <Link to="/login">Back now</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;