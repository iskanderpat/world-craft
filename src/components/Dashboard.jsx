// src/components/Dashboard.jsx - COMPLETE FILE
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ElementsGrid from './ElementsGrid';
import InfiniteCraftingArea from './InfiniteCraftingArea';
import TargetBar from './TargetBar';

const Dashboard = () => {
  const [elements, setElements] = useState([]);
  const [combining, setCombining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [craftingHistory, setCraftingHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetWords, setTargetWords] = useState([
    { word: 'Earthquake', discovered: false },
    { word: 'Life', discovered: false },
    { word: 'Robot', discovered: false },
    { word: 'Computer', discovered: false },
    { word: 'James Bond', discovered: false }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user elements
        const elementsResponse = await api.getUserElements();
        setElements(elementsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  // Handle element combination
  const handleCombine = async (element1, element2) => {
    if (!element1 || !element2 || combining) return;
    
    setCombining(true);
    try {
      const response = await api.combineElements([element1._id, element2._id]);
      const newElement = response.data;
      
      // Check if element already exists in collection
      const elementExists = elements.some(e => e._id === newElement._id);
      
      if (!elementExists) {
        // Add to elements collection
        setElements([...elements, newElement]);
        
        // Check if this is a target word
        const updatedTargets = [...targetWords];
        const targetIndex = updatedTargets.findIndex(
          target => target.word.toLowerCase() === newElement.name.toLowerCase()
        );
        
        if (targetIndex !== -1) {
          updatedTargets[targetIndex].discovered = true;
          setTargetWords(updatedTargets);
        }
      }
      
      // Add to crafting history
      setCraftingHistory([
        {
          inputs: [element1, element2],
          output: newElement,
          timestamp: new Date()
        },
        ...craftingHistory
      ].slice(0, 10)); // Keep only the 10 most recent
      
      return newElement;
    } catch (error) {
      console.error('Error combining elements:', error);
      return null;
    } finally {
      setCombining(false);
    }
  };
  
  return (
    <div className="infinite-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">Infinite Craft</div>
      </div>
      
      <TargetBar targets={targetWords} />
      
      <div className="infinite-layout">
        <div className="crafting-container">
          <InfiniteCraftingArea 
            onCombine={handleCombine}
            combining={combining}
          />
        </div>
        
        <div className="elements-sidebar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          {loading ? (
            <div className="loading">Loading elements...</div>
          ) : (
            <ElementsGrid 
              elements={filteredElements}
              crafting={combining}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;