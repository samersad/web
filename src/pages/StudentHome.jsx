import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { apartmentsAPI } from '../services/api';
import { ApartmentCard } from '../components/ApartmentCard';

export const StudentHome = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
  });
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const response = await apartmentsAPI.getApartments(searchFilters);
      const resData = response.data;
      const apartmentList = Array.isArray(resData) ? resData : (resData?.apartments || []);
      setApartments(apartmentList);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = {
      q: searchQuery,
      ...filters,
    };
    fetchApartments(searchParams);
  };

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      {/* Search Section */}
      <div className=" py-8 px-4">
        <div className="max-w-7xl mx-auto">

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass py-1 absolute left-4 top-3.5 text-black opacity-70"></i>
                <input
                  type="text"
                  placeholder="Search apartments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 py-3 border border-gray-300 rounded-lg text-dark placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white rounded-lg font-semibold transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
          <iframe
            src="https://www.google.com/maps?q=Asyut,Egypt&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        </div>
      </div>

      {/* Featured Apartments */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-primary">Featured Apartments</h3>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading apartments...</p>
          </div>
        ) : apartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apartment) => (
              <ApartmentCard key={apartment._id} apartment={apartment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No apartments found</p>
          </div>
        )}
      </div>

      {/* Top Locations */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-primary">
          Top Locations in Assuit
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'Downtown', image: 'https://via.placeholder.com/300x200' },
            { name: 'North Assuit', image: 'https://via.placeholder.com/300x200' },
            { name: 'South Assuit', image: 'https://via.placeholder.com/300x200' },
            { name: 'South ', image: 'https://via.placeholder.com/300x200' },
            { name: 'seed', image: 'https://via.placeholder.com/300x200' },
          ].map((location) => (
            <div
              key={location.name}
              className="grid grid-cols-3 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
            >
              
              {/* Image */}
              <div className="col-span-1 ms-5">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="col-span-2 flex items-center justify-end p-4 me-5">
                <h4 className="font-bold text-lg text-primary">
                  {location.name}
                </h4>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Nearby Apartments */}
      <div className="max-w-7xl mx-auto px-4 py-8 mb-8">
        <h3 className="text-2xl font-bold mb-6 text-primary">Nearby Apartments</h3>
        {apartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.slice(0, 4).map((apartment) => (
              <ApartmentCard key={apartment._id} apartment={apartment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No nearby apartments found</p>
          </div>
        )}
      </div>
    </div>
  );
};
