const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS with credentials matching frontend axios client config
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend calls /api/... while the mock routes below are defined as /api/v1/...
app.use('/api', (req, res, next) => {
  if (!req.url.startsWith('/v1/')) {
    req.url = `/v1${req.url}`;
  }
  next();
});

// Setup multer for parsing multipart/form-data (used in updateProfile and createApartment)
const upload = multer({ dest: 'uploads/' });

// In-Memory Database state
let users = [
  {
    _id: "student_1",
    fullName: "Student User",
    email: "student@example.com",
    phone: "01000000000",
    password: "password123",
    role: "student",
    preferredLanguage: "en",
    gender: "male",
    avatar: ""
  },
  {
    _id: "owner_1",
    fullName: "Owner User",
    email: "owner@example.com",
    phone: "01111111111",
    password: "password123",
    role: "owner",
    preferredLanguage: "en",
    gender: "male",
    avatar: ""
  }
];

let apartments = [
  {
    _id: "apt_1",
    name: "Sunny Apartment Near Assuit University",
    title: "Sunny Apartment Near Assuit University",
    description: "A beautiful 2-bedroom student apartment located just 5 minutes walk from Assuit University. Fully furnished, includes high-speed WiFi, AC, and a studying desk.",
    price: 4500,
    city: "Assuit",
    district: "Downtown",
    location: "Downtown, Assuit",
    beds: 2,
    rooms: 2,
    floor: 3,
    apartmentType: "apartment",
    status: "approved",
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
    owner: {
      _id: "owner_1",
      fullName: "Owner User",
      email: "owner@example.com",
      phone: "01111111111",
      avatar: ""
    }
  },
  {
    _id: "apt_2",
    name: "Cozy Studio Near Cairo University",
    title: "Cozy Studio Near Cairo University",
    description: "Perfect studio for single students. Includes all basic amenities, close to public transport and supermarkets.",
    price: 3000,
    city: "Cairo",
    district: "Giza",
    location: "Giza, Cairo",
    beds: 1,
    rooms: 1,
    floor: 1,
    apartmentType: "apartment",
    status: "approved",
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"],
    owner: {
      _id: "owner_1",
      fullName: "Owner User",
      email: "owner@example.com",
      phone: "01111111111",
      avatar: ""
    }
  }
];

let bookings = [];
let reviews = [];
let notifications = [];

// Helper middleware to authenticate mock user via Authorization header
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  // Parse userId from token format token_for_${userId}
  const userId = token.replace('token_for_', '');
  const user = users.find(u => u._id === userId);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found or session expired' });
  }
  req.user = user;
  next();
};

// --- System Endpoints ---
app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'healthy', timestamp: new Date() } });
});

// --- Auth Endpoints ---
app.post('/api/v1/auth/register/student', (req, res) => {
  const { fullName, email, phone, password, preferredLanguage, gender } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  const newUser = {
    _id: `student_${Date.now()}`,
    fullName,
    email,
    phone,
    password,
    role: 'student',
    preferredLanguage: preferredLanguage || 'en',
    gender: gender || 'male',
    avatar: ''
  };
  users.push(newUser);
  res.status(201).json({
    success: true,
    data: {
      user: newUser,
      accessToken: `token_for_${newUser._id}`,
      refreshToken: `refresh_for_${newUser._id}`
    }
  });
});

