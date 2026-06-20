import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { apartmentsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ApartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    checkInDate: '',
    checkOutDate: '',
    message: '',
  });

  useEffect(() => {
    fetchApartmentDetails();
  }, [id]);

  const fetchApartmentDetails = async () => {
    try {
      const response = await apartmentsAPI.getApartment(id);
      setApartment(response.data);
    } catch (error) {
      console.error('Error fetching apartment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    if (e) e.preventDefault();
    if (user?.role !== 'student') {
      alert('Only students can book apartments');
      return;
    }
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      alert('Please select both Check-In and Check-Out dates.');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingsAPI.createBooking({
        apartmentId: id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        message: bookingForm.message || 'I would like to book this apartment.',
      });
      setBookingSuccess('Booking request sent successfully!');
      setIsBookingModalOpen(false);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
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

  if (!apartment) {
    return (
      <div className="w-full min-h-screen bg-light">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-600">Apartment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {bookingSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {bookingSuccess}
          </div>
        )}

        {/* Video/Main Image */}
        <div className="relative mb-8 rounded-[2rem] overflow-hidden shadow-lg h-[500px]">
          {apartment.videoUrl ? (
            <div className="w-full h-full bg-gray-900">
              <iframe
                width="100%"
                height="100%"
                src={apartment.videoUrl}
                title="Apartment Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          ) : (
            <img
              src={apartment.images?.[0] || 'https://via.placeholder.com/800x450'}
              alt={apartment.title || apartment.name}
              className="w-full h-full object-cover"
            />
          )}

          {/* Title & Info Card Overlay */}
          <div className="absolute bottom-6 left-6 right-6 md:right-auto text-white p-6 rounded-3xl max-w-md z-10">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1 leading-snug">
              {apartment.title || apartment.name}
            </h1>
            <p className=" font-medium text-sm mb-3 flex items-center">
              <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
              {apartment.city && apartment.district ? `${apartment.district}, ${apartment.city}` : (apartment.location || '')}
            </p>
            <div className="flex items-center gap-4 font-semibold text-sm">
              {apartment.beds && (
                <span className="flex items-center gap-2">
                  <i className="fas fa-bed text-blue-500 text-base"></i>
                  {apartment.beds} Bedroom
                </span>
              )}
              {apartment.bathrooms && (
                <span className="flex items-center gap-2">
                  <i className="fas fa-bath text-blue-500 text-base"></i>
                  {apartment.bathrooms} Bathroom
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 my-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#112D4E]">Description</h2>
              <span className="flex items-center gap-1.5 text-blue-500 font-semibold text-base">
                <i className="fas fa-check-circle text-blue-500"></i> Verified
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed text-base font-normal">
              {apartment.description_en || apartment.description_ar || apartment.description}
            </p>
          </div>
          <div className="text-right whitespace-nowrap self-end md:self-auto min-w-[150px]">
            <span className="text-3xl font-extrabold text-[#112D4E]">${apartment.price}</span>
            <span className="text-gray-500 font-medium text-sm">/month</span>
          </div>
        </div>

        {/* Owner Info Card */}
        {apartment.owner && (
          <div className="bg-[#f3f6fa] rounded-[2rem] p-6 flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img
                src={apartment.owner.avatar || 'https://via.placeholder.com/80'}
                alt={apartment.owner.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-bold text-[#112D4E] text-lg leading-tight">{apartment.owner.fullName}</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Owner</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href={`tel:${apartment.owner.phone}`}
                className="w-12 h-12 rounded-full border border-blue-100 bg-white flex items-center justify-center text-blue-500 hover:bg-blue-50 transition shadow-sm text-lg"
                title="Call Owner"
              >
                <i className="fas fa-phone-alt"></i>
              </a>
              <button
                onClick={() => alert(`Starting a messaging thread with ${apartment.owner.fullName}...`)}
                className="w-12 h-12 rounded-full border border-blue-100 bg-white flex items-center justify-center text-blue-500 hover:bg-blue-50 transition shadow-sm text-lg"
                title="Message Owner"
              >
                <i className="far fa-comment-dots"></i>
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        {apartment.images && apartment.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#112D4E]">Gallery</h2>
            <p className="text-xs text-gray-400 font-semibold mb-4">Take a look inside</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {apartment.images.slice(0, 4).map((image, index) => {
                const isLast = index === 3;
                const hasMore = apartment.images.length > 4;
                return (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:opacity-90 transition group"
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {isLast && hasMore && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white text-xl font-bold">
                        +{apartment.images.length - 4}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex justify-center max-w-md mx-auto my-12">
          {user?.role === 'student' && (
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full py-4 text-center rounded-2xl bg-[#3f72af] hover:bg-[#112d4e] text-white font-bold shadow-md transition text-lg"
            >
              Rent Now
            </button>
          )}

          {user?.role === 'owner' && user?._id === apartment.owner?._id && (
            <button
              onClick={() => navigate(`/edit-apartment/${id}`)}
              className="w-full py-4 text-center rounded-2xl bg-[#3f72af] hover:bg-[#112d4e] text-white font-bold shadow-md transition text-lg"
            >
              Edit Apartment
            </button>
          )}

          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 text-center rounded-2xl bg-[#3f72af] hover:bg-[#112d4e] text-white font-bold shadow-md transition text-lg"
            >
              Login to Rent
            </button>
          )}
        </div>
      </div>

      {/* Booking Date-Picker & Message Modal Overlay */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100 transform scale-100 transition-all duration-300">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
            <h3 className="text-2xl font-bold text-[#112D4E] mb-6 flex items-center gap-2">
              <i className="far fa-calendar-alt text-blue-500"></i> Book Apartment
            </h3>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-xs font-semibold mb-1">CHECK-IN DATE</label>
                <input
                  type="date"
                  value={bookingForm.checkInDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-xs font-semibold mb-1">CHECK-OUT DATE</label>
                <input
                  type="date"
                  value={bookingForm.checkOutDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-xs font-semibold mb-1">MESSAGE TO OWNER</label>
                <textarea
                  placeholder="Hi! I am a student and I'd love to rent your apartment..."
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-[#112D4E] hover:bg-[#0f243e] text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-50"
                >
                  {bookingLoading ? 'Sending Booking Request...' : 'Confirm Rent Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
