import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { notificationsAPI } from '../services/api';

export const Messages = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsAPI.getMyNotifications();
      const resData = response.data;
      const notificationList = Array.isArray(resData) ? resData : (resData?.notifications || []);
      setNotifications(notificationList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Messages & Notifications</h1>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading messages...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  notification.isRead ? 'border-gray-300' : 'border-primary'
                } hover:shadow-lg transition cursor-pointer`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-lg text-primary">{notification.title}</h3>
                      {!notification.isRead && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {notification.relatedApartment && (
                    <div className="ml-4 text-right">
                      <img
                        src={notification.relatedApartment.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={notification.relatedApartment.title || notification.relatedApartment.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <p className="text-sm text-gray-600 mt-2">{notification.relatedApartment.title || notification.relatedApartment.name}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <i className="fas fa-envelope text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 text-lg">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
