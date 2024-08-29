import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import ForgotPassword from './pages/forgot-password/ForgotPassword'; // Import the ForgotPassword component
import ResetForgotPassword from './pages/forgot-password/ResetForgotPassword';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Add new routes here */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Existing routes */}
          <Route path="*" element={<Home />} />
          <Route path="/app" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/auth/reset-password/:uidb64/:token"
            element={<PasswordResetPage />}
          />
          <Route
            path="/reset-forgot-password/:uidb64/:token"
            element={<ResetForgotPassword />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
