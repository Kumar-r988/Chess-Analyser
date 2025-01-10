import React from 'react';
// import './PromotionModal.css';

const PromotionModal = ({ onSelect, color }) => {
  const pieces = ['q', 'r', 'b', 'n'];
  return (
    <div className="promotion-modal">
      <h3>Choose a piece for promotion:</h3>
      <div className="promotion-options">
        {pieces.map(piece => (
          <img
            key={piece}
            src={`images/${color}${piece}.png`}
            alt={piece}
            onClick={() => onSelect(piece)}
            className="promotion-piece"
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionModal;
