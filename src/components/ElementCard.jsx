// src/components/ElementCard.jsx
import React from 'react';

const ElementCard = ({ element, isSelected, onSelect }) => {
  // Get appropriate emoji based on element name
  const getElementEmoji = () => {
    // Check if the element name contains known keywords
    const name = element.name.toLowerCase();
    
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
    
    // Return a default emoji if no match
    return '🔮';
  };

  return (
    <div 
      className={`element-card ${isSelected ? 'selected' : ''} ${element.baseElement ? 'base' : ''}`}
      onClick={() => onSelect(element)}
    >
      <div className="element-icon">
        {getElementEmoji()}
      </div>
      <h4>{element.name}</h4>
      <p>{element.description}</p>
      {element.baseElement && <span className="base-element-badge">Base</span>}
    </div>
  );
};

export default ElementCard;