import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import PasswordResetPage from './pages/auth/PasswordResetPage';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import ResetForgotPassword from './pages/forgot-password/ResetForgotPassword';
import RegistrationPage from './pages/auth/RegistrationPage';
import TokenExpirationHandler from './components/TokenExpirationHandler';
import Contacts from './pages/contacts/Contacts';
import ContactDetails from './pages/contacts/ContactDetails';
import Accounts from './pages/accounts/Accounts';
import AccountDetails from './pages/accounts/AccountDetails';
import Users from './pages/users/Users';
import Deals from './pages/deals/Deals';
import DealsCardView from './pages/deals/DealsCardView';
import DealDetails from './pages/deals/DealDetails';
import UserDetails from './pages/users/UserDetails';

function App() {
  return (
    <>
      <Router>
        <TokenExpirationHandler />
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/auth/reset-password/:uidb64/:token"
            element={<PasswordResetPage />}
          />
          <Route
            path="/reset-forgot-password/:uidb64/:token"
            element={<ResetForgotPassword />}
          />
          <Route path="/auth/register" element={<RegistrationPage />} />

          <Route path="/app" element={<Home />}>
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:contactId" element={<ContactDetails />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/:accountId" element={<AccountDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="deals" element={<Deals />} />
            <Route path="deals/card-view" element={<DealsCardView />} />
            <Route path="deals/:dealId" element={<DealDetails />} />
            <Route path="profile/:id" element={<UserDetails />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
