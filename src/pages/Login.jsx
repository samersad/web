import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-[30vh] bg-[#f2f2f2] flex items-center justify-center text-[#0A3D62]">
        <h1 className="text-[36px] font-bold drop-shadow-md">SOKON</h1>
      </div>

      <div className="w-full h-[70vh] text-center bg-[#f2f2f2]">
        <div className="pt-[50px] bg-[#fcfcfc] h-[70vh] rounded-t-[60px]">
          <div className="pb-[50px] text-[24px] font-bold">
            <h2 className="text-[#0A3D62]">Login</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg w-[350px] mx-auto">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
            <div className="mb-2">
              <input
                type="text"
                id="username"
                name="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
                required
                className="w-[350px] h-[50px] px-2 border border-[#ccc] rounded-[5px] bg-white"
              />
            </div>

            <div className="mb-2">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-[350px] h-[50px] px-2 border border-[#ccc] rounded-[5px] bg-white"
              />
            </div>

            <div className="w-[350px] text-right">
              <a href="#" className="text-[14px] text-[#245999]">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-[175px] h-[45px] mt-5 rounded-[8px] bg-[#245999] text-white text-[16px]"
            >
              {loading ? 'Logging in...' : 'Login'}
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

          <div className="mt-5">
            <p>Don't have an account? <Link to="/register" className="text-[#245999] font-medium">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};
