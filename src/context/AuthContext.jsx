import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const previewUser = {
  _id: 'student_1',
  fullName: 'Romany Khairi',
  email: 'romany@example.com',
  phone: '01000000000',
  role: 'owner',
  gender: 'male',
  faculty: 'Computer Science',
  preferredLanguage: 'en',
  isVerified: true,
  isBlocked: false,
  createdAt: '2026-01-15T10:00:00.000Z',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);

        return parsedUser;
      }

      // Preview Mode
      setUser(previewUser);
      setIsAuthenticated(true);

      return previewUser;

    } catch (error) {
      console.log(error);

      setUser(null);
      setIsAuthenticated(false);

    } finally {
      setLoading(false);
    }
  };

  const login = async (email) => {
    const loggedInUser = {
      ...previewUser,
      email,
    };

    setUser(loggedInUser);

    localStorage.setItem(
      'user',
      JSON.stringify(loggedInUser)
    );

    setIsAuthenticated(true);

    return {
      user: loggedInUser,
    };
  };

  const register = async (data, role) => {
    const registeredUser = {
      ...previewUser,
      ...data,
      role,
    };

    setUser(registeredUser);

    localStorage.setItem(
      'user',
      JSON.stringify(registeredUser)
    );

    setIsAuthenticated(true);

    return {
      user: registeredUser,
    };
  };

  const logout = async () => {
    localStorage.removeItem('user');

    setUser(null);

    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};
