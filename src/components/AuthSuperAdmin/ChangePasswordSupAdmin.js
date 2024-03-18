import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import './ChangePasswordSupAdmin.css';
import { changePasswordAPI } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function ChangePasswordSupAdmin() {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const togglePasswordVisibility3 = () => {
    setShowPassword3(!showPassword3);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!oldPassword && !newPassword && !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password must match');
      return;
    }
    try {
      const response = await changePasswordAPI(oldPassword, newPassword);

      if (response.success) {
        toast.success(response.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigate('/super-admin-dashboard');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6 col-sm-12">
            <img className="w-100" src="/assets/Resetpassword-amico.png" />
          </div>

          <div
            className="col-md-6 col-lg-6 col-sm-12 "
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="card border-0 w-75"
              style={{
                background: 'transparent',
              }}
            >
              <h1 className="text-center mb-5">Change Password</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group groupInputProfile mb-3 p-2">
                  <label
                    htmlFor="exampleInputPassword1"
                    className="text-dark mb-2"
                  >
                    Old Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword1 ? 'text' : 'password'}
                      className="form-control pr-5"
                      id="exampleInputPassword1"
                      placeholder="Enter old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <button
                      className="btn btn-none border-0 position-absolute end-0 top-50 translate-middle-y btnEye"
                      type="button"
                      onClick={togglePasswordVisibility1}
                    >
                      {showPassword1 ? <IoIosEyeOff /> : <IoIosEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group groupInputProfile mb-3 p-2">
                  <label
                    htmlFor="exampleInputPassword2"
                    className="text-dark mb-2"
                  >
                    New Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      className="form-control pr-5"
                      id="exampleInputPassword2"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      className="btn btn-none border-0 position-absolute end-0 top-50 translate-middle-y btnEye"
                      type="button"
                      onClick={togglePasswordVisibility2}
                    >
                      {showPassword2 ? <IoIosEyeOff /> : <IoIosEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group groupInputProfile mb-3 p-2">
                  <label
                    htmlFor="exampleInputPassword3"
                    className="text-dark mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword3 ? 'text' : 'password'}
                      className="form-control pr-5"
                      id="exampleInputPassword3"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="btn border-0 position-absolute end-0 top-50 translate-middle-y btnEye"
                      type="button"
                      onClick={togglePasswordVisibility3}
                    >
                      {showPassword3 ? <IoIosEyeOff /> : <IoIosEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <button className="btn btn-primary" type="submit">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
