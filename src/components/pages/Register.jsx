import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../Auth/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Register.css';

const API = 'http://localhost:5000';

const Register = () => {
  const { saveUser }            = useAuth();
  const navigate                = useNavigate();
  const [form, setForm]         = useState({ name: '', username: '', email: '', password: '', agreed: false });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())     errs.name     = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.email.trim())    errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password)        errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (!form.agreed)          errs.agreed   = 'You must agree to continue';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/users/register`,
        { name: form.name, username: form.username, email: form.email, password: form.password },
        { withCredentials: true }
      );
      saveUser(res.data.user, res.data.accessToken);   // ← store { id, name, username, email } in context
      navigate('/chat');
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      // Show field-level errors if backend identifies the field
      if (message.includes('username')) setErrors({ username: message });
      else if (message.includes('email')) setErrors({ email: message });
      else setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout footer="© 2025 Made For Test Task">
      <div className="register">
        <div className="register__header">
          <h1 className="register__title">Welcome to Tasky!</h1>
          <p className="register__subtitle">Register now and start your adventure.</p>
        </div>

        <button
          type="button"
          className="register__google-btn"
          onClick={() => { window.location.href = `${API}/users/google`; }}
        >
          <img src="/src/assets/google-icon.svg" alt="" aria-hidden="true" />
          Register with Google
        </button>

        <div className="register__divider">
          <span className="register__divider-line" />
          <span className="register__divider-text">or</span>
          <span className="register__divider-line" />
        </div>

        <form className="register__form" onSubmit={handleSubmit} noValidate>
          <div className="register__row">
            <div className="register__field">
              <label className="register__label" htmlFor="name">Name</label>
              <div className="register__input-wrap">
                <input
                  className={`register__input${errors.name ? ' input--error' : ''}`}
                  id="name" name="name" type="text" placeholder="Your name . . ."
                  value={form.name} onChange={handleChange} autoComplete="given-name"
                />
              </div>
              {errors.name && <span className="register__error-msg">{errors.name}</span>}
            </div>
            <div className="register__field">
              <label className="register__label" htmlFor="username">Username</label>
              <div className="register__input-wrap">
                <input
                  className={`register__input${errors.username ? ' input--error' : ''}`}
                  id="username" name="username" type="text" placeholder="Your username . . ."
                  value={form.username} onChange={handleChange} autoComplete="username"
                />
              </div>
              {errors.username && <span className="register__error-msg">{errors.username}</span>}
            </div>
          </div>

          <div className="register__field">
            <label className="register__label" htmlFor="email">Email</label>
            <div className="register__input-wrap">
              <input
                className={`register__input${errors.email ? ' input--error' : ''}`}
                id="email" name="email" type="email" placeholder="Email . . ."
                value={form.email} onChange={handleChange} autoComplete="email"
              />
            </div>
            {errors.email && <span className="register__error-msg">{errors.email}</span>}
          </div>

          <div className="register__field">
            <label className="register__label" htmlFor="password">Password</label>
            <div className="register__input-wrap">
              <input
                className={`register__input register__input--password${errors.password ? ' input--error' : ''}`}
                id="password" name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Your password . . ."
                value={form.password} onChange={handleChange} autoComplete="new-password"
              />
              <button type="button" className="register__eye-btn" onClick={() => setShowPass(v => !v)}>
                <img src={showPass ? '/src/assets/eye-off.svg' : '/src/assets/eye.svg'} alt="" aria-hidden="true" />
              </button>
            </div>
            {errors.password && <span className="register__error-msg">{errors.password}</span>}
          </div>

          <div>
            <label className="register__terms">
              <input
                type="checkbox" name="agreed"
                className="register__checkbox"
                checked={form.agreed} onChange={handleChange}
              />
              <span className="register__terms-text">
                I agree to all the{' '}
                <Link to="/terms" className="register__terms-link">Term &amp; Privacy Policy</Link>
              </span>
            </label>
            {errors.agreed && <span className="register__error-msg">{errors.agreed}</span>}
          </div>

          {errors.form && <span className="register__error-msg">{errors.form}</span>}

          <button type="submit" className="register__submit-btn" disabled={loading}>
            {loading ? <span className="register__spinner" /> : 'Register'}
          </button>
        </form>

        <p className="register__login-prompt">
          Already have an account?
          <Link to="/login" className="register__login-link">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;