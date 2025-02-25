// src/components/InfiniteCraftingArea.jsx - COMPLETE FILE
import React, { useState, useRef, useEffect, useCallback } from 'react';

const InfiniteCraftingArea = ({ onCombine, combining }) => {
  const [droppedElements, setDroppedElements] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [sparklePosition, setSparklePosition] = useState(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Create audio element for success sound
    const audio = new Audio('/success-sound.mp3');
    audioRef.current = audio;
    
    // Preload the sound
    audio.load();
    
    return () => {
      // Clean up
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Define checkForCombinations with useCallback to avoid dependency issues
  const checkForCombinations = useCallback(async () => {
    if (combining) return;
    
    for (let i = 0; i < droppedElements.length; i++) {
      for (let j = i + 1; j < droppedElements.length; j++) {
        const elem1 = droppedElements[i];
        const elem2 = droppedElements[j];
        
        // Calculate distance between elements
        const dx = elem1.position.x - elem2.position.x;
        const dy = elem1.position.y - elem2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If elements are close enough, combine them
        if (distance < 80) {
          // Remove both elements from the crafting area
          const updatedElements = droppedElements.filter((_, index) => index !== i && index !== j);
          
          // Calculate midpoint for sparkle animation
          const midX = (elem1.position.x + elem2.position.x) / 2;
          const midY = (elem1.position.y + elem2.position.y) / 2;
          
          // Try to combine the elements
          const newElement = await onCombine(elem1, elem2);
          
          if (newElement) {
            // Play success sound
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            }
            
            // Show sparkle animation
            setSparklePosition({ x: midX, y: midY });
            setTimeout(() => setSparklePosition(null), 700);
            
            // Add the new element at the midpoint between the two original elements
            const newElementWithPosition = {
              ...newElement,
              position: { x: midX, y: midY },
              id: `${newElement._id}-${Date.now()}`
            };
            
            setDroppedElements([...updatedElements, newElementWithPosition]);
          } else {
            // If combination failed, keep the elements
            setDroppedElements(droppedElements);
          }
          
          // Only process one combination at a time
          return;
        }
      }
    }
  }, [combining, droppedElements, onCombine]);
  
  // Clean up any elements that are too close to each other by combining them
  useEffect(() => {
    if (droppedElements.length >= 2) {
      checkForCombinations();
    }
  }, [droppedElements, checkForCombinations]);
  
  // Get appropriate emoji for element
  const getElementEmoji = (element) => {
    if (element.icon && element.icon.includes('♨️🟤🌋💨⚡🌱')) return element.icon;
    
    const name = element.name.toLowerCase();
    
    // Map of element names to emojis
    const emojiMap = {
      'water': '💧',
      'fire': '🔥',
      'earth': '🌍',
      'air': '💨',
      'steam': '♨️',
      'mud': '🟤',
      'lava': '🌋',
      'dust': '💨',
      'energy': '⚡',
      'life': '🌱',
      'sand': '🏜️',
      'glass': '🥃',
      'volcano': '🌋',
      'ash': '🌋',
      'smoke': '💨',
      'sandstorm': '🌪️',
      'beach': '🏖️',
      'train': '🚂',
      'submarine': '🚢',
      'engine': '🔧'
    };
    
    return emojiMap[name] || '🔮';
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      // Get drop position relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const droppedElement = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Add position information to the element
      const elementWithPosition = {
        ...droppedElement,
        position: { x, y },
        id: `${droppedElement._id}-${Date.now()}` // Unique ID for positioning
      };
      
      setDroppedElements([...droppedElements, elementWithPosition]);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  // Handle element drag within the crafting area
  const handleElementDragStart = (e, element, index) => {
    e.dataTransfer.setData('application/crafting-element', index.toString());
    // Set drag image
    const emoji = document.createElement('span');
    emoji.textContent = getElementEmoji(element);
    emoji.style.fontSize = '30px';
    document.body.appendChild(emoji);
    e.dataTransfer.setDragImage(emoji, 15, 15);
    setTimeout(() => {
      document.body.removeChild(emoji);
    }, 0);
  };
  
  // Handle dropping an element that's already in the crafting area
  const handleCraftingElementDrop = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const index = parseInt(e.dataTransfer.getData('application/crafting-element'));
    if (!isNaN(index) && index >= 0 && index < droppedElements.length) {
      const updatedElements = [...droppedElements];
      updatedElements[index] = {
        ...updatedElements[index],
        position: { x, y }
      };
      setDroppedElements(updatedElements);
    }
  };
  
  // Remove element from crafting area (double click)
  const handleElementRemove = (index) => {
    setDroppedElements(droppedElements.filter((_, i) => i !== index));
  };

  return (
    <div 
      ref={containerRef}
      className={`infinite-crafting-area ${isDraggingOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleCraftingElementDrop}
    >
      {droppedElements.length === 0 && (
        <div className="crafting-instruction">
          Drag elements here and drop them close to each other to craft
        </div>
      )}
      
      {droppedElements.map((element, index) => (
        <div 
          key={element.id}
          className="crafting-element" 
          style={{
            position: 'absolute',
            left: `${element.position.x - 40}px`,
            top: `${element.position.y - 40}px`,
          }}
          draggable
          onDragStart={(e) => handleElementDragStart(e, element, index)}
          onDoubleClick={() => handleElementRemove(index)}
        >
          <span className="element-emoji">{getElementEmoji(element)}</span>
          <span className="element-name">{element.name}</span>
        </div>
      ))}
      
      {/* Sparkle Animation */}
      {sparklePosition && (
        <div 
          className="sparkle-animation"
          style={{
            left: `${sparklePosition.x}px`,
            top: `${sparklePosition.y}px`,
          }}
        >
          <div className="sparkle spark1" style={{ backgroundColor: '#FFD700' }}></div>
          <div className="sparkle spark2" style={{ backgroundColor: '#FFA500' }}></div>
          <div className="sparkle spark3" style={{ backgroundColor: '#FFFFFF' }}></div>
          <div className="sparkle spark4" style={{ backgroundColor: '#FFD700' }}></div>
          <div className="sparkle spark5" style={{ backgroundColor: '#FFA500' }}></div>
        </div>
      )}
    </div>
  );
};

export default InfiniteCraftingArea;