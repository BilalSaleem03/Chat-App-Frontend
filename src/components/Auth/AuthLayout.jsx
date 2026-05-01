import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout = ({ children, footer }) => (
  <div className="auth-layout">
    <aside className="auth-layout__panel">
      {/* <div className="auth-layout__panel-inner">
        <Link to="/" className="auth-layout__logo">
          <span className="auth-layout__logo-icon">
            <img src="/src/assets/logo-icon.svg" alt="" aria-hidden="true" />
          </span>
          <span className="auth-layout__logo-name">Tasky</span>
        </Link>
        <div className="auth-layout__mockup">
          <img src="/src/assets/app-mockup.png" alt="Tasky app preview" />
        </div>
      </div> */}
      <img src="/src/assets/Left.png" alt="Tasky app preview" />
    </aside>
    <main className="auth-layout__form">
      <div className="auth-layout__form-inner">
        {children}
      </div>
      {footer && <footer className="auth-layout__footer">{footer}</footer>}
    </main>
  </div>
);

export default AuthLayout;
