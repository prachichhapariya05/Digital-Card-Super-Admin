import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginSuperAdmin } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import Spinner from '../Common/CustomSpinner';
import { FaFacebookSquare } from 'react-icons/fa';
import { CiInstagram } from 'react-icons/ci';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');
    setIsSubmitting(true);
    if (!email) {
      setEmailError('Email is required.');
      setIsSubmitting(false);
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      setIsSubmitting(false);
    }
    if (!password) {
      setPasswordError('Password is required.');
      setIsSubmitting(false);
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
    }
    setIsSubmitting(true);
    try {
      const response = await loginSuperAdmin(email, password);
      Cookies.set('token', response.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {isSubmitting && <Spinner />}
      <div
        className="container-fluid d-flex flex-column"
        style={{ height: '100vh' }}
      >
        <div className="row flex-grow-1">
          <div className="col-md-6 col-sm-12 p-0 position-relative bgContainer">
            <img
              src="/assets/background.jpg"
              alt="Background"
              className="bgImg"
            />
            <div className="position-absolute top-50 start-0 translate-middle-y text-white mb-5 p-4 ">
              <h2 className="textsize">
                <b>Tap, Connect, Cultivate</b>
                <br />
                Where Business Networking Blossoms
              </h2>
            </div>
            <img src="/assets/logo.png" alt="Logo" className="logoimg" />
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5">
              <FaFacebookSquare className="fs-1 fw-bold text-white me-2" />
              <CiInstagram className="fs-1 fw-bold text-white me-2 " />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 bg-dark d-flex align-items-center justify-content-center textContainer">
            <div className="card border-0 bg-dark cardWidth">
              <img
                src="/assets/logo.png"
                className="mx-auto mt-4 mb-3 LogoImgSize"
                alt="LogoImgSize"
              />
              <form onSubmit={handleSignIn}>
                <div className="input-group inputFieldGroup mb-3">
                  <input
                    type="text"
                    className="form-control inputField border-0 p-2 placeholder-white"
                    style={{ background: 'black', color: 'white' }}
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="error-message">{emailError}</div>
                  )}
                </div>
                <div className="input-group inputFieldGroup mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control border-0 p-2 placeholder-white"
                    style={{ background: 'black', color: 'white' }}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                  />
                  {passwordError && (
                    <div className="error-message">{passwordError}</div>
                  )}
                </div>
                <p className="text-center">
                  <Link
                    to="/forget-password"
                    style={{ textDecoration: 'none' }}
                    className="text-secondary fs-6 "
                  >
                    Forget your Password?
                  </Link>
                </p>
                <div className="text-center btnGroup w-100">
                  <button
                    className="btn-signin"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </button>
                </div>
                <div className="pass-signup mt-2 text-center">
                  <div className="signup text-secondary fs-6">
                    Don't have an account?{' '}
                    <Link
                      to="/sign-up"
                      className="text-secondary fs-6"
                      style={{ textDecoration: 'none' }}
                    >
                      Signup Now
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SignIn;
