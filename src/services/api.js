const mockUser = {
  _id: 'student_1',
  fullName: 'Design Preview User',
  email: 'student@example.com',
  phone: '01000000000',
  role: 'owner',
  preferredLanguage: 'en',
  gender: 'male',
  university: 'Assuit University',
  faculty: 'Engineering',
  isVerified: true,
  isBlocked: false,
  createdAt: '2026-01-15T10:00:00.000Z',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
};

let mockApartments = [
  {
    _id: 'apt_1',
    title: 'Sunny Apartment Near Assuit University',
    name: 'Sunny Apartment Near Assuit University',
    description: 'A bright furnished apartment five minutes from campus with WiFi, AC, a study desk, and a quiet balcony.',
    description_en: 'A bright furnished apartment five minutes from campus with WiFi, AC, a study desk, and a quiet balcony.',
    price: 4500,
    city: 'Assuit',
    district: 'Downtown',
    location: 'Downtown, Assuit',
    beds: 2,
    rooms: 3,
    bathrooms: 1,
    floor: 3,
    apartmentType: 'apartment',
    status: 'approved',
    availability: 'available',
    amenities: ['wifi', 'ac', 'desk', 'balcony'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80',
    ],
    owner: mockUser,
  },
  {
    _id: 'apt_2',
    title: 'Modern Studio for Students',
    name: 'Modern Studio for Students',
    description: 'Compact studio with clean finishes, natural light, and easy access to transport and daily services.',
    description_en: 'Compact studio with clean finishes, natural light, and easy access to transport and daily services.',
    price: 3200,
    city: 'Assuit',
    district: 'University District',
    location: 'University District, Assuit',
    beds: 1,
    rooms: 1,
    bathrooms: 1,
    floor: 2,
    apartmentType: 'studio',
    status: 'pending_approval',
    availability: 'available',
    amenities: ['wifi', 'desk'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80',
    ],
    owner: mockUser,
  },
  {
    _id: 'apt_3',
    title: 'Shared Apartment With Large Living Room',
    name: 'Shared Apartment With Large Living Room',
    description: 'Comfortable shared apartment with spacious rooms, a fitted kitchen, and secure building access.',
    description_en: 'Comfortable shared apartment with spacious rooms, a fitted kitchen, and secure building access.',
    price: 5200,
    city: 'Assuit',
    district: 'North Assuit',
    location: 'North Assuit, Assuit',
    beds: 3,
    rooms: 4,
    bathrooms: 2,
    floor: 5,
    apartmentType: 'apartment',
    status: 'approved',
    availability: 'available',
    amenities: ['wifi', 'kitchen', 'security'],
    images: [
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=80',
    ],
    owner: mockUser,
  },
];

let mockNotifications = [
  {
    _id: 'msg_1',
    title: 'Booking request received',
    message: 'A student sent a request for Sunny Apartment Near Assuit University.',
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedApartment: mockApartments[0],
  },
  {
    _id: 'msg_2',
    title: 'Apartment approved',
    message: 'Your listing is now visible in search results.',
    isRead: true,
    createdAt: '2026-06-18T12:30:00.000Z',
    relatedApartment: mockApartments[2],
  },
];

const respond = (data) => Promise.resolve({ data });

const filterApartments = (filters = {}) => {
  const q = filters.q?.toLowerCase?.() || '';
  return mockApartments.filter((apartment) => {
    const matchesQuery = !q || [apartment.title, apartment.city, apartment.district, apartment.description]
      .join(' ')
      .toLowerCase()
      .includes(q);
    const matchesMin = !filters.minPrice || apartment.price >= Number(filters.minPrice);
    const matchesMax = !filters.maxPrice || apartment.price <= Number(filters.maxPrice);
    const matchesBeds = !filters.beds || apartment.beds >= Number(filters.beds);
    const matchesCity = !filters.city || apartment.city.toLowerCase().includes(filters.city.toLowerCase());
    const matchesDistrict = !filters.district || apartment.district.toLowerCase().includes(filters.district.toLowerCase());
    const matchesType = !filters.apartmentType || apartment.apartmentType === filters.apartmentType;
    return matchesQuery && matchesMin && matchesMax && matchesBeds && matchesCity && matchesDistrict && matchesType;
  });
};

