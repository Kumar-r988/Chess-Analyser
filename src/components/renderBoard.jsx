import React from 'react';

const RenderBoard = ({ board, selectedPiece, validMoves, handleSquareClick, handleDragStart, handleDrop, currentTurn }) => (
  <div className="board-container" style={{ marginLeft: '50px' }}>
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((piece, colIndex) => {
            const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
            return (
              <div
                key={colIndex}
                className={`square ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected' : ''}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onDragOver={(e) => e.preventDefault()} // Allow the drop
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)} // Handle drop
              >
                {isValidMove && !piece && (
                  <img src="images/blue.png" alt="Valid move" className="valid-move-dot" />
                )}
                {piece && (
                  <img
                    src={`images/${piece}.png`}
                    alt={piece}
                    draggable={piece[0] === currentTurn} // Only allow dragging pieces of the current turn
                    onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)} // Handle drag start
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div className="turn-indicator">Current turn: {currentTurn === 'w' ? 'White' : 'Black'}</div>
  </div>
);

export default RenderBoard;
