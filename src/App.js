// src/App.js - Fixed version
import React from 'react';
import Dashboard from './components/Dashboard';
import { AuthContext } from './contexts/AuthContext';
import './App.css';

function App() {
  // Anonymous user for anyone to start playing without login
  const currentUser = {
    username: 'Anonymous',
    gems: 100
  };
  
  // Bypass authentication
  const isAuthenticated = true;
  const loading = false;

  // Mock auth functions
  const mockAuth = {
    currentUser,
    isAuthenticated,
    loading,
    login: () => {},
    logout: () => {},
    register: () => {}
  };

  return (
    <AuthContext.Provider value={mockAuth}>
      <div className="App">
        <Dashboard />
      </div>
    </AuthContext.Provider>
  );
}

export default App;