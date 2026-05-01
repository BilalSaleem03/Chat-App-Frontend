import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../Auth/AuthLayout.jsx';
import './Login.css';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Login = ({ onLogin }) => {
  const [form, setForm]         = useState({ identifier: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

   const navigate = useNavigate();

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
      console.log('Submitting login with data:', form);
      let response = await axios.post(`${backendUrl}/users/login`,  {
        usernameOrEmail: form.identifier,
        password: form.password,
        }, { withCredentials: true });
      
      navigate('/chat');
      onLogin?.();
    } catch (err) {
      console.log('Login error:', err);
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
        <button type="button" className="login__google-btn" onClick={() => { window.location.href = '/api/auth/google'; }}>
          <img src="/src/assets/google-icon.svg" alt="" aria-hidden="true" />
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
              <button type="button" className="login__eye-btn" onClick={() => setShowPass(v => !v)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                <img src={showPass ? '/src/assets/eye-off.svg' : '/src/assets/eye.svg'} alt="" aria-hidden="true" />
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