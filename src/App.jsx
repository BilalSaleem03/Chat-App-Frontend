import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/pages/Login.jsx';
import Register from './components/pages/Register.jsx';
import ForgotPassword from './components/pages/ForgotPassword.jsx';
import ResetPassword from './components/pages/ResetPassword.jsx';
import Chat from './components/pages/Chat.jsx';
import GoogleCallback from './components/pages/GoogleCallback.jsx';
import ProtectedRoute from './components/Protectedroute.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Navigate to="/login" replace />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/auth/callback"   element={<GoogleCallback />} />
        <Route path="/chat"            element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;