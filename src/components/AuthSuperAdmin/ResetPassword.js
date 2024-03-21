import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ResetPasswordSuperAdmin } from '../Api/Auth_api';
import { toast } from 'react-toastify';
import CustomSpinner from '../Common/CustomSpinner';
import { FaFacebookSquare } from 'react-icons/fa';
import { CiInstagram } from 'react-icons/ci';

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetToken } = useParams();

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    setNewPasswordError('');
    setConfirmPasswordError('');

    if (!newPassword) {
      setNewPasswordError('New password is required.');
    } else if (!validatePassword(newPassword)) {
      setNewPasswordError('Password must be at least 8 characters long.');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required.');
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
    }

    if (
      newPassword &&
      confirmPassword &&
      !newPasswordError &&
      !confirmPasswordError
    ) {
      setIsSubmitting(true);

      try {
        const resetPassCred = {
          resetToken: resetToken,
          password: newPassword,
        };
        const response = await ResetPasswordSuperAdmin(resetPassCred);
        console.log(response);
        toast.success('Password reset successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      {isSubmitting && <CustomSpinner />}
      {/* <div
        className="background-image image-responsive"
        style={{
          backgroundImage: 'url(/assets/mainBgImgResize60.jpg)',
        }}
      >
        <div className="full-screen-container container">
          <div className="login-container">
            <h3 className="login-title"> Reset Password</h3>
            <form onSubmit={handleSignIn}>
              <div className="input-group">
                <label className="labelTag">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="inputTag"
                  placeholder="Enter new password"
                />
                {newPasswordError && (
                  <div className="error-message">{newPasswordError}</div>
                )}
              </div>
              <div className="input-group">
                <label className="labelTag">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="inputTag"
                  placeholder="Confirm new password"
                />
                {confirmPasswordError && (
                  <div className="error-message">{confirmPasswordError}</div>
                )}
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
      </div> */}

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
                    type="password"
                    className="form-control inputField border-0 p-2 placeholder-white"
                    style={{ background: 'black', color: 'white' }}
                    placeholder="New Password"
                    aria-label="password"
                    aria-describedby="basic-addon1"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                {newPasswordError && (
                  <div className="error-message">{newPasswordError}</div>
                )}

                <div className="input-group inputFieldGroup mb-3">
                  <input
                    type="password"
                    className="form-control inputField border-0 p-2 placeholder-white"
                    style={{ background: 'black', color: 'white' }}
                    placeholder="New Password"
                    aria-label="password"
                    aria-describedby="basic-addon1"
                    value={confirmPassword}
                    onChange={(e) => confirmPassword(e.target.value)}
                  />
                </div>
                {newPasswordError && (
                  <div className="error-message">{newPasswordError}</div>
                )}

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

export default ResetPassword;