app.post('/api/v1/auth/register/owner', (req, res) => {
  const { fullName, email, phone, password, preferredLanguage, gender } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  const newUser = {
    _id: `owner_${Date.now()}`,
    fullName,
    email,
    phone,
    password,
    role: 'owner',
    preferredLanguage: preferredLanguage || 'en',
    gender: gender || 'male',
    avatar: ''
  };
  users.push(newUser);
  res.status(201).json({
    success: true,
    data: {
      user: newUser,
      accessToken: `token_for_${newUser._id}`,
      refreshToken: `refresh_for_${newUser._id}`
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  res.json({
    success: true,
    data: {
      user,
      accessToken: `token_for_${user._id}`,
      refreshToken: `refresh_for_${user._id}`
    }
  });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token required' });
  }
  const userId = refreshToken.replace('refresh_for_', '');
  const user = users.find(u => u._id === userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
  res.json({
    success: true,
    data: {
      accessToken: `token_for_${user._id}`,
      refreshToken: `refresh_for_${user._id}`
    }
  });
});

app.post('/api/v1/auth/logout', (req, res) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

// --- Users Endpoints ---
app.get('/api/v1/users/me', authenticateUser, (req, res) => {
  res.json({ success: true, data: req.user });
});

app.patch('/api/v1/users/me', authenticateUser, upload.single('avatar'), (req, res) => {
  const user = users.find(u => u._id === req.user._id);
  if (req.body.fullName) user.fullName = req.body.fullName;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.gender) user.gender = req.body.gender;
  if (req.body.university) user.university = req.body.university;
  if (req.body.faculty) user.faculty = req.body.faculty;
  if (req.body.preferredLanguage) user.preferredLanguage = req.body.preferredLanguage;
  if (req.file) {
    user.avatar = `https://via.placeholder.com/200?text=${encodeURIComponent(user.fullName)}`;
  }
  res.json({ success: true, data: user });
});

app.get('/api/v1/users', authenticateUser, (req, res) => {
  res.json({ success: true, data: users });
});

app.get('/api/v1/users/:id', authenticateUser, (req, res) => {
  const user = users.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

// --- Apartments Endpoints ---
app.get('/api/v1/apartments', (req, res) => {
  let result = [...apartments];
  const { city, district, apartmentType, beds, minPrice, maxPrice, q } = req.query;
  
  if (city) {
    result = result.filter(a => a.city.toLowerCase() === city.toLowerCase());
  }
  if (district) {
    result = result.filter(a => a.district.toLowerCase() === district.toLowerCase());
  }
  if (apartmentType) {
    result = result.filter(a => a.apartmentType === apartmentType);
  }
  if (beds) {
    result = result.filter(a => a.beds >= parseInt(beds));
  }
  if (minPrice) {
    result = result.filter(a => a.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    result = result.filter(a => a.price <= parseInt(maxPrice));
  }
  if (q) {
    const search = q.toLowerCase();
    result = result.filter(a => 
      a.name.toLowerCase().includes(search) || 
      a.description.toLowerCase().includes(search) || 
      a.location.toLowerCase().includes(search)
    );
  }

  res.json({ success: true, data: result });
});

app.get('/api/v1/apartments/mine', authenticateUser, (req, res) => {
  const myApartments = apartments.filter(a => a.owner._id === req.user._id);
  res.json({ success: true, data: myApartments });
});

app.get('/api/v1/apartments/:id', (req, res) => {
  const apartment = apartments.find(a => a._id === req.params.id);
  if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });
  res.json({ success: true, data: apartment });
});

app.post('/api/v1/apartments', authenticateUser, upload.array('images'), (req, res) => {
  const { title, description_ar, description_en, price, city, district, address, buildingNumber, unitNumber, apartmentType, beds, rooms, bathrooms, floor, amenities, latitude, longitude } = req.body;
  
  const newApartment = {
    _id: `apt_${Date.now()}`,
    name: title,
    title,
    description: description_en || description_ar || 'No description provided.',
    description_ar,
    description_en,
    price: parseFloat(price) || 0,
    city,
    district,
    address,
    buildingNumber,
    unitNumber,
    apartmentType: apartmentType || 'apartment',
    beds: parseInt(beds) || 1,
    rooms: parseInt(rooms) || 1,
    bathrooms: parseInt(bathrooms) || 1,
    floor: parseInt(floor) || 0,
    amenities: amenities ? amenities.split(',') : [],
    location: `${district || ''}, ${city || ''}`,
    status: 'approved', // Auto-approve in mock server for ease of use
    rating: 5.0,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
    owner: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      avatar: req.user.avatar
    }
  };
  apartments.push(newApartment);
  res.status(201).json({ success: true, data: newApartment });
});

app.patch('/api/v1/apartments/:id', authenticateUser, upload.array('images'), (req, res) => {
  const apartment = apartments.find(a => a._id === req.params.id);
  if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });
  
  // Verify ownership
  if (apartment.owner._id !== req.user._id) {
    return res.status(403).json({ success: false, message: 'Unauthorized to modify this apartment' });
  }

  const fields = ['title', 'price', 'availability', 'description', 'beds', 'rooms', 'floor'];
  fields.forEach(field => {
    if (req.body[field] !== undefined) {
      if (field === 'price') apartment.price = parseFloat(req.body.price);
      else if (field === 'title') {
        apartment.title = req.body.title;
        apartment.name = req.body.title;
      }
      else apartment[field] = req.body[field];
    }
  });

  res.json({ success: true, data: apartment });
});

app.delete('/api/v1/apartments/:id', authenticateUser, (req, res) => {
  const aptIdx = apartments.findIndex(a => a._id === req.params.id);
  if (aptIdx === -1) return res.status(404).json({ success: false, message: 'Apartment not found' });
  
  if (apartments[aptIdx].owner._id !== req.user._id) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  apartments.splice(aptIdx, 1);
  res.json({ success: true, data: { message: 'Apartment deleted successfully' } });
});

// --- Bookings Endpoints ---
app.get('/api/v1/bookings/mine', authenticateUser, (req, res) => {
  let result = [];
  if (req.user.role === 'student') {
    result = bookings.filter(b => b.student._id === req.user._id);
  } else {
    // Owner gets bookings for their apartments
    result = bookings.filter(b => b.apartment.owner._id === req.user._id);
  }
  res.json({ success: true, data: result });
});

app.post('/api/v1/bookings', authenticateUser, (req, res) => {
  const { apartmentId, message, checkInDate, checkOutDate } = req.body;
  const apartment = apartments.find(a => a._id === apartmentId);
  if (!apartment) return res.status(404).json({ success: false, message: 'Apartment not found' });

  const newBooking = {
    _id: `booking_${Date.now()}`,
    apartment,
    student: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone
    },
    message: message || '',
    checkInDate: checkInDate || new Date().toISOString(),
    checkOutDate: checkOutDate || new Date().toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  
  // Add notification to apartment owner
  notifications.push({
    _id: `notif_${Date.now()}`,
    userId: apartment.owner._id,
    type: 'booking_request',
    title: 'New Booking Request',
    message: `${req.user.fullName} sent a booking request for your apartment ${apartment.name}.`,
    isRead: false,
    relatedApartment: apartment,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ success: true, data: newBooking });
});

app.patch('/api/v1/bookings/:id/cancel', authenticateUser, (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = 'cancelled';
  res.json({ success: true, data: booking });
});

app.patch('/api/v1/bookings/:id/accept', authenticateUser, (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = 'accepted';

  // Notify student
  notifications.push({
    _id: `notif_${Date.now()}`,
    userId: booking.student._id,
    type: 'booking_accepted',
    title: 'Booking Accepted',
    message: `Your booking request for ${booking.apartment.name} has been accepted by the owner!`,
    isRead: false,
    relatedApartment: booking.apartment,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, data: booking });
});

app.patch('/api/v1/bookings/:id/reject', authenticateUser, (req, res) => {
  const booking = bookings.find(b => b._id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  booking.status = 'rejected';

  // Notify student
  notifications.push({
    _id: `notif_${Date.now()}`,
    userId: booking.student._id,
    type: 'booking_rejected',
    title: 'Booking Rejected',
    message: `Your booking request for ${booking.apartment.name} was rejected by the owner.`,
    isRead: false,
    relatedApartment: booking.apartment,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, data: booking });
});

// --- Reviews Endpoints ---
app.get('/api/v1/reviews/apartments/:apartmentId', (req, res) => {
  const apartmentReviews = reviews.filter(r => r.apartmentId === req.params.apartmentId);
  res.json({ success: true, data: apartmentReviews });
});

app.post('/api/v1/reviews', authenticateUser, (req, res) => {
  const { apartmentId, rating, comment } = req.body;
  const newReview = {
    _id: `review_${Date.now()}`,
    apartmentId,
    rating: parseInt(rating) || 5,
    comment: comment || '',
    user: {
      _id: req.user._id,
      fullName: req.user.fullName,
      avatar: req.user.avatar
    },
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  res.status(201).json({ success: true, data: newReview });
});

// --- Notifications Endpoints ---
app.get('/api/v1/notifications/mine', authenticateUser, (req, res) => {
  const myNotifs = notifications.filter(n => n.userId === req.user._id);
  res.json({ success: true, data: myNotifs });
});

app.patch('/api/v1/notifications/read-all', authenticateUser, (req, res) => {
  notifications.forEach(n => {
    if (n.userId === req.user._id) n.isRead = true;
  });
  res.json({ success: true, message: 'All notifications marked as read' });
});

app.patch('/api/v1/notifications/:id/read', authenticateUser, (req, res) => {
  const notif = notifications.find(n => n._id === req.params.id && n.userId === req.user._id);
  if (notif) notif.isRead = true;
  res.json({ success: true, data: notif });
});

// Start the server
app.listen(port, () => {
  console.log(`Mock server is running on http://localhost:${port}`);
});
