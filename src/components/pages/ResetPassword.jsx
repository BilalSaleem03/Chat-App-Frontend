import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../Auth/AuthLayout.jsx';
import './ForgotPassword.css';
import eyeOff from "../../assets/eye-off.svg"
import eye from "../../assets/eye.svg"
import heart from "../../assets/heart.svg";


const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
// console.log(API)

const ResetPassword = () => {
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ password: '', confirm: '' });
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem('reset_email') || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.password)                errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (!form.confirm)                 errs.confirm  = 'Please confirm your password';
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!email) {
      setErrors({ form: 'Session expired. Please start over.' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API}/users/reset-password`,
        { email, newPassword: form.password },
        { withCredentials: true }
      );
      sessionStorage.removeItem('reset_email');
      navigate('/login?reset=success');
    } catch (err) {
      setErrors({ form: err.response?.data?.error || 'Failed to reset password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
    footer={
        <div className="auth-footer">
            <span>© 2024 Made With</span>

            <img
            src={heart}
            alt="heart"
            className="auth-footer__heart"
            />

            <span>By Sugab</span>
        </div>
        }
    >
      <div className="reset">
        <div>
          <h1 className="reset__title">Reset Password</h1>
        </div>

        <form className="reset__form" onSubmit={handleSubmit} noValidate>

          <div className="reset__field">
            <label className="reset__label" htmlFor="rp-password">New Password</label>
            <div className="reset__input-wrap">
              <input
                className={`reset__input reset__input--password${errors.password ? ' input--error' : ''}`}
                id="rp-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Your password . . ."
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="reset__eye-btn"
                onClick={() => setShowPass(v => !v)}
              >
                <img
                  src={showPass ? eyeOff : eye}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
            {errors.password && <span className="reset__error-msg">{errors.password}</span>}
          </div>

          <div className="reset__field">
            <label className="reset__label" htmlFor="rp-confirm">Confirm Password</label>
            <div className="reset__input-wrap">
              <input
                className={`reset__input reset__input--password${errors.confirm ? ' input--error' : ''}`}
                id="rp-confirm"
                name="confirm"
                type={showConf ? 'text' : 'password'}
                placeholder="Your password . . ."
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="reset__eye-btn"
                onClick={() => setShowConf(v => !v)}
              >
                <img
                  src={showConf ? eyeOff : eye}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
            {errors.confirm && <span className="reset__error-msg">{errors.confirm}</span>}
          </div>

          {errors.form && <span className="reset__error-msg">{errors.form}</span>}

          <button type="submit" className="reset__submit-btn" disabled={loading}>
            {loading ? <span className="reset__spinner" /> : 'Reset Password'}
          </button>

        </form>

        <p className="reset__footer-link">
          Don't have an account?
          <Link to="/register">Register now</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;