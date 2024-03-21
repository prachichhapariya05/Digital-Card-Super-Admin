import React, { useState } from 'react';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { registerSuperAdmin, uploadProfileImage } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import { FaFacebookSquare } from 'react-icons/fa';
import { CiInstagram } from 'react-icons/ci';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const errorsCopy = { ...errors };
    if (!name) {
      errorsCopy.name = 'Name is required.';
    } else {
      errorsCopy.name = '';
    }

    if (!email) {
      errorsCopy.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorsCopy.email = 'Please enter a valid email address.';
    } else {
      errorsCopy.email = '';
    }

    if (!password) {
      errorsCopy.password = 'Password is required.';
    } else if (password.length < 6) {
      errorsCopy.password = 'Password must be at least 6 characters long.';
    } else {
      errorsCopy.password = '';
    }

    if (!avatar) {
      errorsCopy.avatar = 'Please select a profile picture.';
    } else {
      errorsCopy.avatar = '';
    }

    setErrors(errorsCopy);

    if (!Object.values(errorsCopy).some((error) => error !== '')) {
      try {
        if (!avatar) {
          errorsCopy.avatar = 'Please select a profile picture.';
          setErrors(errorsCopy);
          return;
        }

        const formData = new FormData();
        formData.append('image', avatar);

        const profileUploadResponse = await uploadProfileImage(formData);

        if (profileUploadResponse.success) {
          const data = {
            name,
            email,
            password,
            avatar: profileUploadResponse.data.data,
          };

          const response = await registerSuperAdmin(data);
          if (response.success) {
            toast.success(response.message || 'Registration successful');
            navigate('/');
          } else {
            setErrors({ ...errors, name: response.message });
            toast.error(response.message || 'Registration failed');
          }
        } else {
          toast.error(
            profileUploadResponse.message || 'Profile image upload failed'
          );
        }
      } catch (error) {
        setErrors({
          ...errors,
          name: 'An error occurred while registering. Please try again later.',
        });
        toast.error(error.message || 'Registration failed');
      }
    }
  };

  return (
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
            <form onSubmit={handleSignUp}>
              <div className="input-group inputFieldGroup mb-3">
                <input
                  type="text"
                  className="form-control inputField border-0 p-2 placeholder-white"
                  style={{ background: 'black', color: 'white' }}
                  placeholder="Name"
                  aria-label="name"
                  aria-describedby="basic-addon1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
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
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
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
              </div>{' '}
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              <div className="input-group inputFieldGroup mb-3">
                <input
                  type="file"
                  className="form-control inputField border-0 p-2 placeholder-white"
                  style={{ background: 'black', color: 'white' }}
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setAvatar(e.target.files[0]);
                    }
                  }}
                />
              </div>
              {errors.avatar && (
                <div className="error-message">{errors.avatar}</div>
              )}
              <div className="text-center btnGroup w-100">
                <button className="btn-signin" type="submit">
                  Sign Up
                </button>
              </div>
              <div className="pass-signup mt-2 text-center">
                <div className="signup text-secondary fs-6">
                  Already have an account{' '}
                  <Link
                    to="/"
                    className="text-secondary fs-6"
                    style={{ textDecoration: 'none' }}
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
