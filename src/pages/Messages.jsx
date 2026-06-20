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
<div className="w-full min-h-screen bg-[#f6f7fb]">
<Navbar />

{/* Hero */}
<div className="px-4 pt-8">
<div className="max-w-7xl mx-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] px-6 py-8 md:px-8">

<div className="flex flex-col md:flex-row justify-between items-center gap-6">

<div>
<div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
Activity Center
</div>

<h1 className="mt-4 text-4xl font-bold text-slate-900">
Messages
</h1>

<p className="mt-2 text-slate-500">
Chat updates, booking requests and apartment notifications
</p>
</div>

{notifications.some(n => !n.isRead) && (
<button
onClick={handleMarkAllAsRead}
className="rounded-full bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-800 transition"
>
<i className="fas fa-check-double mr-2"></i>
Mark all as read
</button>
)}

</div>

</div>
</div>

{/* Stats */}

<div className="max-w-7xl mx-auto px-4 py-8">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-white rounded-2xl p-6 shadow-sm">
<div className="flex justify-between items-center">
<div>
<p className="text-gray-500 text-sm">
Total Messages
</p>

<p className="text-3xl font-bold mt-2">
{notifications.length}
</p>
</div>

<i className="fas fa-envelope text-4xl text-gray-200"></i>
</div>
</div>

<div className="bg-white rounded-2xl p-6 shadow-sm">
<div className="flex justify-between items-center">
<div>
<p className="text-gray-500 text-sm">
Unread
</p>

<p className="text-3xl font-bold text-blue-600 mt-2">
{notifications.filter(n=>!n.isRead).length}
</p>
</div>

<i className="fas fa-bell text-4xl text-gray-200"></i>
</div>
</div>

<div className="bg-white rounded-2xl p-6 shadow-sm">
<div className="flex justify-between items-center">
<div>
<p className="text-gray-500 text-sm">
Booking Updates
</p>

<p className="text-3xl font-bold text-green-600 mt-2">
{
notifications.filter(
n=>n.type==="booking"
).length
}
</p>
</div>

<i className="fas fa-calendar-check text-4xl text-gray-200"></i>
</div>
</div>

</div>
</div>

{/* Messages */}

<div className="max-w-7xl mx-auto px-4 pb-8">

{loading ? (

<div className="text-center py-20">
<p>Loading...</p>
</div>

) : notifications.length>0 ? (

<div className="space-y-5">

{notifications.map((notification)=>(

<div
key={notification._id}
onClick={()=>
!notification.isRead &&
handleMarkAsRead(notification._id)
}
className={`bg-white rounded-[24px] p-6 shadow-sm hover:shadow-lg transition cursor-pointer border

${!notification.isRead
? 'border-blue-200'
: 'border-transparent'
}
`}
>

<div className="flex gap-5">

{/* icon */}

<div className={`w-14 h-14 rounded-full flex items-center justify-center

${notification.isRead
? 'bg-gray-100'
: 'bg-blue-100'
}`}

>

<i className={`fas ${
notification.type==="booking"
?'fa-calendar-check'
:'fa-message'
}

${notification.isRead
? 'text-gray-500'
:'text-blue-600'
}
`}
></i>

</div>

{/* content */}

<div className="flex-1">

<div className="flex justify-between items-start">

<div>

<div className="flex items-center gap-3">

<h3 className="font-bold text-lg">
{notification.title}
</h3>

{!notification.isRead && (

<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
New
</span>

)}

</div>

<p className="text-gray-600 mt-2 line-clamp-2">
{notification.message}
</p>

<p className="text-sm text-gray-400 mt-3">
{new Date(notification.createdAt)
.toLocaleString()}
</p>

</div>

{notification.relatedApartment && (

<div className="hidden md:block">

<img
src={
notification.relatedApartment.images?.[0]
||
'https://via.placeholder.com/90'
}
className="w-24 h-24 rounded-xl object-cover"
/>

</div>

)}

</div>

</div>

</div>

</div>

))}

</div>

) : (

<div className="bg-white rounded-[28px] py-20 text-center">

<i className="fas fa-inbox text-6xl text-gray-300 mb-5"></i>

<h3 className="text-2xl font-bold mb-2">
No messages yet
</h3>

<p className="text-gray-500">
New notifications and booking activity will appear here
</p>

</div>

)}

</div>

</div>
);
};
