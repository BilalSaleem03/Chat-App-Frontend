import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tasky_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [accessToken, setAccessToken] = useState(() =>
    // Use localStorage (not sessionStorage) — survives redirects
    localStorage.getItem('tasky_token') || null
  );

  const saveUser = (userData, token) => {
    // Write to localStorage FIRST before any state updates
    localStorage.setItem('tasky_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('tasky_token', token);
    }
    // Then update React state
    setUser(userData);
    if (token) setAccessToken(token);
  };

  const clearUser = () => {
    localStorage.removeItem('tasky_user');
    localStorage.removeItem('tasky_token');
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, saveUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};