// regrasDama.js - Lógica completa do Jogo de Dama + Inteligência Artificial (Bot)

export const BOARD_SIZE = 8;

export const PLAYER_1 = 'p1';
export const PLAYER_2 = 'p2';

export const PIECE_P1 = 'p1';
export const PIECE_P2 = 'p2';
export const KING_P1 = 'd1';
export const KING_P2 = 'd2';

export function isPlayableSquare(row, col) {
  return (row + col) % 2 === 1;
}

export function isPlayer1(piece) {
  return piece === PIECE_P1 || piece === KING_P1;
}

export function isPlayer2(piece) {
  return piece === PIECE_P2 || piece === KING_P2;
}

export function isSamePlayer(pieceA, pieceB) {
  if (!pieceA || !pieceB) return false;
  return (isPlayer1(pieceA) && isPlayer1(pieceB)) || (isPlayer2(pieceA) && isPlayer2(pieceB));
}

export function isOpponent(pieceA, pieceB) {
  if (!pieceA || !pieceB) return false;
  return (isPlayer1(pieceA) && isPlayer2(pieceB)) || (isPlayer2(pieceA) && isPlayer1(pieceB));
}

export function isKing(piece) {
  return piece === KING_P1 || piece === KING_P2;
}

export function createInitialBoard() {
  const board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (isPlayableSquare(r, c)) {
        if (r < 3) {
          board[r][c] = PIECE_P2;
        } else if (r > 4) {
          board[r][c] = PIECE_P1;
        }
      }
    }
  }
  return board;
}

export function getCapturesForPiece(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  const captures = [];
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  if (!isKing(piece)) {
    for (const [dr, dc] of directions) {
      const midR = r + dr;
      const midC = c + dc;
      const destR = r + 2 * dr;
      const destC = c + 2 * dc;

      if (destR >= 0 && destR < BOARD_SIZE && destC >= 0 && destC < BOARD_SIZE) {
        const midPiece = board[midR][midC];
        const destPiece = board[destR][destC];

        if (midPiece && isOpponent(piece, midPiece) && destPiece === null) {
          captures.push({
            from: { r, c },
            to: { r: destR, c: destC },
            captured: { r: midR, c: midC },
            isCapture: true,
          });
        }
      }
    }
  } else {
    for (const [dr, dc] of directions) {
      let step = 1;
      let opponentFound = null;

      while (true) {
        const curR = r + step * dr;
        const curC = c + step * dc;

        if (curR < 0 || curR >= BOARD_SIZE || curC < 0 || curC >= BOARD_SIZE) {
          break;
        }

        const curPiece = board[curR][curC];

        if (!opponentFound) {
          if (curPiece === null) {
            step++;
            continue;
          } else if (isSamePlayer(piece, curPiece)) {
            break;
          } else {
            opponentFound = { r: curR, c: curC };
            step++;
            continue;
          }
        } else {
          if (curPiece === null) {
            captures.push({
              from: { r, c },
              to: { r: curR, c: curC },
              captured: opponentFound,
              isCapture: true,
            });
            step++;
          } else {
            break;
          }
        }
      }
    }
  }

  return captures;
}

export function getSimpleMovesForPiece(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  const moves = [];

  if (!isKing(piece)) {
    const forwardDir = isPlayer1(piece) ? -1 : 1;
    const targets = [
      [r + forwardDir, c - 1],
      [r + forwardDir, c + 1],
    ];

    for (const [destR, destC] of targets) {
      if (destR >= 0 && destR < BOARD_SIZE && destC >= 0 && destC < BOARD_SIZE) {
        if (board[destR][destC] === null) {
          moves.push({
            from: { r, c },
            to: { r: destR, c: destC },
            isCapture: false,
          });
        }
      }
    }
  } else {
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const [dr, dc] of directions) {
      let step = 1;
      while (true) {
        const destR = r + step * dr;
        const destC = c + step * dc;

        if (destR < 0 || destR >= BOARD_SIZE || destC < 0 || destC >= BOARD_SIZE) {
          break;
        }

        if (board[destR][destC] === null) {
          moves.push({
            from: { r, c },
            to: { r: destR, c: destC },
            isCapture: false,
          });
          step++;
        } else {
          break;
        }
      }
    }
  }

  return moves;
}

export function getAllCapturesForPlayer(board, player) {
  const captures = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && ((player === PLAYER_1 && isPlayer1(piece)) || (player === PLAYER_2 && isPlayer2(piece)))) {
        const pieceCaptures = getCapturesForPiece(board, r, c);
        captures.push(...pieceCaptures);
      }
    }
  }
  return captures;
}

