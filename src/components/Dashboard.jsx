// src/components/Dashboard.jsx - Complete file with drag and drop
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import CraftingHistory from './CraftingHistory';
import SessionTimer from './SessionTimer';
import ElementsGrid from './ElementsGrid';
import ModernCraftingArea from './ModernCraftingArea';

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [elements, setElements] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [combining, setCombining] = useState(false);
  const [newDiscovery, setNewDiscovery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [craftingHistory, setCraftingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByTime, setSortByTime] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user elements
        const elementsResponse = await api.getUserElements();
        setElements(elementsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Could not load elements. You may be in mock mode.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter elements based on search term
  const filteredElements = elements.filter(element => 
    element.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort elements if needed
  const sortedElements = sortByTime 
    ? [...filteredElements].sort((a, b) => new Date(b.discoveredAt) - new Date(a.discoveredAt))
    : filteredElements;

  // Handle element selection
  const handleElementSelect = (element) => {
    if (combining) return; // Prevent selection while combining
    
    // Check if element is already selected
    const isSelected = selectedElements.some(e => e._id === element._id);
    
    if (isSelected) {
      // Remove from selection
      setSelectedElements(selectedElements.filter(e => e._id !== element._id));
    } else {
      // Add to selection (max 2)
      if (selectedElements.length < 2) {
        setSelectedElements([...selectedElements, element]);
      } else {
        // Replace the first element if already have 2
        setSelectedElements([selectedElements[1], element]);
      }
    }
  };

  // Handle dropping element into crafting area
  const handleDropElement = (droppedElement) => {
    if (combining) return; // Prevent selection while combining
    
    // Check if element is already selected
    const isAlreadySelected = selectedElements.some(e => e._id === droppedElement._id);
    
    if (!isAlreadySelected) {
      // Add to selection (max 2)
      if (selectedElements.length < 2) {
        setSelectedElements([...selectedElements, droppedElement]);
      } else {
        // Replace the first element if already have 2
        setSelectedElements([selectedElements[1], droppedElement]);
      }
    }
  };

  // Handle combination
  const handleCombine = async () => {
    if (selectedElements.length !== 2) return;
    
    setCombining(true);
    try {
      const response = await api.combineElements(selectedElements.map(e => e._id));
      const newElement = response.data;
      
      // Check if element already exists in collection
      const elementExists = elements.some(e => e._id === newElement._id);
      
      if (!elementExists) {
        // Add to elements collection
        setElements([...elements, newElement]);
      }
      
      // Add to crafting history
      setCraftingHistory([
        {
          inputs: selectedElements,
          output: newElement,
          timestamp: new Date()
        },
        ...craftingHistory
      ].slice(0, 10)); // Keep only the 10 most recent
      
      // Show discovery notification
      setNewDiscovery(newElement);
      
      // Clear selection
      setSelectedElements([]);
    } catch (error) {
      console.error('Error combining elements:', error);
      setError('Failed to combine elements');
    } finally {
      setCombining(false);
    }
  };

  // Handle session expiration
  const handleSessionExpire = () => {
    console.log('Session expired');
    // You could add more functionality here, like disabling combining
  };

  // Clear selected elements
  const handleClear = () => {
    setSelectedElements([]);
  };

  // Close discovery notification
  const closeDiscovery = () => {
    setNewDiscovery(null);
  };

  // Toggle sort order
  const toggleSort = () => {
    setSortByTime(!sortByTime);
  };

  return (
    <div className="modern-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">World Craft</div>
        <div className="user-info">
          <SessionTimer 
            initialMinutes={30} 
            onExpire={handleSessionExpire}
          />
          <div className="user-gems">
            <span className="gem-icon">💎</span>
            <span className="gem-count">{currentUser?.gems || 0}</span>
          </div>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="main-content">
          <div className="crafting-and-history">
            <div className="crafting-section">
              <ModernCraftingArea 
                selectedElements={selectedElements}
                onCombine={handleCombine}
                onClear={handleClear}
                combining={combining}
                onDropElement={handleDropElement}
              />
            </div>
            
            <div className="history-section">
              <CraftingHistory history={craftingHistory} />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading">Loading elements...</div>
          ) : (
            <div className="elements-section">
              <div className="elements-controls">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search elements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                
                <div className="element-actions">
                  <button 
                    className="discoveries-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    ✨ Discoveries
                  </button>
                  <button 
                    className="sort-btn"
                    onClick={toggleSort}
                  >
                    ⏱️ Sort by {sortByTime ? 'name' : 'time'}
                  </button>
                </div>
              </div>
              
              <ElementsGrid 
                elements={sortedElements}
                onElementClick={handleElementSelect}
                selectedElements={selectedElements}
              />
            </div>
          )}
        </div>
      </div>
      
      {newDiscovery && (
        <div className="discovery-modal">
          <div className="discovery-content">
            <h3>New Discovery!</h3>
            <div className="discovery-element">
              <div className="element-icon large">{
                (() => {
                  const name = newDiscovery.name.toLowerCase();
                  if (name === 'water') return '💧';
                  if (name === 'fire') return '🔥';
                  if (name === 'earth') return '🌍';
                  if (name === 'air') return '💨';
                  if (name === 'steam') return '♨️';
                  if (name === 'mud') return '🟤';
                  if (name === 'lava') return '🌋';
                  if (name === 'dust') return '💨';
                  if (name === 'energy') return '⚡';
                  if (name === 'life') return '🌱';
                  return '🔮';
                })()
              }</div>
              <h2>{newDiscovery.name}</h2>
              <p>{newDiscovery.description}</p>
            </div>
            <button onClick={closeDiscovery} className="close-btn">Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;