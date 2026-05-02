import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../Auth/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Login.css';
import google from "../../assets/google-icon.svg"
import eyeOff from "../../assets/eye-off.svg"
import eye from "../../assets/eye.svg"

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Login = () => {
  const { saveUser }            = useAuth();
  const navigate                = useNavigate();
  const [form, setForm]         = useState({ identifier: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = 'Username or email is required';
    if (!form.password)          errs.password   = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/users/login`,
        { usernameOrEmail: form.identifier, password: form.password },
        { withCredentials: true }
      );
      saveUser(res.data.user, res.data.accessToken);   // ← store { id, name, username, email } in context
      navigate('/chat');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please try again.';
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout footer="© 2024 Made With ♥ By Sugab">
      <div className="login">
        <div className="login__header">
          <h1 className="login__title">Welcome Back!</h1>
          <p className="login__subtitle">Welcome back, please enter your details.</p>
        </div>

        {new URLSearchParams(window.location.search).get('reset') === 'success' && (
          <p style={{ fontSize: '0.82rem', color: '#16A34A', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '0.75rem 1rem', textAlign: 'center' }}>
            Password reset successfully. You can now log in.
          </p>
        )}

        <button
          type="button"
          className="login__google-btn"
          onClick={() => { window.location.href = `${API}/users/google`; }}
        >
          <img src={google} alt="" aria-hidden="true" />
          Login with Google
        </button>

        <div className="login__divider">
          <span className="login__divider-line" />
          <span className="login__divider-text">or</span>
          <span className="login__divider-line" />
        </div>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <label className="login__label" htmlFor="identifier">Username/email</label>
            <div className="login__input-wrap">
              <input
                className={`login__input${errors.identifier ? ' input--error' : ''}`}
                id="identifier" name="identifier" type="text"
                placeholder="Your username/email . . ."
                value={form.identifier} onChange={handleChange} autoComplete="username"
              />
            </div>
            {errors.identifier && <span className="login__error-msg">{errors.identifier}</span>}
          </div>

          <div className="login__field">
            <div className="login__field-header">
              <label className="login__label" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="login__forgot">Forgot Password</Link>
            </div>
            <div className="login__input-wrap">
              <input
                className={`login__input login__input--password${errors.password ? ' input--error' : ''}`}
                id="password" name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Your password . . ."
                value={form.password} onChange={handleChange} autoComplete="current-password"
              />
              <button type="button" className="login__eye-btn" onClick={() => setShowPass(v => !v)}>
                <img src={showPass ? eyeOff : eye} alt="" aria-hidden="true" />
              </button>
            </div>
            {errors.password && <span className="login__error-msg">{errors.password}</span>}
          </div>

          {errors.form && <span className="login__error-msg">{errors.form}</span>}

          <button type="submit" className="login__submit-btn" disabled={loading}>
            {loading ? <span className="login__spinner" /> : 'Log in'}
          </button>
        </form>

        <p className="login__register-prompt">
          Don't have an account?
          <Link to="/register" className="login__register-link">Register now</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;