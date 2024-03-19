import React, { useState } from 'react';
import './SignIn.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ResetPasswordSuperAdmin } from '../Api/Auth_api';
import { toast } from 'react-toastify';

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
        console.log(response); // Check the structure of the response object
        toast.success('Password reset successfully');
        navigate('/'); // Redirect to appropriate page after password reset
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
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
    </div>
  );
}

export default ResetPassword;
