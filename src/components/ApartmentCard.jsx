import React from 'react';
import { Link } from 'react-router-dom';

export const ApartmentCard = ({ apartment }) => {
  // Backward-compatible: support both real API fields and mock fields
  const displayName = apartment.title || apartment.name || 'Untitled';
  const displayLocation = apartment.city && apartment.district
    ? `${apartment.district}, ${apartment.city}`
    : apartment.location || apartment.city || '';
  const displayDescription = apartment.description_en || apartment.description || '';
  const displayImage = apartment.images?.[0] || 'https://via.placeholder.com/300x200';

  return (
    <Link
      to={`/apartment/${apartment._id}`}
      className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105 bg-white"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-gray-300">
        <img
          src={displayImage}
          alt={displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-lg text-sm font-semibold">
          ${apartment.price}/month
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-primary mb-2 line-clamp-2">{displayName}</h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
          <span className="line-clamp-1">{displayLocation}</span>
        </div>

        {/* Features */}
        <div className="flex justify-between text-sm text-gray-700 mb-3 pb-3 border-b border-gray-200">
          {apartment.beds && (
            <div className="flex items-center">
              <i className="fas fa-bed mr-0.5 text-primary"></i>
              <span>{apartment.beds} Beds</span>
            </div>
          )}
          {apartment.rooms && (
            <div className="flex items-center">
              <i className="fas fa-door-open mr-0.5 text-primary"></i>
              <span>{apartment.rooms} Rooms</span>
            </div>
          )}
          {apartment.bathrooms && (
            <div className="flex items-center">
              <i className="fas fa-bath mr-0.5 text-primary"></i>
              <span>{apartment.bathrooms} Bath</span>
            </div>
          )}
          {apartment.floor && (
            <div className="flex items-center">
              <i className="fas fa-layer-group mr-0.5 text-primary"></i>
              <span>Floor {apartment.floor}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i>
            <span className="font-semibold text-sm">{apartment.rating || apartment.averageRating || '—'}</span>
          </div>
          <button className="text-primary hover:text-secondary transition">
            <i className="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </Link>
  );
};