export function getValidMovesForPiece(board, r, c, activePlayer, forcedPiece = null) {
  const piece = board[r][c];
  if (!piece) return [];

  if (forcedPiece && (forcedPiece.r !== r || forcedPiece.c !== c)) {
    return [];
  }

  const pieceOwner = isPlayer1(piece) ? PLAYER_1 : PLAYER_2;
  if (pieceOwner !== activePlayer) return [];

  const allCaptures = getAllCapturesForPlayer(board, activePlayer);

  if (allCaptures.length > 0) {
    return getCapturesForPiece(board, r, c);
  }

  return getSimpleMovesForPiece(board, r, c);
}

export function executeMove(board, move) {
  const newBoard = board.map(row => [...row]);
  const { from, to, captured } = move;

  let piece = newBoard[from.r][from.c];
  newBoard[from.r][from.c] = null;

  if (captured) {
    newBoard[captured.r][captured.c] = null;
  }

  let becameKing = false;
  if (piece === PIECE_P1 && to.r === 0) {
    piece = KING_P1;
    becameKing = true;
  } else if (piece === PIECE_P2 && to.r === BOARD_SIZE - 1) {
    piece = KING_P2;
    becameKing = true;
  }

  newBoard[to.r][to.c] = piece;

  return {
    newBoard,
    becameKing,
    capturedPiece: captured ? board[captured.r][captured.c] : null,
  };
}

export function countPieces(board) {
  let p1 = 0;
  let p2 = 0;
  let d1 = 0;
  let d2 = 0;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece === PIECE_P1) p1++;
      else if (piece === KING_P1) { p1++; d1++; }
      else if (piece === PIECE_P2) p2++;
      else if (piece === KING_P2) { p2++; d2++; }
    }
  }

  return {
    p1Total: p1,
    p2Total: p2,
    p1Kings: d1,
    p2Kings: d2,
    p1Captured: 12 - p1,
    p2Captured: 12 - p2,
  };
}

export function hasAnyValidMoves(board, player) {
  const captures = getAllCapturesForPlayer(board, player);
  if (captures.length > 0) return true;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && ((player === PLAYER_1 && isPlayer1(piece)) || (player === PLAYER_2 && isPlayer2(piece)))) {
        const moves = getSimpleMovesForPiece(board, r, c);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

export function getAllValidMovesForPlayer(board, player, forcedPiece = null) {
  if (forcedPiece) {
    return getCapturesForPiece(board, forcedPiece.r, forcedPiece.c);
  }

  const allCaptures = getAllCapturesForPlayer(board, player);
  if (allCaptures.length > 0) {
    return allCaptures;
  }

  const simpleMoves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      if (piece && ((player === PLAYER_1 && isPlayer1(piece)) || (player === PLAYER_2 && isPlayer2(piece)))) {
        simpleMoves.push(...getSimpleMovesForPiece(board, r, c));
      }
    }
  }
  return simpleMoves;
}

export function getBestBotMove(board, difficulty = 'medio', forcedPiece = null) {
  const validMoves = getAllValidMovesForPlayer(board, PLAYER_2, forcedPiece);
  if (validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  if (difficulty === 'facil') {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  let bestScore = -Infinity;
  let bestMoves = [];

  for (const move of validMoves) {
    let score = 0;
    const movingPiece = board[move.from.r][move.from.c];
    const { newBoard, becameKing, capturedPiece } = executeMove(board, move);

    if (move.isCapture) {
      score += isKing(capturedPiece) ? 35 : 22;

      const nextCaptures = getCapturesForPiece(newBoard, move.to.r, move.to.c);
      if (nextCaptures.length > 0) {
        score += 28 * nextCaptures.length;
      }
    }

    if (becameKing) {
      score += 42;
    }

    if (!isKing(movingPiece)) {
      score += move.to.r * 2.5;
      if (move.from.r === 0) {
        score -= 6;
      }
    }

    if (move.to.c >= 2 && move.to.c <= 5) {
      score += 3;
    }
    if (move.to.c === 0 || move.to.c === BOARD_SIZE - 1) {
      score += 4;
    }

    if (difficulty === 'dificil') {
      const opponentCaptures = getAllCapturesForPlayer(newBoard, PLAYER_1);
      if (opponentCaptures.length > 0) {
        let maxLoss = 0;
        for (const oppCap of opponentCaptures) {
          const victim = oppCap.captured ? newBoard[oppCap.captured.r][oppCap.captured.c] : null;
          const loss = isKing(victim) ? 38 : 24;
          if (loss > maxLoss) maxLoss = loss;
        }
        score -= maxLoss;
      } else {
        score += 8;
      }
    }

    score += Math.random() * 1.5;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (Math.abs(score - bestScore) < 0.5) {
      bestMoves.push(move);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}
