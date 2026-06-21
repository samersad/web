import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ForgotPasswordLayout,
  ForgotPasswordField,
  ForgotPasswordButton,
  ForgotPasswordError,
} from '../components/ForgotPasswordLayout';
import { authAPI } from '../services/api';
import forgetpassImg from '../assets/forgetpass.png';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword({ email, otp, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout heroImage={forgetpassImg}>
      {error && <ForgotPasswordError message={error} />}

      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <ForgotPasswordField
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="New Password"
        />

        <ForgotPasswordField
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm New Password"
        />

        <ForgotPasswordButton disabled={loading}>
          {loading ? 'Saving...' : 'Finish'}
        </ForgotPasswordButton>
      </form>
    </ForgotPasswordLayout>
  );
};
