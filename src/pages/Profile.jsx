import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: null,
    gender: user?.gender || '',
    university: user?.university || '',
    faculty: user?.faculty || '',
    preferredLanguage: user?.preferredLanguage || 'en',
  });
  const [preview, setPreview] = useState(user?.avatar || 'https://via.placeholder.com/200');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null,
        gender: user.gender || '',
        university: user.university || '',
        faculty: user.faculty || '',
        preferredLanguage: user.preferredLanguage || 'en',
      });
      setPreview(user.avatar || 'https://via.placeholder.com/200');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        university: formData.university,
        faculty: formData.faculty,
        preferredLanguage: formData.preferredLanguage,
      };

      if (formData.avatar) {
        updateData.avatar = formData.avatar;
      }

      const response = await usersAPI.updateProfile(updateData);
      setUser(response.data);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully')
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8 -mt-20">
              {/* Avatar */}
              <div className="relative z-10">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-secondary transition">
                    <i className="fas fa-camera"></i>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold text-primary mb-2">{user?.fullName}</h1>
                <p className="text-gray-600 mb-4">
                  <i className="fas fa-envelope mr-2 text-primary"></i>
                  {user?.email}
                </p>
                <p className="text-gray-600 mb-4">
                  <i className="fas fa-phone mr-2 text-primary"></i>
                  {user?.phone}
                </p>
                <div className="inline-block bg-blue-100 text-primary px-4 py-2 rounded-full font-semibold capitalize">
                  {user?.role} Account
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
                >
                  <i className="fas fa-edit mr-2"></i>Edit Profile
                </button>
              )}
            </div>

            {/* Edit Form */}
            {isEditing && (
              <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">University</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Faculty</label>
                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPreview(user?.avatar || 'https://via.placeholder.com/200');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-secondary transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Account Info */}
            {!isEditing && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h2 className="text-2xl font-bold text-primary mb-4">Account Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Account Type</p>
                    <p className="text-lg font-bold text-primary capitalize">{user?.role}</p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Email Verification</p>
                    <p className="text-lg font-bold">
                      {user?.isVerified ? (
                        <span className="text-green-600"><i className="fas fa-check mr-2"></i>Verified</span>
                      ) : (
                        <span className="text-red-600"><i className="fas fa-times mr-2"></i>Not Verified</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Gender</p>
                    <p className="text-lg font-bold capitalize">{user?.gender || 'Not specified'}</p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Preferred Language</p>
                    <p className="text-lg font-bold uppercase">{user?.preferredLanguage || 'en'}</p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">University</p>
                    <p className="text-lg font-bold">{user?.university || 'Not specified'}</p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Faculty</p>
                    <p className="text-lg font-bold">{user?.faculty || 'Not specified'}</p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Account Status</p>
                    <p className="text-lg font-bold">
                      {user?.isBlocked ? (
                        <span className="text-red-600">Blocked</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-light p-4 rounded-lg">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Member Since</p>
                    <p className="text-lg font-bold">
                      {user?.createdAt ? new Date(user?.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
