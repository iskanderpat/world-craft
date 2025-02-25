import React from 'react';

const CraftingArea = ({ selectedElements, onCombine, onClear, combining }) => {
  // Get appropriate emoji based on element name
  const getElementEmoji = (element) => {
    if (element.icon) return element.icon;
    
    switch (element.name.toLowerCase()) {
      case 'water': return '💧';
      case 'fire': return '🔥';
      case 'earth': return '🌍';
      case 'air': return '💨';
      case 'steam': return '♨️';
      case 'mud': return '🟤';
      case 'lava': return '🌋';
      case 'dust': return '💨';
      case 'energy': return '⚡';
      case 'life': return '🌱';
      default: return '🔮';
    }
  };

  return (
    <div className="crafting-area">
      <h3>Crafting Area</h3>
      <p>Select elements to combine them and discover new ones!</p>
      
      <div className="selected-elements">
        {selectedElements.length === 0 ? (
          <div className="empty-selection">Select elements to combine</div>
        ) : (
          <>
            <div className="selected-elements-container">
              {selectedElements.map((element, index) => (
                <div key={index} className="selected-element">
                  <div className="element-icon">{getElementEmoji(element)}</div>
                  <div className="element-name">{element.name}</div>
                </div>
              ))}
            </div>
            
            <div className="crafting-actions">
              <button 
                onClick={onClear} 
                className="clear-btn"
                disabled={combining}
              >
                Clear
              </button>
              <button 
                onClick={onCombine} 
                className="combine-btn"
                disabled={selectedElements.length < 2 || combining}
              >
                {combining ? 'Combining...' : 'Combine Elements'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CraftingArea;