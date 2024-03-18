import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { forgetPasswordSuperAdmin } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

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
    <div
      className="background-image image-responsive"
      style={{
        backgroundImage: 'url(/assets/8_september_background_04.jpg)',
      }}
    >
      <div className="full-screen-container container">
        <div className="login-container">
          <h3 className="login-title">
            {' '}
            Forget Password for Digital Business Card Super Admin
          </h3>
          {/* {error && <div className="error-message">{error}</div>} */}
          <form onSubmit={handleSignIn}>
            <div className="input-group">
              <label className="labelTag">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="inputTag"
                placeholder="Enter email"
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              Reset Password
            </button>
          </form>
          <div className="pass-signup mt-2">
            <div className="signup">
              Have an account ?<Link to="/"> Signup Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
