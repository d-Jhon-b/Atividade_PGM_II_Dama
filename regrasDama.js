// regrasDama.js - Lógica completa das regras do Jogo de Dama (Regra Brasileira/Internacional)

export const BOARD_SIZE = 8;

export const PLAYER_1 = 'p1'; // Jogador 1 (Geralmente peças claras/inferior)
export const PLAYER_2 = 'p2'; // Jogador 2 (Geralmente peças escuras/superior)

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

// Retorna todas as capturas possíveis a partir de (r, c)
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
    // Peça comum: pode capturar para frente e para trás saltando 1 casa adversária
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
    // Dama: voa na diagonal. Procura na diagonal até achar uma peça adversária e casas vazias após ela
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
            // Casa livre antes do oponente, continua procurando
            step++;
            continue;
          } else if (isSamePlayer(piece, curPiece)) {
            // Peça da mesma cor bloqueia a linha
            break;
          } else {
            // Encontrou peça adversária
            opponentFound = { r: curR, c: curC };
            step++;
            continue;
          }
        } else {
          // Já encontramos uma peça adversária na diagonal
          if (curPiece === null) {
            // Casa livre após o oponente: pouso válido!
            captures.push({
              from: { r, c },
              to: { r: curR, c: curC },
              captured: opponentFound,
              isCapture: true,
            });
            step++;
          } else {
            // Qualquer outra peça encontrada após a primeira bloqueia futuros saltos
            break;
          }
        }
      }
    }
  }

  return captures;
}

// Retorna todos os movimentos simples (não capturas) a partir de (r, c)
export function getSimpleMovesForPiece(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  const moves = [];

  if (!isKing(piece)) {
    // Peça comum: move 1 casa diagonal para frente
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
    // Dama: move qualquer número de casas livres na diagonal
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
          break; // bloqueado por outra peça
        }
      }
    }
  }

  return moves;
}

// Retorna todas as capturas possíveis para o jogador atual em todo o tabuleiro
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

// Retorna todos os movimentos válidos para uma peça específica
export function getValidMovesForPiece(board, r, c, activePlayer, forcedPiece = null) {
  const piece = board[r][c];
  if (!piece) return [];

  // Se uma peça específica está forçada (em captura contínua)
  if (forcedPiece && (forcedPiece.r !== r || forcedPiece.c !== c)) {
    return [];
  }

  const pieceOwner = isPlayer1(piece) ? PLAYER_1 : PLAYER_2;
  if (pieceOwner !== activePlayer) return [];

  // Verifica se há alguma captura obrigatória para o jogador
  const allCaptures = getAllCapturesForPlayer(board, activePlayer);

  if (allCaptures.length > 0) {
    // Apenas capturas são permitidas!
    return getCapturesForPiece(board, r, c);
  }

  // Se não há capturas no tabuleiro, movimentos simples são permitidos
  return getSimpleMovesForPiece(board, r, c);
}

// Executa um movimento e retorna o novo estado
export function executeMove(board, move) {
  const newBoard = board.map(row => [...row]);
  const { from, to, captured } = move;

  let piece = newBoard[from.r][from.c];
  newBoard[from.r][from.c] = null;

  // Se capturou alguém, remove do tabuleiro
  if (captured) {
    newBoard[captured.r][captured.c] = null;
  }

  // Verifica coroação para Dama
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

// Conta o total de peças de cada jogador
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

// Verifica se o jogador possui algum movimento válido disponível
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
