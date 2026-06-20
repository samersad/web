import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { apartmentsAPI } from '../services/api';
import { ApartmentCard } from '../components/ApartmentCard';

export const Search = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    city: '',
    district: '',
    apartmentType: '',
  });

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const searchParams = {
        q: searchQuery,
        ...filters,
      };
      const response = await apartmentsAPI.getApartments(searchParams);
      const resData = response.data;
      const apartmentList = Array.isArray(resData) ? resData : (resData?.apartments || []);
      setApartments(apartmentList);
    } catch (error) {
      console.error('Error searching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      {/* Search Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Search Apartments</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-4 top-3.5 text-white opacity-70"></i>
                <input
                  type="text"
                  placeholder="Search apartments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-dark placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button
                type="submit"
                className="bg-accent hover:bg-red-600 px-8 py-3 rounded-lg font-semibold transition"
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                <select
                  value={filters.beds}
                  onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="">Any</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">City</label>
                <input
                  type="text"
                  placeholder="e.g. Cairo"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">District</label>
                <input
                  type="text"
                  placeholder="e.g. Giza"
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Apartment Type</label>
                <select
                  value={filters.apartmentType}
                  onChange={(e) => setFilters({ ...filters, apartmentType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="">Any</option>
                  <option value="apartment">Apartment</option>
                  <option value="studio">Studio</option>
                  <option value="room">Room</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : apartments.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">Found {apartments.length} apartments</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apartment) => (
                <ApartmentCard key={apartment._id} apartment={apartment} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 text-lg">No apartments found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
