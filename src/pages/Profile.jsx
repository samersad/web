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
        faculty: user.faculty || '',
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
      setMessage(error?.message || error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-gray-100">
    <Navbar />

    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-2xl ${
            message.includes("successfully")
              ? "bg-green-100 border border-green-300 text-green-700"
              : "bg-red-100 border border-red-300 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">

        {/* Left Side */}
        <div className="bg-white rounded-3xl shadow-md p-8 h-fit">

          <div className="flex flex-col items-center">

            <div className="relative">

              <img
                src={preview}
                alt="Profile"
                className="
                w-40
                h-40
                rounded-full
                object-cover
                border-4
                border-gray-200"
              />

              {isEditing && (
                <label
                  className="
                  absolute
                  bottom-0
                  right-0
                  bg-black
                  p-3
                  rounded-full
                  text-white
                  cursor-pointer"
                >

                  <i className="fas fa-camera"></i>

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                </label>
              )}

            </div>

            <h1 className="mt-5 text-2xl font-bold">
              {user?.fullName}
            </h1>

            <p className="text-gray-500 mt-2 capitalize">
              {user?.role}
            </p>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="
                mt-6
                w-full
                bg-black
                text-white
                py-3
                rounded-xl
                hover:opacity-90
                duration-300"
              >
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </button>
            )}

          </div>

        </div>

        {/* Right Side */}

        <div className="bg-white rounded-3xl shadow-md p-8">

          {!isEditing ? (

            <>
              <h2 className="text-2xl font-bold mb-8">
                Account Information
              </h2>

              <div className="space-y-6">

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500 font-medium">
                    Full Name
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {user?.fullName}
                  </h3>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500 font-medium">
                    Email
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {user?.email}
                  </h3>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500 font-medium">
                    Phone Number
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {user?.phone || "No phone"}
                  </h3>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500 font-medium">
                    Account Type
                  </p>

                  <h3 className="mt-2 text-lg font-semibold capitalize">
                    {user?.role}
                  </h3>
                </div>

                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500 font-medium">
                    Gender
                  </p>

                  <h3 className="mt-2 text-lg font-semibold capitalize">
                    {user?.gender || "Not specified"}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Faculty
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {user?.faculty || "Not specified"}
                  </h3>
                </div>

              </div>

            </>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <h2 className="text-2xl font-bold mb-8">
                Edit Profile
              </h2>

              <div>
                <label className="block mb-2 font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  border
                  rounded-xl
                  focus:outline-none
                  focus:ring-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  border
                  rounded-xl
                  focus:outline-none
                  focus:ring-2"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Email
                </label>

                <input
                  value={formData.email}
                  disabled
                  className="
                  w-full
                  p-4
                  bg-gray-100
                  border
                  rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Gender
                </label>

                <input
                  value={formData.gender}
                  disabled
                  className="
                  w-full
                  p-4
                  bg-gray-100
                  border
                  rounded-xl
                  capitalize"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Faculty
                </label>

                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="
                  w-full
                  p-4
                  border
                  rounded-xl
                  focus:outline-none
                  focus:ring-2"
                />
              </div>

              <div className="flex gap-4 pt-4">

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-black
                  text-white"
                >
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>
  </div>
);
};
