import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const GoogleCallback = () => {
  const { saveUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const params    = new URLSearchParams(window.location.search);
      const token     = params.get('token');
      const userParam = params.get('user');

      if (!userParam || !token) {
        setError('Google login failed. Redirecting...');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
        return;
      }

      const user = JSON.parse(decodeURIComponent(userParam));

      // saveUser writes to localStorage synchronously BEFORE navigating
      saveUser(user, token);

      // Use window.location.href (hard redirect) NOT navigate()
      // This forces App to remount and read fresh localStorage values
      window.location.href = '/chat';

    } catch (e) {
      setError('Something went wrong. Redirecting to login...');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'DM Sans, sans-serif',
      background: '#FFFFFF',
      gap: '1rem',
    }}>
      {error ? (
        <p style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</p>
      ) : (
        <>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#2563EB',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Signing you in with Google...</p>
        </>
      )}
    </div>
  );
};

export default GoogleCallback;