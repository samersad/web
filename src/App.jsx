import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loading } from './components/Loading/Loading';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOTP } from './pages/VerifyOTP';
import { ResetPassword } from './pages/ResetPassword';
import { StudentHome } from './pages/StudentHome';
import { MyApartment } from './pages/MyApartment';
import { Search } from './pages/Search';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { AddApartment } from './pages/AddApartment';
import { EditApartment } from './pages/EditApartment';
import { ApartmentDetails } from './pages/ApartmentDetails';
import { BookingRequests } from './pages/BookingRequests';
import { MyBookings } from './pages/MyBookings';
import { ChatPage } from './pages/ChatPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/verify" element={<VerifyOTP />} />
          <Route path="/forgot-password/reset" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowUnauthenticated={true}>
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-apartment"
            element={
              <ProtectedRoute requiredRole="owner">
                <MyApartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-apartment"
            element={
              <ProtectedRoute requiredRole="owner">
                <AddApartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-requests"
            element={
              <ProtectedRoute requiredRole="owner">
                <BookingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-apartment/:id"
            element={
              <ProtectedRoute requiredRole="owner">
                <EditApartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute requiredRole="student">
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apartment/:id"
            element={
              <ProtectedRoute>
                <ApartmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:id"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
