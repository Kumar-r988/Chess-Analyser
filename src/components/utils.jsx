export function getValidMoves(board, piece, row, col) {
  const validMoves = [];
  const color = piece[0];
  const type = piece[1];

  function isValidSquare(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8 && (!board[r][c] || board[r][c][0] !== color);
  }

  function isPathClear(startRow, startCol, endRow, endCol) {
    const rowStep = endRow > startRow ? 1 : endRow < startRow ? -1 : 0;
    const colStep = endCol > startCol ? 1 : endCol < startCol ? -1 : 0;
    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    while (currentRow !== endRow || currentCol !== endCol) {
      if (board[currentRow][currentCol] !== null) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  }

  switch (type) {
    case 'r': // Rook
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row + i, col) && isPathClear(row, col, row + i, col)) {
          validMoves.push([row + i, col]);
          if (board[row + i][col]) break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row - i, col) && isPathClear(row, col, row - i, col)) {
          validMoves.push([row - i, col]);
          if (board[row - i][col]) break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row, col + i) && isPathClear(row, col, row, col + i)) {
          validMoves.push([row, col + i]);
          if (board[row][col + i]) break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row, col - i) && isPathClear(row, col, row, col - i)) {
          validMoves.push([row, col - i]);
          if (board[row][col - i]) break;
        } else break;
      }
      break;
    case 'n': // Knight
      const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      knightMoves.forEach(([dr, dc]) => {
        if (isValidSquare(row + dr, col + dc)) validMoves.push([row + dr, col + dc]);
      });
      break;
    case 'b': // Bishop
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row + i, col + i) && isPathClear(row, col, row + i, col + i)) {
          validMoves.push([row + i, col + i]);
          if (board[row + i][col + i]) break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row + i, col - i) && isPathClear(row, col, row + i, col - i)) {
          validMoves.push([row + i, col - i]);
          if (board[row + i][col - i]) break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row - i, col + i) && isPathClear(row, col, row - i, col + i)) {
          validMoves.push([row - i, col + i]);
          if (board[row - i][col + i]) break;
        } else break;
      }
      for (let i = 1; i < 8; i++) {
        if (isValidSquare(row - i, col - i) && isPathClear(row, col, row - i, col - i)) {
          validMoves.push([row - i, col - i]);
          if (board[row - i][col - i]) break;
        } else break;
      }
      break;
    case 'q': // Queen (combines Rook and Bishop moves)
      return [...getValidMoves(board, color + 'r', row, col), ...getValidMoves(board, color + 'b', row, col)];
    case 'k': // King
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            if (isValidSquare(row + dr, col + dc)) validMoves.push([row + dr, col + dc]);
          }
        }
      }
      break;
    case 'p': // Pawn
      const direction = color === 'b' ? 1 : -1;
      const startingRow = color === 'b' ? 1 : 6;
      if (isValidSquare(row + direction, col) && !board[row + direction][col]) {
        validMoves.push([row + direction, col]);
        if ((color === 'b' && row === 1) || (color === 'w' && row === 6)) {
          if (isValidSquare(row + 2 * direction, col) && !board[row + 2 * direction][col]) {
            validMoves.push([row + 2 * direction, col]);
          }
        }
      }
      if (isValidSquare(row + direction, col - 1) && board[row + direction][col - 1] && board[row + direction][col - 1][0] !== color) {
        validMoves.push([row + direction, col - 1]);
      }
      if (isValidSquare(row + direction, col + 1) && board[row + direction][col + 1] && board[row + direction][col + 1][0] !== color) {
        validMoves.push([row + direction, col + 1]);
      }
      break;
  }
  
  // Add castling moves
  if (type === 'k') {
    if (color === 'w' && row === 0 && col === 4) {
      // White kingside castling
      if (board[0][5] === null && board[0][6] === null && board[0][7] === 'wr') {
        validMoves.push([0, 6]);
      }
      // White queenside castling
      if (board[0][3] === null && board[0][2] === null && board[0][1] === null && board[0][0] === 'wr') {
        validMoves.push([0, 2]);
      }
    } else if (color === 'b' && row === 7 && col === 4) {
      // Black kingside castling
      if (board[7][5] === null && board[7][6] === null && board[7][7] === 'br') {
        validMoves.push([7, 6]);
      }
      // Black queenside castling
      if (board[7][3] === null && board[7][2] === null && board[7][1] === null && board[7][0] === 'br') {
        validMoves.push([7, 2]);
      }
    }
  }

  return validMoves;
}

export function toChessNotation(row, col) {
    const files = 'abcdefgh';
    const ranks = '87654321';
    return files[col] + ranks[row];
  }
