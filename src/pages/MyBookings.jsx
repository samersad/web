import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

export const MyBookings = () => {
  const [bookings,setBookings]=useState([]);
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();

  useEffect(()=>{
    fetchBookings();
  },[]);

  const fetchBookings=async()=>{

    setLoading(true);

    try{

      const response=await bookingsAPI.getStudentBookings();

      const resData=response.data;

      const bookingList=Array.isArray(resData)
      ?resData
      :(resData?.bookings || []);

      setBookings(bookingList);

    }

    catch(error){
      console.log(error);
    }

    finally{
      setLoading(false);
    }

  };



const handleCancelBooking=async(id)=>{

const confirmDelete=window.confirm(
'Cancel this booking request?'
);

if(!confirmDelete)return;

try{

await bookingsAPI.cancelBooking(id);

setBookings(
current=>
current.filter(
booking=>booking._id!==id
)
);

}

catch(error){

console.log(error);

}

};


const statusStyles={

pending:'bg-yellow-100 text-yellow-700',

approved:'bg-green-100 text-green-700',

declined:'bg-red-100 text-red-700'

};


return(

<div className="min-h-screen bg-[#f6f7fb]">

<Navbar/>


{/* Hero */}

<div className="px-4 pt-8">

<div className="
max-w-7xl
mx-auto
rounded-[28px]
border
border-slate-200
bg-white
shadow-[0_12px_40px_rgba(15,23,42,0.08)]
px-6
py-8
md:px-8">

<div className="
flex
flex-col
md:flex-row
justify-between
items-center
gap-6">

<div>

<div className="
inline-flex
items-center
rounded-full
bg-slate-100
px-3
py-1
text-xs
font-semibold
uppercase">

Student Workspace

</div>

<h2 className="
mt-4
text-4xl
font-bold">

My Bookings

</h2>

<p className="
mt-2
text-slate-600">

Track your apartment booking requests

</p>

</div>

<button
onClick={()=>navigate('/search')}
className="
rounded-full
bg-slate-900
px-6
py-3
text-white
font-bold
hover:bg-slate-800
transition"
>

<i className="
fas
fa-search
mr-2"></i>

Search Apartments

</button>

</div>

</div>

</div>



{/* Statistics */}

<div className="
max-w-7xl
mx-auto
px-4
py-8">

<div className="
grid
grid-cols-1
md:grid-cols-3
gap-6">

<div className="
bg-white
rounded-lg
shadow-md
p-6
border-l-4
border-blue-500">

<p className="
text-sm
text-gray-600
font-semibold">

Total Requests

</p>

<p className="
text-3xl
font-bold">

{bookings.length}

</p>

</div>



<div className="
bg-white
rounded-lg
shadow-md
p-6
border-l-4
border-yellow-500">

<p className="
text-sm
text-gray-600
font-semibold">

Pending

</p>

<p className="
text-3xl
font-bold">

{bookings.filter(
b=>b.status==="pending"
).length}

</p>

</div>



<div className="
bg-white
rounded-lg
shadow-md
p-6
border-l-4
border-green-500">

<p className="
text-sm
text-gray-600
font-semibold">

Approved

</p>

<p className="
text-3xl
font-bold">

{bookings.filter(
b=>b.status==="approved"
).length}

</p>

</div>

</div>

</div>



{/* Bookings */}

<div className="
max-w-7xl
mx-auto
px-4
pb-8">

<h3 className="
text-2xl
font-bold
mb-6">

Booking History

</h3>


{loading ? (

<div className="
text-center
py-16">

Loading...

</div>

)

:

bookings.length>0

?

(

<div className="space-y-6">

{bookings.map((booking)=>(

<div
key={booking._id}
className="
bg-white
rounded-3xl
shadow-md
overflow-hidden
hover:shadow-lg
transition"
>

<div className="
flex
flex-col
md:flex-row">

{/* Image */}

<div className="
md:w-[260px]
h-[220px]">

<img
src={
booking.apartment?.images?.[0]
||
'https://via.placeholder.com/300'
}

className="
w-full
h-full
object-cover"
/>

</div>



<div className="
flex-1
p-6
flex
justify-between
gap-8
flex-col
lg:flex-row">


<div>

<h4 className="
font-bold
text-2xl
mb-3">

{booking.apartment?.title}

</h4>

<p className="
text-gray-600
mb-2">

<i className="
fas
fa-location-dot
mr-2"></i>

{booking.apartment?.district},
{' '}
{booking.apartment?.city}

</p>


<p className="
text-gray-600
mb-5">

{booking.message}

</p>


<div className="
grid
md:grid-cols-2
gap-3
text-sm">

<span>
<i className="
fas
fa-calendar
mr-2"></i>

{booking.checkInDate}

</span>

<span>

<i className="
fas
fa-money-bill
mr-2"></i>

${booking.apartment?.price}/mo

</span>

</div>

</div>



<div className="
min-w-[180px]
text-right">

<div className="mb-5">

<span
className={`
inline-block
px-4
py-2
rounded-full
font-semibold
${statusStyles[booking.status]}
`}
>

{booking.status}

</span>

</div>


<div className="
flex
flex-col
gap-3">

<button
onClick={()=>
navigate(
`/apartment/${booking.apartment?._id}`
)
}
className="
bg-slate-900
text-white
px-4
py-3
rounded-xl"
>

View Apartment

</button>


{booking.status==="pending" && (

<button
onClick={()=>
handleCancelBooking(
booking._id
)
}
className="
bg-red-600
text-white
px-4
py-3
rounded-xl"
>

Cancel Request

</button>

)}

</div>

</div>

</div>

</div>

</div>

))}

</div>

)

:

(

<div className="
bg-white
rounded-3xl
text-center
py-20">

<i className="
fas
fa-calendar-xmark
text-6xl
text-gray-300
mb-5"></i>

<h3 className="
text-xl
font-bold
mb-2">

No booking requests

</h3>

<p className="text-gray-500">

You haven't booked any apartments yet

</p>

</div>

)

}

</div>

</div>

)

};