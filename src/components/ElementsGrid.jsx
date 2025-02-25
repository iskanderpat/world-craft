// src/components/ElementsGrid.jsx - COMPLETE FILE
import React from 'react';

const ElementsGrid = ({ elements, crafting }) => {
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
      'engine': '🔧',
      'clay': '🏺',
      'cloud': '☁️',
      'wind': '🌬️',
      'stone': '🪨',
      'metal': '⚙️',
      'electricity': '⚡',
      'windmill': '🌬️',
      'rain': '🌧️',
      'plant': '🌱',
      'earthquake': '🌋',
      'storm': '🌩️',
      'robot': '🤖',
      'computer': '💻',
      'ai': '🧠',
      'james bond': '🕴️'
    };
    
    return emojiMap[name] || '🔮';
  };
  
  // Handle drag start
  const handleDragStart = (e, element) => {
    if (crafting) {
      e.preventDefault();
      return;
    }
    
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
    <div className="elements-sidebar-grid">
      {elements.map(element => (
        <div 
          key={element._id}
          className="element-item"
          draggable={!crafting}
          onDragStart={(e) => handleDragStart(e, element)}
        >
          <span className="element-emoji">{getElementEmoji(element)}</span>
          <span className="element-name">{element.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ElementsGrid;