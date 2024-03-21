import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginSuperAdmin } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import Spinner from '../Common/CustomSpinner';

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
        className="background-image image-responsive"
        style={{
          backgroundImage: 'url(/assets/mainBgImgResize60.jpg)',
        }}
      >
        <div className="full-screen-container container">
          <div className="login-container">
            <h3 className="login-title">
              {' '}
              Sign In for Digital Business Card Super Admin
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
                {emailError && (
                  <div className="error-message">{emailError}</div>
                )}
              </div>
              <div className="input-group position-relative">
                <label className="labelTag">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="inputTag"
                  placeholder="Enter Password"
                />
                <button
                  className="border-0 position-absolute bottom-50 translate-middle-y btnEyePassword"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                </button>
                {passwordError && (
                  <div className="error-message">{passwordError}</div>
                )}
              </div>
              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                Sign In
              </button>
            </form>
            <div className="for mt-2">
              <div className="signup">
                <Link to="/forget-password">Forget Password</Link>
              </div>
            </div>

            <div className="pass-signup mt-2">
              <div className="signup">
                Don't have account ?<Link to="/sign-up"> Signup Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
