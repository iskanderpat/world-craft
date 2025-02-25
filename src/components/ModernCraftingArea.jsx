// src/components/ModernCraftingArea.jsx - with drop functionality
import React from 'react';

const ModernCraftingArea = ({ selectedElements, onCombine, onClear, combining, onDropElement }) => {
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
  };
  
  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const droppedElement = JSON.parse(e.dataTransfer.getData('application/json'));
      if (droppedElement && onDropElement) {
        onDropElement(droppedElement);
      }
    } catch (error) {
      console.error('Error parsing dropped element:', error);
    }
  };

  return (
    <div 
      className="modern-crafting-area"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="crafting-title">Craft</div>
      
      {selectedElements.length === 0 ? (
        <div className="crafting-instruction">
          Drag elements here to craft new discoveries
        </div>
      ) : (
        <>
          <div className="crafting-elements">
            {selectedElements.map((element, index) => (
              <div key={index} className="crafting-element">
                <span className="element-emoji">{getElementEmoji(element)}</span>
                <span className="element-name">{element.name}</span>
              </div>
            ))}
            
            {selectedElements.length === 2 && (
              <>
                <div className="crafting-plus">+</div>
                <button 
                  className="craft-button"
                  onClick={onCombine}
                  disabled={combining}
                >
                  {combining ? 'Crafting...' : 'Craft'}
                </button>
              </>
            )}
          </div>
          
          <button className="clear-button" onClick={onClear}>
            Clear
          </button>
        </>
      )}
    </div>
  );
};

export default ModernCraftingArea;