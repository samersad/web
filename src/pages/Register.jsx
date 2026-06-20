import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [step, setStep] = useState(1); // 1: role selection, 2: form
  const [role, setRole] = useState(''); // 'student' or 'owner'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select a role before continuing.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        preferredLanguage: 'en',
        gender: 'male',
      };
      await register(registerData, role);
      navigate('/login?registered=true');
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      setError(serverMessage || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-[30vh] bg-[#f2f2f2] flex items-center justify-center text-[#0A3D62]">
        <h1 className="text-[36px] font-bold drop-shadow-md">SOKON</h1>
      </div>

      <div className="w-full h-[70vh] text-center bg-[#f2f2f2] ">
        <div className="pt-[50px] bg-[#fcfcfc] h-[70vh] rounded-t-[60px]">

          {step === 1 ? (
            <div className="flex flex-col items-center px-4">
              <h3 className="text-[24px] font-bold mb-2">Sign Up</h3>
              <p className="text-gray-600 mb-6">Choose your account type</p>

              <div className="w-[350px] space-y-4">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full p-6 border border-[#d1d5db] rounded-lg text-left hover:border-[#245999] hover:bg-blue-50 transition"
                >
                  <div className="text-[18px] font-bold text-[#0A3D62]">I am a Student</div>
                  <div className="text-gray-600 text-sm">Find the perfect apartment</div>
                </button>

                <button
                  onClick={() => handleRoleSelect('owner')}
                  className="w-full p-6 border border-[#d1d5db] rounded-lg text-left hover:border-[#245999] hover:bg-blue-50 transition"
                >
                  <div className="text-[18px] font-bold text-[#0A3D62]">I am an Owner</div>
                  <div className="text-gray-600 text-sm">List your apartments</div>
                </button>
              </div>

              <div className="mt-6">
                <p className="text-gray-600">Already have an account? <a href="/login" className="text-[#245999] font-bold">Login</a></p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <button onClick={() => setStep(1)} className="mb-6 text-[#245999]">&larr; Back</button>

              <h3 className="text-[22px] font-bold mb-4">{role === 'student' ? 'Student' : 'Owner'} Registration</h3>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg w-[350px]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col items-center w-[350px]">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full h-[50px] px-2 mb-3 border border-[#ccc] rounded-[5px]"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full h-[50px] px-2 mb-3 border border-[#ccc] rounded-[5px]"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone"
                  className="w-full h-[50px] px-2 mb-3 border border-[#ccc] rounded-[5px]"
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full h-[50px] px-2 mb-3 border border-[#ccc] rounded-[5px]"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                  className="w-full h-[50px] px-2 mb-4 border border-[#ccc] rounded-[5px]"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-[175px] h-[45px] rounded-[8px] bg-[#245999] text-white mb-4"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <div className="flex justify-center gap-[24px] mt-[24px] mb-[12px]">
                <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#f2f2f2] shadow-md hover:bg-gray-200 transition transform hover:-translate-y-0.5 hover:scale-105">
                  <a href="#"><i className="fa-brands fa-google text-[24px] text-[#245999]"></i></a>
                </div>
                <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#f2f2f2] shadow-md hover:bg-gray-200 transition transform hover:-translate-y-0.5 hover:scale-105">
                  <a href="#"><i className="fa-brands fa-apple text-[24px] text-[#245999]"></i></a>
                </div>
                <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-[#f2f2f2] shadow-md hover:bg-gray-200 transition transform hover:-translate-y-0.5 hover:scale-105">
                  <a href="#"><i className="fa-brands fa-facebook text-[24px] text-[#245999]"></i></a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
