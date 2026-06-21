import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ForgotPasswordLayout,
  ForgotPasswordButton,
  ForgotPasswordError,
} from '../components/ForgotPasswordLayout';
import { OtpInput } from '../components/OtpInput';
import { authAPI } from '../services/api';
import verificationImg from '../assets/forgetpass.png';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (otp.length !== 4) {
      setError('Please enter the 4-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      await authAPI.verifyEmail({ email, otp });
      navigate('/forgot-password/reset', { state: { email, otp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout heroImage={verificationImg}>
      {error && <ForgotPasswordError message={error} />}

      <p className="mb-4 max-w-[340px] text-center text-[14px] text-[#6b7280] leading-relaxed">
        We will send you one time password this email address.
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <OtpInput value={otp} onChange={setOtp} />

        <div className="mt-8 w-full flex justify-center">
          <ForgotPasswordButton disabled={loading}>
            {loading ? 'Verifying...' : 'Submit'}
          </ForgotPasswordButton>
        </div>
      </form>
    </ForgotPasswordLayout>
  );
};
