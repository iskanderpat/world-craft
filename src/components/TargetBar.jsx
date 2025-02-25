// src/components/TargetBar.jsx - COMPLETE FILE
import React from 'react';

const TargetBar = ({ targets }) => {
  return (
    <div className="target-bar">
      <div className="target-title">Target Words:</div>
      <div className="target-items">
        {targets.map((target, index) => (
          <div 
            key={index} 
            className={`target-item ${target.discovered ? 'discovered' : ''}`}
          >
            {target.discovered ? target.word : '???'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetBar;