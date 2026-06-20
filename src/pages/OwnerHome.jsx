import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { apartmentsAPI } from '../services/api';
import { ApartmentCard } from '../components/ApartmentCard';

export const OwnerHome = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyApartments();
  }, []);

  const fetchMyApartments = async () => {
    setLoading(true);
    try {
      const response = await apartmentsAPI.getMyApartments();
      const resData = response.data;
      const apartmentList = Array.isArray(resData) ? resData : (resData?.apartments || []);
      setApartments(apartmentList);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      {/* Hero Section with Add Button */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold mb-2">Manage Your Apartments</h2>
            <p className="text-blue-100">List and manage all your properties</p>
          </div>
          <button
            onClick={() => navigate('/add-apartment')}
            className="bg-accent hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>Add Apartment</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Apartments</p>
                <p className="text-3xl font-bold text-primary">{apartments.length}</p>
              </div>
              <i className="fas fa-building text-4xl text-primary opacity-20"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending Approval</p>
                <p className="text-3xl font-bold text-secondary">
                  {apartments.filter(a => a.status === 'pending_approval').length}
                </p>
              </div>
              <i className="fas fa-clock text-4xl text-secondary opacity-20"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Active Listings</p>
                <p className="text-3xl font-bold text-accent">
                  {apartments.filter(a => a.status === 'approved').length}
                </p>
              </div>
              <i className="fas fa-check-circle text-4xl text-accent opacity-20"></i>
            </div>
          </div>
        </div>
      </div>

      {/* My Apartments */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-primary">My Apartments</h3>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading apartments...</p>
          </div>
        ) : apartments.length > 0 ? (
          <div className="space-y-6">
            {apartments.map((apartment) => (
              <div
                key={apartment._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-40 md:h-auto bg-gray-300">
                    <img
                      src={apartment.images?.[0] || 'https://via.placeholder.com/200x150'}
                      alt={apartment.title || apartment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xl text-primary mb-2">{apartment.title || apartment.name}</h4>
                      <p className="text-gray-600 mb-2">
                        <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                        {apartment.city && apartment.district ? `${apartment.district}, ${apartment.city}` : (apartment.location || '')}
                      </p>
                      <p className="text-gray-600 mb-4">{(apartment.description_en || apartment.description_ar || apartment.description || '').substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        {apartment.beds && (
                          <span><i className="fas fa-bed mr-1 text-primary"></i>{apartment.beds} Beds</span>
                        )}
                        {apartment.rooms && (
                          <span><i className="fas fa-door-open mr-1 text-primary"></i>{apartment.rooms} Rooms</span>
                        )}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="text-right">
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-accent">${apartment.price}/mo</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          apartment.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : apartment.status === 'pending_approval'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {apartment.status}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/apartment/${apartment._id}`)}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm"
                        >
                          <i className="fas fa-eye mr-2"></i>View
                        </button>
                        <button
                          onClick={() => navigate(`/edit-apartment/${apartment._id}`)}
                          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-primary transition text-sm"
                        >
                          <i className="fas fa-edit mr-2"></i>Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 text-lg mb-4">No apartments yet</p>
            <button
              onClick={() => navigate('/add-apartment')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
            >
              <i className="fas fa-plus mr-2"></i>Add Your First Apartment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