export const authAPI = {
  register: (data, role) => respond({ user: { ...mockUser, ...data, role }, message: 'Design-only registration complete.' }),
  login: (email) => respond({
    user: { ...mockUser, email },
    accessToken: 'design-token',
    refreshToken: 'design-refresh-token',
  }),
  logout: () => respond({ message: 'Logged out' }),
  verifyEmail: () => respond({ message: 'Email verified' }),
  forgotPassword: () => respond({ message: 'Password reset email sent' }),
  resetPassword: () => respond({ message: 'Password reset complete' }),
};

export const usersAPI = {
  getMe: () => respond({ user: mockUser }),
  updateProfile: (data) => {
    Object.assign(mockUser, data, {
      avatar: data.avatar instanceof File ? URL.createObjectURL(data.avatar) : data.avatar || mockUser.avatar,
    });
    return respond(mockUser);
  },
  getUsers: () => respond([mockUser]),
  getUser: () => respond(mockUser),
  adminUpdateUser: (_, data) => respond({ ...mockUser, ...data }),
  deleteUser: () => respond({ message: 'User removed' }),
};

export const apartmentsAPI = {
  getApartments: (filters = {}) => respond({ apartments: filterApartments(filters) }),
  getApartment: (id) => respond(mockApartments.find((apartment) => apartment._id === id) || mockApartments[0]),
  getMyApartments: () => respond({ apartments: mockApartments }),
  createApartment: (data) => {
    const apartment = {
      _id: `apt_${Date.now()}`,
      ...data,
      name: data.title,
      status: 'pending_approval',
      owner: mockUser,
      images: data.images?.length ? data.images.map((file) => URL.createObjectURL(file)) : mockApartments[0].images,
    };
    mockApartments = [apartment, ...mockApartments];
    return respond(apartment);
  },
  updateApartment: (id, data) => {
    mockApartments = mockApartments.map((apartment) => (
      apartment._id === id
        ? { ...apartment, ...data, images: data.images?.length ? data.images.map((file) => URL.createObjectURL(file)) : apartment.images }
        : apartment
    ));
    return respond(mockApartments.find((apartment) => apartment._id === id));
  },
  deleteApartment: (id) => {
    mockApartments = mockApartments.filter((apartment) => apartment._id !== id);
    return respond({ message: 'Apartment removed' });
  },
};

export const bookingsAPI = {
  getMyBookings: () => respond([]),
  createBooking: () => respond({ message: 'Booking request sent' }),
  cancelBooking: () => respond({ message: 'Booking cancelled' }),
  acceptBooking: () => respond({ message: 'Booking accepted' }),
  rejectBooking: () => respond({ message: 'Booking rejected' }),
};

export const reviewsAPI = {
  getApartmentReviews: () => respond({ reviews: [] }),
  createReview: () => respond({ message: 'Review added' }),
  deleteReview: () => respond({ message: 'Review removed' }),
};

export const notificationsAPI = {
  getMyNotifications: () => respond({ notifications: mockNotifications }),
  markAllAsRead: () => {
    mockNotifications = mockNotifications.map((notification) => ({ ...notification, isRead: true }));
    return respond({ message: 'All read' });
  },
  markAsRead: (id) => {
    mockNotifications = mockNotifications.map((notification) => (
      notification._id === id ? { ...notification, isRead: true } : notification
    ));
    return respond({ message: 'Read' });
  },
};

export const adminAPI = {
  blockUser: () => respond({ message: 'User blocked' }),
  unblockUser: () => respond({ message: 'User unblocked' }),
  approveApartment: () => respond({ message: 'Apartment approved' }),
  rejectApartment: () => respond({ message: 'Apartment rejected' }),
  removeApartment: () => respond({ message: 'Apartment removed' }),
  createAnnouncement: () => respond({ message: 'Announcement created' }),
};

export const analyticsAPI = {
  getDashboard: () => respond({ apartments: mockApartments.length, users: 1, bookings: 0 }),
};

export default {
  get: () => respond({}),
  post: () => respond({}),
  patch: () => respond({}),
  delete: () => respond({}),
};
