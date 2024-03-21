import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { forgetPasswordSuperAdmin } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import CustomSpinner from '../Common/CustomSpinner';
import { FaFacebookSquare } from 'react-icons/fa';
import { CiInstagram } from 'react-icons/ci';

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    setEmailError('');

    if (!email) {
      setEmailError('Email is required.');
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
    }

    setIsSubmitting(true);

    try {
      const response = await forgetPasswordSuperAdmin(email);
      toast.success(response.message);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {' '}
      {isSubmitting && <CustomSpinner />}
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
                </div>
                {/* {emailError && (
                  <div className="error-message">{emailError}</div>
                )} */}
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
                    Reset Password
                  </button>
                </div>
                <div className="pass-signup mt-2 text-center">
                  <div className="signup text-secondary fs-6">
                    Have an account{' '}
                    <Link
                      to="/"
                      className="text-secondary fs-6"
                      style={{ textDecoration: 'none' }}
                    >
                      Signup In
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

export default ForgetPassword;
