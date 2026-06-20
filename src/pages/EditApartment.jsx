import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { apartmentsAPI } from '../services/api';

export const EditApartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    availability: 'available',
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchApartmentDetails();
  }, [id]);

  const fetchApartmentDetails = async () => {
    try {
      const response = await apartmentsAPI.getApartment(id);
      // Handle both nested and flat response
      const apartment = response.data?.apartment || response.data;
      setFormData({
        title: apartment.title || apartment.name || '',
        description_en: apartment.description_en || apartment.description || '',
        description_ar: apartment.description_ar || '',
        price: apartment.price || '',
        city: apartment.city || '',
        district: apartment.district || '',
        address: apartment.address || '',
        buildingNumber: apartment.buildingNumber || '',
        unitNumber: apartment.unitNumber || '',
        apartmentType: apartment.apartmentType || 'apartment',
        beds: apartment.beds || '',
        rooms: apartment.rooms || '',
        bathrooms: apartment.bathrooms || '',
        floor: apartment.floor || '',
        amenities: Array.isArray(apartment.amenities) ? apartment.amenities.join(',') : (apartment.amenities || ''),
        latitude: apartment.latitude || apartment.location?.coordinates?.[1] || '',
        longitude: apartment.longitude || apartment.location?.coordinates?.[0] || '',
        availability: apartment.availability || 'available',
        images: [],
      });
      setPreview(apartment.images || []);
    } catch (error) {
      setError('Failed to load apartment details');
      console.error('Error fetching apartment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));

    const previews = files.map(file => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        beds: Number(formData.beds),
        rooms: Number(formData.rooms),
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        floor: formData.floor ? Number(formData.floor) : undefined,
      };

      // Only include images if new ones were selected
      if (formData.images.length === 0) {
        delete submitData.images;
      }

      await apartmentsAPI.updateApartment(id, submitData);
      setSuccessMessage('Apartment updated successfully!');
      setTimeout(() => {
        navigate('/owner-home');
      }, 2000);
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors) {
        const messages = errData.errors.map(e => `${e.path || e.param}: ${e.msg}`).join(', ');
        setError(messages);
      } else {
        setError(errData?.message || 'Failed to update apartment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-light">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-600">Loading apartment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Edit Apartment</h1>
          <p className="text-gray-600">Update your apartment details</p>
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
                <label className="block text-gray-700 font-semibold mb-2">Apartment Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Apartment Type</label>
                <select
                  name="apartmentType"
                  value={formData.apartmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="apartment">Apartment</option>
                  <option value="studio">Studio</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price per Month (EGP)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Building No.</label>
                  <input
                    type="text"
                    name="buildingNumber"
                    value={formData.buildingNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Unit No.</label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Room Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Rooms</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Amenities</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="wifi,desk,balcony,ac (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">Separate amenities with commas</p>
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
                  <p className="text-gray-700 font-semibold">Click to upload new photos</p>
                  <p className="text-gray-500 text-sm">Leave empty to keep existing photos</p>
                </label>
              </div>

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
                <label className="block text-gray-700 font-semibold mb-2">Description (English)</label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description (Arabic)</label>
                <textarea
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleChange}
                  rows="4"
                  dir="rtl"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition"
            >
              Update Apartment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
