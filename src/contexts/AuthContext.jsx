import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getToken, setToken, removeToken } from '../utils/storage';

export const AuthContext = createContext();

// DEVELOPMENT MOCK MODE - Set to true to bypass backend
const MOCK_MODE = true;

// Mock user data for testing
const MOCK_USER = {
  id: '123456',
  username: 'testuser',
  email: 'test@example.com',
  gems: 100
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (token exists)
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      
      if (token) {
        if (MOCK_MODE) {
          // In mock mode, just set the mock user
          setCurrentUser(MOCK_USER);
          setIsAuthenticated(true);
        } else {
          try {
            // Set the token in API headers
            api.setAuthToken(token);
            
            // Get user profile
            const response = await api.getUserProfile();
            setCurrentUser(response.data);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Auth initialization error:', error);
            // If there's an error, clear the token
            removeToken();
          }
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    if (MOCK_MODE) {
      // In mock mode, just set a fake token and user
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(2);
      setToken(mockToken);
      setCurrentUser({...MOCK_USER, username: userData.username, email: userData.email});
      setIsAuthenticated(true);
      return { success: true };
    }
    
    try {
      const response = await api.register(userData);
      const { token, user } = response.data;
      
      // Save token and set user
      setToken(token);
      api.setAuthToken(token);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (credentials) => {
    if (MOCK_MODE) {
      // In mock mode, check if email has '@' just for basic validation
      if (!credentials.email.includes('@')) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }
      
      // In mock mode, just set a fake token and user
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(2);
      setToken(mockToken);
      setCurrentUser({...MOCK_USER, email: credentials.email});
      setIsAuthenticated(true);
      return { success: true };
    }
    
    try {
      const response = await api.login(credentials);
      const { token, user } = response.data;
      
      // Save token and set user
      setToken(token);
      api.setAuthToken(token);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    removeToken();
    if (!MOCK_MODE) {
      api.removeAuthToken();
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};