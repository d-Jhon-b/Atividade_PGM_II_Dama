// tela3.js - O Jogo de Dama
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

import {
  BOARD_SIZE,
  PLAYER_1,
  PLAYER_2,
  PIECE_P1,
  PIECE_P2,
  KING_P1,
  KING_P2,
  isPlayableSquare,
  isPlayer1,
  isPlayer2,
  isKing,
  createInitialBoard,
  getCapturesForPiece,
  getAllCapturesForPlayer,
  getValidMovesForPiece,
  executeMove,
  countPieces,
  hasAnyValidMoves,
} from './regrasDama';

import { TEMAS } from './temas';
import soundManager from './soundManager';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOARD_CONTAINER_PADDING = 16;
const BOARD_WIDTH = Math.min(SCREEN_WIDTH - BOARD_CONTAINER_PADDING * 2, 380);
const SQUARE_SIZE = Math.floor(BOARD_WIDTH / BOARD_SIZE);

export default function Tela3({ navigation }) {
  // Estado do jogo
  const [board, setBoard] = useState(createInitialBoard);
  const [activePlayer, setActivePlayer] = useState(PLAYER_1);
  const [selectedSquare, setSelectedSquare] = useState(null); // { r, c }
  const [validMoves, setValidMoves] = useState([]);
  const [forcedPiece, setForcedPiece] = useState(null); // { r, c } durante capturas em cadeia
  const [moveCount, setMoveCount] = useState(0);

  // Tema de cores
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const currentTheme = TEMAS[selectedThemeIndex];

  // Som & Cronômetro
  const [isMuted, setIsMuted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Fim de jogo
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winReason, setWinReason] = useState('');

  // Contador de peças
  const pieceCounts = countPieces(board);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Formata os segundos em MM:SS
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Alterna o som
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Reinicia a partida
  const resetGame = () => {
    setBoard(createInitialBoard());
    setActivePlayer(PLAYER_1);
    setSelectedSquare(null);
    setValidMoves([]);
    setForcedPiece(null);
    setMoveCount(0);
    setSecondsElapsed(0);
    setTimerRunning(true);
    setWinnerModalVisible(false);
    setWinner(null);
    setWinReason('');
    soundManager.playClick();
  };

  const confirmResetGame = () => {
    Alert.alert(
      'Reiniciar Partida',
      'Tem certeza de que deseja recomeçar a partida atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: resetGame },
      ]
    );
  };

  // Toque em uma casa do tabuleiro
  const handleSquarePress = (r, c) => {
    if (winner) return;

    const clickedPiece = board[r][c];

    // Se já havia uma casa selecionada e o usuário clicou em um movimento válido
    const targetMove = validMoves.find(m => m.to.r === r && m.to.c === c);

    if (targetMove && selectedSquare) {
      // Executa o movimento
      const { newBoard, becameKing, capturedPiece } = executeMove(board, targetMove);
      setBoard(newBoard);
      setMoveCount(prev => prev + 1);

      if (targetMove.isCapture) {
        soundManager.playCapture();

        // Verifica se há novas capturas obrigatórias a partir da nova casa da MESMA peça
        const nextCaptures = getCapturesForPiece(newBoard, r, c);

        if (nextCaptures.length > 0) {
          // Captura em cadeia! Permanece no mesmo turno e obriga a mesma peça a capturar
          setForcedPiece({ r, c });
          setSelectedSquare({ r, c });
          setValidMoves(nextCaptures);
          return;
        }
      } else {
        soundManager.playMove();
      }

      if (becameKing) {
        soundManager.playKing();
      }

      // Fim do turno: limpa seleções e troca de jogador
      setSelectedSquare(null);
      setValidMoves([]);
      setForcedPiece(null);

      const nextPlayer = activePlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      setActivePlayer(nextPlayer);

      // Checa condição de vitória
      checkGameOver(newBoard, nextPlayer);
      return;
    }

    // Se uma peça está forçada (em cadeia de captura), não permite selecionar outra
    if (forcedPiece) {
      if (r !== forcedPiece.r || c !== forcedPiece.c) {
        return;
      }
    }

    // Se clicou em uma peça do jogador atual
    if (
      clickedPiece &&
      ((activePlayer === PLAYER_1 && isPlayer1(clickedPiece)) ||
        (activePlayer === PLAYER_2 && isPlayer2(clickedPiece)))
    ) {
      soundManager.playClick();
      setSelectedSquare({ r, c });
      const moves = getValidMovesForPiece(board, r, c, activePlayer, forcedPiece);
      setValidMoves(moves);
    } else {
      // Clicou em casa vazia ou adversária que não seja alvo válido
      if (!forcedPiece) {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  // Verifica vitória
  const checkGameOver = (currentBoard, nextPlayer) => {
    const counts = countPieces(currentBoard);

    if (nextPlayer === PLAYER_1 && counts.p1Total === 0) {
      handleGameOver(PLAYER_2, 'Todas as peças do Jogador 1 foram capturadas!');
      return;
    }
    if (nextPlayer === PLAYER_2 && counts.p2Total === 0) {
      handleGameOver(PLAYER_1, 'Todas as peças do Jogador 2 foram capturadas!');
      return;
    }

    // Verifica se o próximo jogador tem movimentos válidos
    if (!hasAnyValidMoves(currentBoard, nextPlayer)) {
      const winningPlayer = nextPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      handleGameOver(
        winningPlayer,
        `O Jogador ${nextPlayer === PLAYER_1 ? '1' : '2'} está sem movimentos válidos (bloqueado)!`
      );
    }
  };

  const handleGameOver = (winningPlayer, reason) => {
    setWinner(winningPlayer);
    setWinReason(reason);
    setTimerRunning(false);
    setWinnerModalVisible(true);
    soundManager.playWin();
  };

  // Verifica se uma casa é destino de movimento válido
  const getMoveTypeForSquare = (r, c) => {
    const move = validMoves.find(m => m.to.r === r && m.to.c === c);
    if (!move) return null;
    return move.isCapture ? 'capture' : 'move';
  };

  // Todas as capturas globais do jogador da vez para indicar peças que DEVEM capturar
  const globalCaptures = getAllCapturesForPlayer(board, activePlayer);
  const piecesMustCapture = globalCaptures.map(c => `${c.from.r},${c.from.c}`);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Barra Superior de Controles */}
      <View style={styles.topControlBar}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#f8fafc" />
        </TouchableOpacity>

        {/* Cronômetro */}
        <View style={styles.timerBadge}>
          <Ionicons name="timer-outline" size={16} color="#38bdf8" />
          <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
        </View>

        <View style={styles.rightControls}>
          {/* Mudo */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleToggleMute}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={20}
              color={isMuted ? '#ef4444' : '#10b981'}
            />
          </TouchableOpacity>

          {/* Tema */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setThemeModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="color-palette-outline" size={20} color="#ec4899" />
          </TouchableOpacity>

          {/* Reiniciar */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={confirmResetGame}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={20} color="#f59e0b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Placar e Indicador de Turno */}
      <View style={styles.scoreboardContainer}>
        {/* Jogador 2 (Superior) */}
        <View
          style={[
            styles.playerCard,
            activePlayer === PLAYER_2 && styles.activePlayerCard,
          ]}
        >
          <View style={styles.playerCardHeader}>
            <View
              style={[
                styles.playerColorDot,
                {
                  backgroundColor: currentTheme.pecas.p2.principal,
                  borderColor: currentTheme.pecas.p2.borda,
                },
              ]}
            />
            <Text style={styles.playerName}>Jogador 2</Text>
            {activePlayer === PLAYER_2 && (
              <View style={styles.turnBadge}>
                <Text style={styles.turnBadgeText}>VEZ</Text>
              </View>
            )}
          </View>
          <View style={styles.playerStatsRow}>
            <Text style={styles.playerStatText}>
              Restantes: <Text style={styles.statBold}>{pieceCounts.p2Total}</Text>
            </Text>
            <Text style={styles.playerStatText}>
              Damas: <Text style={styles.statBold}>{pieceCounts.p2Kings}</Text>
            </Text>
            <Text style={styles.playerStatText}>
              Capturadas: <Text style={styles.statBold}>{pieceCounts.p2Captured}</Text>
            </Text>
          </View>
        </View>

        {/* Separador VS */}
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.moveCountText}>Mov {moveCount}</Text>
        </View>

        {/* Jogador 1 (Inferior) */}
        <View
          style={[
            styles.playerCard,
            activePlayer === PLAYER_1 && styles.activePlayerCard,
          ]}
        >
          <View style={styles.playerCardHeader}>
            <View
              style={[
                styles.playerColorDot,
                {
                  backgroundColor: currentTheme.pecas.p1.principal,
                  borderColor: currentTheme.pecas.p1.borda,
                },
              ]}
            />
            <Text style={styles.playerName}>Jogador 1</Text>
            {activePlayer === PLAYER_1 && (
              <View style={styles.turnBadge}>
                <Text style={styles.turnBadgeText}>VEZ</Text>
              </View>
            )}
          </View>
          <View style={styles.playerStatsRow}>
            <Text style={styles.playerStatText}>
              Restantes: <Text style={styles.statBold}>{pieceCounts.p1Total}</Text>
            </Text>
            <Text style={styles.playerStatText}>
              Damas: <Text style={styles.statBold}>{pieceCounts.p1Kings}</Text>
            </Text>
            <Text style={styles.playerStatText}>
              Capturadas: <Text style={styles.statBold}>{pieceCounts.p1Captured}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Alerta de Captura Obrigatória ou Cadeia */}
      {forcedPiece ? (
        <View style={styles.forcedBanner}>
          <MaterialCommunityIcons name="lightning-bolt" size={16} color="#fbbf24" />
          <Text style={styles.forcedBannerText}>
            Captura contínua! Complete o salto com a mesma peça.
          </Text>
        </View>
      ) : piecesMustCapture.length > 0 ? (
        <View style={styles.mandatoryCaptureBanner}>
          <MaterialCommunityIcons name="alert-decagram" size={16} color="#f43f5e" />
          <Text style={styles.mandatoryCaptureText}>
            Captura obrigatória! As peças destacadas devem saltar.
          </Text>
        </View>
      ) : null}

      {/* Tabuleiro 8x8 */}
      <View style={styles.boardWrapper}>
        <View
          style={[
            styles.boardFrame,
            {
              width: SQUARE_SIZE * BOARD_SIZE + 12,
              height: SQUARE_SIZE * BOARD_SIZE + 12,
              borderColor: currentTheme.tabuleiro.borda,
            },
          ]}
        >
          {board.map((row, r) => (
            <View key={`row-${r}`} style={styles.boardRow}>
              {row.map((piece, c) => {
                const isPlayable = isPlayableSquare(r, c);
                const isSelected = selectedSquare && selectedSquare.r === r && selectedSquare.c === c;
                const moveType = getMoveTypeForSquare(r, c);
                const isMustCapture =
                  piece &&
                  ((activePlayer === PLAYER_1 && isPlayer1(piece)) ||
                    (activePlayer === PLAYER_2 && isPlayer2(piece))) &&
                  piecesMustCapture.includes(`${r},${c}`);

                // Cores da casa
                let squareBg = isPlayable
                  ? currentTheme.tabuleiro.escura
                  : currentTheme.tabuleiro.clara;

                if (isSelected) {
                  squareBg = currentTheme.tabuleiro.casaSelecionada;
                }

                return (
                  <TouchableOpacity
                    key={`sq-${r}-${c}`}
                    activeOpacity={0.8}
                    disabled={!isPlayable}
                    style={[
                      styles.square,
                      {
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        backgroundColor: squareBg,
                      },
                    ]}
                    onPress={() => handleSquarePress(r, c)}
                  >
                    {/* Indicador de Movimento Válido ou Captura */}
                    {moveType === 'move' && (
                      <View
                        style={[
                          styles.validMoveIndicator,
                          { backgroundColor: currentTheme.tabuleiro.movimentoPossivel },
                        ]}
                      />
                    )}
                    {moveType === 'capture' && (
                      <View
                        style={[
                          styles.validCaptureIndicator,
                          { borderColor: currentTheme.tabuleiro.capturaPossivel },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="close"
                          size={SQUARE_SIZE * 0.4}
                          color={currentTheme.tabuleiro.capturaPossivel}
                        />
                      </View>
                    )}

                    {/* Peça */}
                    {piece && (
                      <View
                        style={[
                          styles.piece,
                          {
                            width: SQUARE_SIZE * 0.78,
                            height: SQUARE_SIZE * 0.78,
                            borderRadius: (SQUARE_SIZE * 0.78) / 2,
                            backgroundColor: isPlayer1(piece)
                              ? currentTheme.pecas.p1.principal
                              : currentTheme.pecas.p2.principal,
                            borderColor: isPlayer1(piece)
                              ? currentTheme.pecas.p1.borda
                              : currentTheme.pecas.p2.borda,
                            shadowColor: isPlayer1(piece)
                              ? currentTheme.pecas.p1.sombra
                              : currentTheme.pecas.p2.sombra,
                          },
                          isMustCapture && styles.mustCapturePiece,
                        ]}
                      >
                        {/* Anel interno estético da peça */}
                        <View
                          style={[
                            styles.pieceInnerRing,
                            {
                              borderColor: isPlayer1(piece)
                                ? currentTheme.pecas.p1.anel
                                : currentTheme.pecas.p2.anel,
                            },
                          ]}
                        />

                        {/* Coroa da Dama */}
                        {isKing(piece) && (
                          <MaterialCommunityIcons
                            name="crown"
                            size={SQUARE_SIZE * 0.45}
                            color={
                              isPlayer1(piece)
                                ? currentTheme.pecas.p1.coroa
                                : currentTheme.pecas.p2.coroa
                            }
                          />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Rodapé Informativo Rápido */}
      <View style={styles.footerBar}>
        <Text style={styles.themeInfoText}>
          Tema: <Text style={styles.themeInfoBold}>{currentTheme.nome}</Text>
        </Text>
        <TouchableOpacity
          style={styles.helpLink}
          onPress={() => navigation.navigate('Tela2')}
        >
          <Ionicons name="help-circle-outline" size={16} color="#38bdf8" />
          <Text style={styles.helpLinkText}>Regras</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Escolha de Tema */}
      <Modal
        visible={themeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="color-palette" size={24} color="#38bdf8" />
              <Text style={styles.modalTitle}>Templates de Cores</Text>
              <TouchableOpacity
                onPress={() => setThemeModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Escolha a combinação de cores do tabuleiro e das peças
            </Text>

            <ScrollView style={styles.themeList}>
              {TEMAS.map((theme, index) => {
                const isSelected = selectedThemeIndex === index;
                return (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.themeCard,
                      isSelected && styles.themeCardSelected,
                    ]}
                    onPress={() => {
                      setSelectedThemeIndex(index);
                      setThemeModalVisible(false);
                      soundManager.playClick();
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.themeCardInfo}>
                      <Text style={styles.themeName}>{theme.nome}</Text>
                      <Text style={styles.themeDesc}>{theme.descricao}</Text>
                    </View>

                    {/* Preview de Cores */}
                    <View style={styles.themeColorPreview}>
                      <View style={styles.previewBoardSquares}>
                        <View
                          style={[
                            styles.previewSq,
                            { backgroundColor: theme.tabuleiro.clara },
                          ]}
                        />
                        <View
                          style={[
                            styles.previewSq,
                            { backgroundColor: theme.tabuleiro.escura },
                          ]}
                        />
                      </View>
                      <View style={styles.previewPieces}>
                        <View
                          style={[
                            styles.previewDot,
                            {
                              backgroundColor: theme.pecas.p1.principal,
                              borderColor: theme.pecas.p1.borda,
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.previewDot,
                            {
                              backgroundColor: theme.pecas.p2.principal,
                              borderColor: theme.pecas.p2.borda,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Vitória / Fim de Jogo */}
      <Modal
        visible={winnerModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setWinnerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.winnerCard}>
            <View style={styles.winnerTrophy}>
              <MaterialCommunityIcons name="trophy-award" size={56} color="#f59e0b" />
            </View>
            <Text style={styles.winnerText}>VITÓRIA!</Text>
            <Text style={styles.winnerPlayerName}>
              {winner === PLAYER_1 ? 'Jogador 1 Venceu!' : 'Jogador 2 Venceu!'}
            </Text>
            <Text style={styles.winnerReason}>{winReason}</Text>

            {/* Estatísticas da Partida */}
            <View style={styles.statsSummary}>
              <View style={styles.statSummaryItem}>
                <Ionicons name="timer" size={16} color="#38bdf8" />
                <Text style={styles.statSummaryLabel}>Duração</Text>
                <Text style={styles.statSummaryVal}>{formatTime(secondsElapsed)}</Text>
              </View>
              <View style={styles.statSummaryItem}>
                <MaterialCommunityIcons name="swap-horizontal" size={18} color="#ec4899" />
                <Text style={styles.statSummaryLabel}>Movimentos</Text>
                <Text style={styles.statSummaryVal}>{moveCount}</Text>
              </View>
            </View>

            {/* Botões de Ação */}
            <TouchableOpacity
              style={styles.btnPlayAgain}
              onPress={resetGame}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.btnPlayAgainText}>Jogar Novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnExit}
              onPress={() => {
                setWinnerModalVisible(false);
                navigation.navigate('Tela1');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnExitText}>Menu Principal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    paddingTop: 10,
  },
  topControlBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginLeft: 6,
    letterSpacing: 1,
  },
  rightControls: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreboardContainer: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  playerCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  activePlayerCard: {
    borderColor: '#38bdf8',
    backgroundColor: '#1e293b',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerColorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    marginRight: 6,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
  },
  turnBadge: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  turnBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0f172a',
  },
  playerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerStatText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  statBold: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  vsBadge: {
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748b',
  },
  moveCountText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  forcedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  forcedBannerText: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '700',
    marginLeft: 6,
  },
  mandatoryCaptureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#f43f5e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  mandatoryCaptureText: {
    fontSize: 11,
    color: '#f43f5e',
    fontWeight: '700',
    marginLeft: 6,
  },
  boardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  boardFrame: {
    borderWidth: 6,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: '#000000',
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  piece: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  pieceInnerRing: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  mustCapturePiece: {
    borderColor: '#f43f5e',
    borderWidth: 3.5,
  },
  validMoveIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  validCaptureIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBar: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  themeInfoText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  themeInfoBold: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpLinkText: {
    fontSize: 12,
    color: '#38bdf8',
    marginLeft: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginLeft: 10,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 16,
  },
  themeList: {
    maxHeight: 380,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  themeCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#1e293b',
  },
  themeCardInfo: {
    flex: 1,
    marginRight: 10,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
  },
  themeDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  themeColorPreview: {
    alignItems: 'center',
  },
  previewBoardSquares: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  previewSq: {
    width: 16,
    height: 16,
  },
  previewPieces: {
    flexDirection: 'row',
    gap: 4,
  },
  previewDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  winnerCard: {
    width: '90%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  winnerTrophy: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  winnerText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#f59e0b',
    letterSpacing: 2,
  },
  winnerPlayerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 4,
  },
  winnerReason: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  statsSummary: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statSummaryItem: {
    alignItems: 'center',
  },
  statSummaryLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  statSummaryVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  btnPlayAgain: {
    width: '100%',
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPlayAgainText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  btnExit: {
    paddingVertical: 8,
  },
  btnExitText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
