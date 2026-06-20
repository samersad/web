import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loading } from './components/Loading/Loading';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentHome } from './pages/StudentHome';
import { OwnerHome } from './pages/OwnerHome';
import { Search } from './pages/Search';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { AddApartment } from './pages/AddApartment';
import { EditApartment } from './pages/EditApartment';
import { ApartmentDetails } from './pages/ApartmentDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
            path="/owner-home"
            element={
              <ProtectedRoute requiredRole="owner">
                <OwnerHome />
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
            path="/edit-apartment/:id"
            element={
              <ProtectedRoute requiredRole="owner">
                <EditApartment />
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

          {/* Catch-all route */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
