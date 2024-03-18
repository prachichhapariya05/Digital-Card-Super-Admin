import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/AuthSuperAdmin/SignIn';
import SignUp from './components/AuthSuperAdmin/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SuperAdminDashboard from './components/Home/SuperAdminDashboard';
import ProfileSupAdmin from './components/AuthSuperAdmin/ProfileSupAdmin';
import ChangePasswordSupAdmin from './components/AuthSuperAdmin/ChangePasswordSupAdmin';
import CompanyDetailsSupAdmin from './components/Home/CompanyDetailsSupAdmin';
import AddCompany from './components/Home/AddCompany';
import CreateAdmin from './components/Home/CreateAdmin';
import CardList from './components/Home/CardList';
import CardDetailSupAdmin from './components/Home/CardDetailSupAdmin';
import Cookies from 'js-cookie';
import Dashboard from './components/Home/Dashboard';
import NavbarSupAdmin from './components/Home/NavbarSupAdmin';
import ForgetPassword from './components/AuthSuperAdmin/ForgetPassword';
import ResetPassword from './components/AuthSuperAdmin/ResetPassword';

function isAuthenticated() {
  return !!Cookies.get('token');
}

function ProtectedRoute({ element }) {
  const isAuthenticatedUser = isAuthenticated();
  if (!isAuthenticatedUser) {
    return <Navigate to="/" />;
  }

  return element;
}

function App() {
  return (
    <div className="full-screen-background">
      <div
        className="App"
        // style={{ backgroundImage: 'url(/assets/rm222batch3-mind-03.jpg)' }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route
              path="/reset-password/:resetToken"
              element={<ResetPassword />}
            />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute
                  element={
                    <Routes>
                      <Route path="/" element={<NavbarSupAdmin />} />
                      <Route
                        path="/super-admin-dashboard"
                        element={<SuperAdminDashboard />}
                      />
                      <Route
                        path="/profile-show-super-admin"
                        element={<ProfileSupAdmin />}
                      />
                      <Route
                        path="/change-password-super-admin"
                        element={<ChangePasswordSupAdmin />}
                      />
                      <Route
                        path="/company-details-super-admin/:companyID"
                        element={<CompanyDetailsSupAdmin />}
                      />
                      <Route path="/create-company" element={<AddCompany />} />
                      <Route
                        path="/create-admin/:companyID"
                        element={<CreateAdmin />}
                      />
                      <Route
                        path="/card-list-sup-admin/:companyID/:companyName"
                        element={<CardList />}
                      />
                      <Route
                        path="/card-details-super-admin/:cardID"
                        element={<CardDetailSupAdmin />}
                      />
                    </Routes>
                  }
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
