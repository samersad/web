import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { apartmentsAPI } from '../services/api';

export const AddApartment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description_en: '',
    description_ar: '',
    price: '',
    city: '',
    district: '',
    address: '',
    buildingNumber: '',
    unitNumber: '',
    apartmentType: 'apartment',
    beds: '',
    rooms: '',
    bathrooms: '',
    floor: '',
    amenities: '',
    latitude: '',
    longitude: '',
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        beds: Number(formData.beds),
        rooms: Number(formData.rooms),
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        floor: formData.floor ? Number(formData.floor) : undefined,
      };

      await apartmentsAPI.createApartment(submitData);
      setSuccessMessage('Apartment added successfully! It will be reviewed before publishing.');
      setTimeout(() => {
        navigate('/owner-home');
      }, 2000);
    } catch (err) {
      const errData = err.response?.data;
      // Handle validation errors (422)
      if (errData?.errors) {
        const messages = errData.errors.map(e => `${e.path || e.param}: ${e.msg}`).join(', ');
        setError(messages);
      } else {
        setError(errData?.message || 'Failed to add apartment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Add New Apartment</h1>
          <p className="text-gray-600">Fill in all the details to list your apartment</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Apartment Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Sunny Apartment Near University"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price per Month (EGP) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value="Asyut"
                  onChange={handleChange}                  
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  District *
                </label>

                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select District</option>
                  <option value="Feryal">Feryal</option>
                  <option value="Sayed">Sayed</option>
                  <option value="Qulta">Qulta</option>
                  <option value="City">City</option>
                  <option value="El Gomhoria">El Gomhoria</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Main Street"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="30.0444"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="31.2357"
                />
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Room Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bedrooms *</label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Rooms *</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Floor</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="3"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Extra Details</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="wifi,desk,balcony,ac (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">Separate details with commas</p>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Photos</h2>

            <div>
              <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="file"
                  multiple
                  accept="image/jpg,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-primary mb-4"></i>
                  <p className="text-gray-700 font-semibold">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">JPG, JPEG, PNG, WebP up to 10MB</p>
                </label>
              </div>

              {/* Image Previews */}
              {preview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {preview.map((img, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-32 bg-gray-300">
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Description</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description (English) *</label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your apartment in English..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/owner-home')}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Adding Apartment...' : 'Add Apartment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
