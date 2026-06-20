import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { bookingsAPI } from '../services/api';

export const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getMyBookings();
      const resData = response.data;
      const bookingList = Array.isArray(resData) ? resData : (resData?.bookings || []);
      setBookings(bookingList);
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, action) => {
    try {
      if (action === 'approved') {
        await bookingsAPI.acceptBooking(id);
      } else {
        await bookingsAPI.rejectBooking(id);
      }

      setBookings((currentBookings) => currentBookings.map((booking) => (
        booking._id === id ? { ...booking, status: action } : booking
      )));
    } catch (error) {
      console.error('Error updating booking request:', error);
    }
  };

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
  };

  return (
    <div className="w-full min-h-screen bg-[#f6f7fb]">
      <Navbar />

      <div className="px-4 pt-8">
        <div className="max-w-7xl mx-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Owner workspace
              </div>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">Booking Requests</h2>
              <p className="mt-2 max-w-2xl text-slate-600">
                Review student requests and approve or decline apartment bookings
              </p>
            </div>
            <button
              onClick={() => navigate('/my-apartment')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              <i className="fas fa-building"></i>
              <span>My Apartments</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Requests</p>
                <p className="text-3xl font-bold text-primary">{bookings.length}</p>
              </div>
              <i className="fas fa-calendar-check text-4xl text-primary opacity-20"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending Requests</p>
                <p className="text-3xl font-bold text-secondary">
                  {bookings.filter((booking) => booking.status === 'pending').length}
                </p>
              </div>
              <i className="fas fa-clock text-4xl text-secondary opacity-20"></i>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Approved</p>
                <p className="text-3xl font-bold text-accent">
                  {bookings.filter((booking) => booking.status === 'approved').length}
                </p>
              </div>
              <i className="fas fa-check-circle text-4xl text-accent opacity-20"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-primary">Student Requests</h3>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading booking requests...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-40 md:h-auto bg-gray-300">
                    <img
                      src={booking.apartment?.images?.[0] || 'https://via.placeholder.com/200x150'}
                      alt={booking.apartment?.title || booking.apartment?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6 flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={booking.student?.avatar || 'https://via.placeholder.com/64'}
                          alt={booking.student?.fullName}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xl text-primary">{booking.student?.fullName}</h4>
                          <p className="text-gray-600 text-sm">
                            {booking.student?.faculty} - {booking.student?.university}
                          </p>
                          <p className="text-gray-600 text-sm">
                            <i className="fas fa-phone mr-2 text-primary"></i>{booking.student?.phone}
                          </p>
                        </div>
                      </div>

                      <h5 className="font-bold text-lg text-primary mb-2">
                        {booking.apartment?.title || booking.apartment?.name}
                      </h5>
                      <p className="text-gray-600 mb-2">
                        <i className="fas fa-map-marker-alt mr-2 text-primary"></i>
                        {booking.apartment?.district}, {booking.apartment?.city}
                      </p>
                      <p className="text-gray-600 mb-4">{booking.message}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                        <span><i className="fas fa-calendar-day mr-1 text-primary"></i>From {booking.checkInDate}</span>
                        <span><i className="fas fa-calendar-week mr-1 text-primary"></i>To {booking.checkOutDate}</span>
                        <span><i className="fas fa-money-bill-wave mr-1 text-primary"></i>${booking.apartment?.price}/mo</span>
                        <span><i className="fas fa-bed mr-1 text-primary"></i>{booking.apartment?.beds} Beds</span>
                        <span><i className="fas fa-door-open mr-1 text-primary"></i>{booking.apartment?.rooms} Rooms</span>
                        <span><i className="fas fa-clock mr-1 text-primary"></i>{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right min-w-[170px]">
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[booking.status] || statusStyles.pending}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => navigate(`/apartment/${booking.apartment?._id}`)}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition text-sm"
                        >
                          <i className="fas fa-eye mr-2"></i>View Apartment
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'approved')}
                          disabled={booking.status !== 'pending'}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-check mr-2"></i>Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'declined')}
                          disabled={booking.status !== 'pending'}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="fas fa-times mr-2"></i>Decline
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
            <i className="fas fa-calendar-xmark text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 text-lg">No booking requests yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
