import React, { useState } from 'react';
import './App.css';
import { initializeBoard } from './components/initializeBoard';
import RenderBoard from './components/renderBoard';
import PromotionModal from './components/promotionsModels';
import { getValidMoves, toChessNotation } from './components/utils';
import MoveAnalyzer from './components/MoveAnalyzer'; // Import MoveAnalyzer

// New function to get all moves combined in the desired format
const getAllMoves = (whiteMoves, blackMoves) => {
  let combinedMoves = [];
  const maxLength = Math.max(whiteMoves.length, blackMoves.length);

  for (let i = 0; i < maxLength; i++) {
    if (whiteMoves[i]) combinedMoves.push(whiteMoves[i].replace('-', ''));
    if (blackMoves[i]) combinedMoves.push(blackMoves[i].replace('-', ''));
  }
  return combinedMoves;
};

// New container for all combined moves
const RenderCombinedMoves = ({ whiteMoves, blackMoves, onMovesChange }) => {
  const combinedMoves = getAllMoves(whiteMoves, blackMoves);

  React.useEffect(() => {
    // Notify parent when combined moves change
    onMovesChange(combinedMoves.join(' '));
  }, [whiteMoves, blackMoves]);

  return (
    <div className="combined-moves">

    </div>
  );
};

const App = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [whiteMoves, setWhiteMoves] = useState([]);
  const [blackMoves, setBlackMoves] = useState([]);
  const [capturedWhitePieces, setCapturedWhitePieces] = useState([]);
  const [capturedBlackPieces, setCapturedBlackPieces] = useState([]);
  const [validMoves, setValidMoves] = useState([]);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionData, setPromotionData] = useState(null);
  const [combinedMoves, setCombinedMoves] = useState(''); // Track all moves for analyzer

  const handlePawnPromotion = (row, col, color) => {
    return new Promise((resolve) => {
      setPromotionData({ row, col, color, resolve });
      setShowPromotionModal(true);
    });
  };

  const handlePromotionSelect = (piece) => {
    const { row, col, color, resolve } = promotionData;
    const newPiece = color + piece;
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = newPiece;
    setBoard(newBoard);
    setShowPromotionModal(false);
    resolve();
  };

  const movePiece = (board, fromRow, fromCol, toRow, toCol, currentTurn, setCapturedPieces) => {
    const movingPiece = board[fromRow][fromCol];
    const validMoves = getValidMoves(board, movingPiece, fromRow, fromCol);

    if (movingPiece && movingPiece[0] === currentTurn && validMoves.some(([r, c]) => r === toRow && c === toCol)) {
      const newBoard = board.map(row => [...row]);
      const targetPiece = newBoard[toRow][toCol];

      if (targetPiece) {
        setCapturedPieces(prev => [...prev, targetPiece]);
      }

      if (movingPiece[1] === 'k' && Math.abs(fromCol - toCol) === 2) {
        if (toCol === 6) {
          newBoard[fromRow][5] = newBoard[fromRow][7];
          newBoard[fromRow][7] = null;
        } else if (toCol === 2) {
          newBoard[fromRow][3] = newBoard[fromRow][0];
          newBoard[fromRow][0] = null;
        }
      }

      newBoard[toRow][toCol] = movingPiece;
      newBoard[fromRow][fromCol] = null;

      if (movingPiece[1] === 'p' && (toRow === 0 || toRow === 7)) {
        return { newBoard, needsPromotion: true };
      }

      return { newBoard, needsPromotion: false };
    }

    return { newBoard: board, needsPromotion: false };
  };

  const handleSquareClick = async (row, col) => {
    if (!selectedPiece) {
      if (board[row][col] && board[row][col][0] === currentTurn) {
        setSelectedPiece({ row, col });
        setValidMoves(getValidMoves(board, board[row][col], row, col));
      }
    } else {
      const { newBoard, needsPromotion } = movePiece(board, selectedPiece.row, selectedPiece.col, row, col, currentTurn,
        currentTurn === 'w' ? setCapturedBlackPieces : setCapturedWhitePieces);

      if (newBoard !== board) {
        setBoard(newBoard);
        if (needsPromotion) {
          await handlePawnPromotion(row, col, currentTurn);
        }
        const from = toChessNotation(selectedPiece.row, selectedPiece.col);
        const to = toChessNotation(row, col);
        const moveNotation = `${from}-${to}`;
        if (currentTurn === 'w') {
          setWhiteMoves(prevMoves => [...prevMoves, moveNotation]);
        } else {
          setBlackMoves(prevMoves => [...prevMoves, moveNotation]);
        }
        setCurrentTurn(currentTurn === 'w' ? 'b' : 'w');
      }
      setSelectedPiece(null);
      setValidMoves([]);
    }
  };

  const handleDragStart = (e, row, col) => {
    if (board[row][col][0] === currentTurn) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ row, col }));
      setValidMoves(getValidMoves(board, board[row][col], row, col));
    } else {
      e.preventDefault();
    }
  };

  const handleDrop = async (e, toRow, toCol) => {
    e.preventDefault();
    const { row: fromRow, col: fromCol } = JSON.parse(e.dataTransfer.getData('text'));
    const { newBoard, needsPromotion } = movePiece(board, fromRow, fromCol, toRow, toCol, currentTurn,
      currentTurn === 'w' ? setCapturedBlackPieces : setCapturedWhitePieces);

    if (newBoard !== board) {
      setBoard(newBoard);
      if (needsPromotion) {
        await handlePawnPromotion(toRow, toCol, currentTurn);
      }
      const from = toChessNotation(fromRow, fromCol);
      const to = toChessNotation(toRow, toCol);
      const moveNotation = `${from}-${to}`;
      if (currentTurn === 'w') {
        setWhiteMoves(prevMoves => [...prevMoves, moveNotation]);
      } else {
        setBlackMoves(prevMoves => [...prevMoves, moveNotation]);
      }
      setCurrentTurn(currentTurn === 'w' ? 'b' : 'w');
    }
    setValidMoves([]);
  };

  return (
    <div className='chess-app'>
      {showPromotionModal && (
        <PromotionModal
          onSelect={handlePromotionSelect}
          color={promotionData.color}
        />
      )}
      <div className='game-layout'>
        <div className='left-panel'>
          <RenderBoard
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            handleSquareClick={handleSquareClick}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            currentTurn={currentTurn}
          />
        </div>
        <div className='right-panel'>
          <div className="move-list-container">
            <RenderCombinedMoves
              whiteMoves={whiteMoves}
              blackMoves={blackMoves}
              onMovesChange={setCombinedMoves}
            />
          </div>
          {/* Pass combined moves to MoveAnalyzer */}
          <MoveAnalyzer moves={combinedMoves} />
        </div>
      </div>
    </div>
  );
};

export default App;
