// src/components/ElementsGrid.jsx - with drag functionality
import React from 'react';

const ElementsGrid = ({ elements, onElementClick, selectedElements }) => {
  // Get appropriate emoji based on element name
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

  // Check if an element is selected
  const isSelected = (element) => {
    return selectedElements && selectedElements.some(e => e._id === element._id);
  };
  
  // Handle drag start
  const handleDragStart = (e, element) => {
    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    // Set drag effect
    e.dataTransfer.effectAllowed = 'copy';
    // Set a drag image (optional)
    const emoji = document.createElement('span');
    emoji.textContent = getElementEmoji(element);
    emoji.style.fontSize = '30px';
    document.body.appendChild(emoji);
    e.dataTransfer.setDragImage(emoji, 15, 15);
    setTimeout(() => {
      document.body.removeChild(emoji);
    }, 0);
  };

  return (
    <div className="elements-grid-container">
      <div className="elements-grid-modern">
        {elements.map(element => (
          <div 
            key={element._id}
            className={`element-item ${isSelected(element) ? 'selected' : ''}`}
            onClick={() => onElementClick(element)}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, element)}
          >
            <span className="element-emoji">{getElementEmoji(element)}</span>
            <span className="element-name">{element.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElementsGrid;