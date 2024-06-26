import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import styles from './ChangePassword.module.css';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageforConfirmPassword, setErrorMessageforConfirm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    hasNumber: false,
    isLengthValid: false,
  });

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;

    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const isLengthValid = newPassword.length >= 6;

    setPasswordStrength({
      hasLowerCase,
      hasUpperCase,
      hasSpecialChar,
      hasNumber,
      isLengthValid,
    });

    setNewPassword(newPassword);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage(
        'Your new password and confirmation password do not match.'
      );
      return;
    }

    if (oldPassword === newPassword) {
      setErrorMessage(
        'Your old password cannot be the same as your new password.'
      );
      return;
    }

    try {
      const admToken = Cookies.get('admToken');
      const response = await axios.put(
        'http://localhost:3001/api/admin/change-password',
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${admToken}` },
        }
      );
      if (response.data.success) {
        setSuccessMessage('You have successfully changed your password!');
        setErrorMessage('');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength({
          hasLowerCase: false,
          hasUpperCase: false,
          hasSpecialChar: false,
          hasNumber: false,
          isLengthValid: false,
        });
      }
      console.log('Server response: ', response.data);
    } catch (error) {
      console.error('Change password error: ', error);
      setErrorMessage('Failed to change password. Please try again.');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);

    if (confirmPassword !== newPassword) {
      setErrorMessageforConfirm('The passwords you entered do not match.');
    } else {
      setErrorMessageforConfirm('');
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Change Password - Admin - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/admin/change-password" />
      </Helmet>
      <h2 className={styles.formTitle}>Change Password</h2>
      {errorMessage && (
        <div className='alert alert-danger' role='alert'>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className='alert alert-success' role='alert'>
          {successMessage}
        </div>
      )}

      <form className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formRowInner}>
            <input
              type='password'
              className={styles.input}
              id='oldPassword'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <label htmlFor='oldPassword' className={styles.label}>
              Current Password
            </label>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formRowInner}>
            <input
              type='password'
              className={styles.input}
              id='newPassword'
              value={newPassword}
              onChange={handlePasswordChange}
              pattern='^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$'
              required
            />
            <label htmlFor='newPassword' className={styles.label}>
              New Password
            </label>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formRowInner}>
            <input
              type='password'
              className={styles.input}
              id='confirmPassword'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <label htmlFor='confirmPassword' className={styles.label}>
              Confirm New Password
            </label>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <div className={styles.errorMessage}>
              The passwords you entered do not match.
            </div>
          )}
        </div>

        <div className={styles.validationContainer}>
          <p style={{ marginBottom: '0.5rem' }}>Your password must have:</p>

          <div className={styles.requirements}>
            <div className={styles.requirement}>
              {passwordStrength.isLengthValid ? (
                <img src='/images/check.svg' alt='Check Mark' />
              ) : (
                <img src='/images/cross.svg' alt='Cross Mark' />
              )}
              At least 6 characters long
            </div>
            <div className={styles.requirement}>
              {passwordStrength.hasLowerCase ? (
                <img src='/images/check.svg' alt='Check Mark' />
              ) : (
                <img src='/images/cross.svg' alt='Cross Mark' />
              )}
              1 lowercase letter
            </div>
            <div className={styles.requirement}>
              {passwordStrength.hasUpperCase ? (
                <img src='/images/check.svg' alt='Check Mark' />
              ) : (
                <img src='/images/cross.svg' alt='Cross Mark' />
              )}
              1 uppercase letter
            </div>
            <div className={styles.requirement}>
              {passwordStrength.hasNumber ? (
                <img src='/images/check.svg' alt='Check Mark' />
              ) : (
                <img src='/images/cross.svg' alt='Cross Mark' />
              )}
              1 number
            </div>
            <div className={styles.requirement}>
              {passwordStrength.hasSpecialChar ? (
                <img src='/images/check.svg' alt='Check Mark' />
              ) : (
                <img src='/images/cross.svg' alt='Cross Mark' />
              )}
              1 special character
            </div>
          </div>
        </div>

        <button
          type='button'
          className={styles.button}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
