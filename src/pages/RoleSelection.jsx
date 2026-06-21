import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

export const RoleSelection = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = async (selectedRole) => {
    setLoading(true);
    setError('');
    try {
      await usersAPI.updateProfile({ role: selectedRole });
      await fetchUser(); // reload context user with new role
      navigate('/home');
    } catch (err) {
      setError(err?.message || err.response?.data?.message || 'Failed to update account role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#0b1b3d] via-[#0A3D62] to-[#154674] px-4 py-12 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md shadow-2xl md:p-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl drop-shadow-md">
          Welcome to SOKON
        </h1>
        <p className="mt-4 text-white/80 text-lg">
          Please select your account type to proceed with setting up your profile
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Student Card */}
          <button
            onClick={() => handleRoleSelect('student')}
            disabled={loading}
            className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition duration-300 hover:scale-105 hover:border-blue-400 hover:bg-white/10 disabled:opacity-50"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 transition group-hover:bg-blue-500 group-hover:text-white">
              <i className="fa-solid fa-graduation-cap text-3xl"></i>
            </div>
            <h3 className="mt-6 text-2xl font-black">Student</h3>
            <p className="mt-3 text-white/60 text-sm leading-relaxed">
              Find safe, verified housing close to your university and book rooms instantly.
            </p>
          </button>

          {/* Owner Card */}
          <button
            onClick={() => handleRoleSelect('owner')}
            disabled={loading}
            className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-white/10 disabled:opacity-50"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 transition group-hover:bg-emerald-50 group-hover:text-white">
              <i className="fa-solid fa-hotel text-3xl"></i>
            </div>
            <h3 className="mt-6 text-2xl font-black">Property Owner</h3>
            <p className="mt-3 text-white/60 text-sm leading-relaxed">
              List your apartments, manage student bookings, and view analytics dashboards.
            </p>
          </button>
        </div>

        {loading && (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};
