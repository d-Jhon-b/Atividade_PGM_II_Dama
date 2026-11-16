// src/utils/regrasDama.ts - Lógica das regras do Jogo de Dama (Regra Brasileira/Internacional)

export const BOARD_SIZE = 8;

export type Player = 'p1' | 'p2';
export type PieceType = 'p1' | 'p2' | 'd1' | 'd2' | null;

export const PLAYER_1: Player = 'p1';
export const PLAYER_2: Player = 'p2';

export const PIECE_P1: PieceType = 'p1';
export const PIECE_P2: PieceType = 'p2';
export const KING_P1: PieceType = 'd1';
export const KING_P2: PieceType = 'd2';

export interface Position {
  r: number;
  c: number;
}

export interface Move {
  from: Position;
  to: Position;
  captured?: Position;
  isCapture: boolean;
}

export interface MoveResult {
  newBoard: PieceType[][];
  becameKing: boolean;
  capturedPiece: PieceType;
}

export interface PieceCounts {
  p1Total: number;
  p2Total: number;
  p1Kings: number;
  p2Kings: number;
  p1Captured: number;
  p2Captured: number;
}

export function isPlayableSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 1;
}

export function isPlayer1(piece: PieceType): boolean {
  return piece === PIECE_P1 || piece === KING_P1;
}

export function isPlayer2(piece: PieceType): boolean {
  return piece === PIECE_P2 || piece === KING_P2;
}

export function isSamePlayer(pieceA: PieceType, pieceB: PieceType): boolean {
  if (!pieceA || !pieceB) return false;
  return (isPlayer1(pieceA) && isPlayer1(pieceB)) || (isPlayer2(pieceA) && isPlayer2(pieceB));
}

export function isOpponent(pieceA: PieceType, pieceB: PieceType): boolean {
  if (!pieceA || !pieceB) return false;
  return (isPlayer1(pieceA) && isPlayer2(pieceB)) || (isPlayer2(pieceA) && isPlayer1(pieceB));
}

export function isKing(piece: PieceType): boolean {
  return piece === KING_P1 || piece === KING_P2;
}

export function createInitialBoard(): PieceType[][] {
  const board: PieceType[][] = Array(BOARD_SIZE)
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
export function getCapturesForPiece(board: PieceType[][], r: number, c: number): Move[] {
  const piece = board[r][c];
  if (!piece) return [];

  const captures: Move[] = [];
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  if (!isKing(piece)) {
    // Peça comum: pode capturar para frente e para trás saltando 1 peça adversária
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
    // Dama: voa na diagonal
    for (const [dr, dc] of directions) {
      let step = 1;
      let opponentFound: Position | null = null;

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

// Retorna todos os movimentos simples (não capturas) a partir de (r, c)
export function getSimpleMovesForPiece(board: PieceType[][], r: number, c: number): Move[] {
  const piece = board[r][c];
  if (!piece) return [];

  const moves: Move[] = [];

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
          break;
        }
      }
    }
  }

  return moves;
}

// Retorna todas as capturas possíveis para o jogador atual
export function getAllCapturesForPlayer(board: PieceType[][], player: Player): Move[] {
  const captures: Move[] = [];
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
export function getValidMovesForPiece(
  board: PieceType[][],
  r: number,
  c: number,
  activePlayer: Player,
  forcedPiece: Position | null = null
): Move[] {
  const piece = board[r][c];
  if (!piece) return [];

  if (forcedPiece && (forcedPiece.r !== r || forcedPiece.c !== c)) {
    return [];
  }

  const pieceOwner: Player = isPlayer1(piece) ? PLAYER_1 : PLAYER_2;
  if (pieceOwner !== activePlayer) return [];

  const allCaptures = getAllCapturesForPlayer(board, activePlayer);

  if (allCaptures.length > 0) {
    return getCapturesForPiece(board, r, c);
  }

  return getSimpleMovesForPiece(board, r, c);
}

// Executa um movimento e retorna o novo estado
export function executeMove(board: PieceType[][], move: Move): MoveResult {
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

// Conta o total de peças de cada jogador
export function countPieces(board: PieceType[][]): PieceCounts {
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
export function hasAnyValidMoves(board: PieceType[][], player: Player): boolean {
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

export type BotDifficulty = 'facil' | 'medio' | 'dificil';

// Retorna todos os movimentos válidos disponíveis para um jogador
export function getAllValidMovesForPlayer(
  board: PieceType[][],
  player: Player,
  forcedPiece: Position | null = null
): Move[] {
  if (forcedPiece) {
    return getCapturesForPiece(board, forcedPiece.r, forcedPiece.c);
  }

  const allCaptures = getAllCapturesForPlayer(board, player);
  if (allCaptures.length > 0) {
    return allCaptures;
  }

  const simpleMoves: Move[] = [];
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

// Calcula a melhor jogada para o Bot (PLAYER_2) de acordo com a dificuldade
export function getBestBotMove(
  board: PieceType[][],
  difficulty: BotDifficulty = 'medio',
  forcedPiece: Position | null = null
): Move | null {
  const validMoves = getAllValidMovesForPlayer(board, PLAYER_2, forcedPiece);
  if (validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  // Modo Fácil: escolha aleatória entre as jogadas válidas
  if (difficulty === 'facil') {
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  let bestScore = -Infinity;
  let bestMoves: Move[] = [];

  for (const move of validMoves) {
    let score = 0;
    const movingPiece = board[move.from.r][move.from.c];
    const { newBoard, becameKing, capturedPiece } = executeMove(board, move);

    // 1. Pontuação por captura
    if (move.isCapture) {
      score += isKing(capturedPiece) ? 35 : 22;

      // Bônus se permitir captura em cadeia na sequência
      const nextCaptures = getCapturesForPiece(newBoard, move.to.r, move.to.c);
      if (nextCaptures.length > 0) {
        score += 28 * nextCaptures.length;
      }
    }

    // 2. Bônus por promoção a Dama
    if (becameKing) {
      score += 42;
    }

    // 3. Posicionamento tático
    if (!isKing(movingPiece)) {
      // Incentiva avançar rumo à coroação
      score += move.to.r * 2.5;

      // Penalidade leve por abrir a linha de defesa (fileira 0) cedo demais
      if (move.from.r === 0) {
        score -= 6;
      }
    }

    // Controle do centro do tabuleiro (colunas 2 a 5)
    if (move.to.c >= 2 && move.to.c <= 5) {
      score += 3;
    }
    // Casas laterais (coluna 0 e 7) são seguras contra captura
    if (move.to.c === 0 || move.to.c === BOARD_SIZE - 1) {
      score += 4;
    }

    // 4. No modo Difícil: simula a resposta imediata do Jogador 1 (Lookahead)
    if (difficulty === 'dificil') {
      const opponentCaptures = getAllCapturesForPlayer(newBoard, PLAYER_1);
      if (opponentCaptures.length > 0) {
        // Verifica se a peça movida ou uma dama nossa seria capturada
        let maxLoss = 0;
        for (const oppCap of opponentCaptures) {
          const victim = oppCap.captured ? newBoard[oppCap.captured.r][oppCap.captured.c] : null;
          const loss = isKing(victim) ? 38 : 24;
          if (loss > maxLoss) maxLoss = loss;
        }
        score -= maxLoss;
      } else {
        score += 8; // Posição segura sem contra-ataque imediato
      }
    }

    // Pequeno fator de desempate para variar partidas
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
