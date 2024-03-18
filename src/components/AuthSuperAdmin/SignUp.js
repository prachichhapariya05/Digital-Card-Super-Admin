import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { registerSuperAdmin, uploadProfileImage } from '../Api/Auth_api';
import { toast } from 'react-toastify';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
  });

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
    //   if (!Object.values(errorsCopy).some((error) => error !== '')) {
    //     try {
    //       const data = {
    //         name,
    //         email,
    //         password,
    //         avatar,
    //       };
    //       const response = await registerSuperAdmin(data);
    //       if (response.success) {
    //         toast.success(response.message || 'Registration successful');
    //         navigate('/');
    //       } else {
    //         setErrors({ ...errors, name: response.message });
    //         toast.error(response.message || 'Registration failed');
    //       }
    //     } catch (error) {
    //       setErrors({
    //         ...errors,
    //         name: 'An error occurred while registering. Please try again later.',
    //       });
    //       toast.error(error.message || 'Registration failed');
    //     }
    //   }
    // };

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
      className="background-image"
      style={{
        backgroundImage: 'url(/assets/8_september_background_04.jpg)',
      }}
    >
      <div className="full-screen-container container">
        <div className="login-container">
          <h3 className="login-title">
            Sign Up for Digital Business Card Super Admin
          </h3>

          <form onSubmit={handleSignUp}>
            <div className="input-group">
              <label className="labelTag">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="inputTag"
                placeholder="Enter name"
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
            <div className="input-group">
              <label className="labelTag">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="inputTag"
                placeholder="Enter email"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            <div className="input-group">
              <label className="labelTag">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="inputTag"
                placeholder="Enter password"
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>
            <div className="input-group">
              <label className="labelTag w-100">Profile</label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setAvatar(e.target.files[0]);
                  }
                }}
                className="inputTag w-100"
              />

              {errors.avatar && (
                <div className="error-message">{errors.avatar}</div>
              )}
            </div>
            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>
          <div className="pass-signup">
            <div className="signup">
              Already have an account <Link to="/">Sign In Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
