import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const previewUser = {
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(previewUser);
  const [loading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const fetchUser = async () => {
    setUser((currentUser) => currentUser || previewUser);
    setIsAuthenticated(true);
    return user || previewUser;
  };

  const login = async (email) => {
    const loggedInUser = { ...previewUser, email };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return { user: loggedInUser };
  };

  const register = async (data, role) => {
    const registeredUser = { ...previewUser, ...data, role };
    setUser(registeredUser);
    setIsAuthenticated(true);
    return { user: registeredUser };
  };

  const logout = async () => {
    setUser(previewUser);
    setIsAuthenticated(true);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
