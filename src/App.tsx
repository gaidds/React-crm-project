import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import PasswordResetPage from './pages/auth/PasswordResetPage';


function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* <Route
            path='/'
            element={
              isLoggedIn ? (hasSelectedCompany ? (<Home />) : (<Navigate to='/company' />)) : (<Login />)
            }
          /> */}
          {/* <Route path='*' element={isLoggedIn ? <Home /> : <Login />} /> */}
          <Route path="*" element={<Home />} />
          <Route path="/app" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route
                path="/auth/reset-password/:uidb64/:token"
                element={<PasswordResetPage />}
            />
          {/* <Route path="/" element={<Navigate to="/contacts" replace />} /> */}
          {/* <Route
            path='/'
            element={isLoggedIn ? <Home /> : <Login />
            // <Navigate to='/login' />
          }
          >
          </Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
