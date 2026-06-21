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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
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
      setExistingImages(apartment.images || []);
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
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const form = new FormData();

      form.append("title", formData.title);
      form.append("description_en", formData.description_en);
      form.append("description_ar", formData.description_ar);
      form.append("price", Number(formData.price));
      form.append("city", formData.city);
      form.append("district", formData.district);
      form.append("address", formData.address);
      form.append("buildingNumber", formData.buildingNumber);
      form.append("unitNumber", formData.unitNumber);
      form.append("apartmentType", formData.apartmentType);
      form.append("beds", Number(formData.beds));
      form.append("rooms", Number(formData.rooms));
      form.append("bathrooms", formData.bathrooms ? Number(formData.bathrooms) : "");
      form.append("floor", formData.floor ? Number(formData.floor) : "");
      form.append("latitude", formData.latitude);
      form.append("longitude", formData.longitude);
      form.append("amenities", formData.amenities);
      form.append("availability", formData.availability);

      // new images only
      newImages.forEach((img) => {
        form.append("images", img);
      });

      await apartmentsAPI.updateApartment(id, form);
      
      setSuccessMessage('Apartment updated successfully!');
      setTimeout(() => {
        navigate('/my-apartment');
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

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-32">
                      <img src={img} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Image Previews */}
              {newImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {newImages.map((file, index) => {
                    const url = URL.createObjectURL(file);

                    return (
                      <div key={index} className="relative group rounded-lg overflow-hidden h-32">
                        <img src={url} className="w-full h-full object-cover" />

                        <button
                          type="button"
                          onClick={() =>
                            setNewImages(prev => prev.filter((_, i) => i !== index))
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Video</h2>

            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setFormData({ ...formData, video: e.target.files[0] })
              }
            />

            {formData.video && (
              <video
                controls
                className="w-full mt-4 rounded-lg"
                src={URL.createObjectURL(formData.video)}
              />
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Description</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
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
              onClick={() => navigate('/my-apartment')}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Editing Apartment...' : 'Edit Apartment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
