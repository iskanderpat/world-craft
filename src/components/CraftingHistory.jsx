import React from 'react';

const CraftingHistory = ({ history }) => {
  return (
    <div className="crafting-history">
      <h3>Crafting History</h3>
      {history.length === 0 ? (
        <p>No combinations yet. Start crafting!</p>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-elements">
                <span>{item.inputs[0].name}</span>
                <span className="plus">+</span>
                <span>{item.inputs[1].name}</span>
                <span className="equals">=</span>
                <span className="result">{item.output.name}</span>
              </div>
              <div className="discovery-time">{new Date(item.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CraftingHistory;