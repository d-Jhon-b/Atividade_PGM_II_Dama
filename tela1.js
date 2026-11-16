// tela1.js - Tela 1: Boas-Vindas (Expo Snack)
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function Tela1({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="checkerboard" size={64} color="#f59e0b" />
          </View>
          <Text style={styles.title}>JOGO DE DAMA</Text>
          <Text style={styles.subtitle}>Clássico dos Tabuleiros</Text>
          <View style={styles.badgeFatec}>
            <Ionicons name="school" size={14} color="#38bdf8" />
            <Text style={styles.badgeFatecText}>FATEC ITAQUERA • DSM 5º SEMESTRE</Text>
          </View>
        </View>

        {/* Mini Preview do Tabuleiro */}
        <View style={styles.previewCard}>
          <View style={styles.miniBoard}>
            <View style={styles.miniRow}>
              <View style={[styles.miniSquare, styles.lightSquare]} />
              <View style={[styles.miniSquare, styles.darkSquare]}>
                <View style={[styles.miniPiece, styles.pieceP2]} />
              </View>
              <View style={[styles.miniSquare, styles.lightSquare]} />
              <View style={[styles.miniSquare, styles.darkSquare]}>
                <View style={[styles.miniPiece, styles.pieceP2]} />
              </View>
            </View>
            <View style={styles.miniRow}>
              <View style={[styles.miniSquare, styles.darkSquare]}>
                <View style={[styles.miniPiece, styles.pieceP2]} />
              </View>
              <View style={[styles.miniSquare, styles.lightSquare]} />
              <View style={[styles.miniSquare, styles.darkSquare]}>
                <View style={[styles.miniPiece, styles.pieceP1]} />
              </View>
              <View style={[styles.miniSquare, styles.lightSquare]} />
            </View>
            <View style={styles.miniRow}>
              <View style={[styles.miniSquare, styles.lightSquare]} />
              <View style={[styles.miniSquare, styles.darkSquare]}>
                <View style={[styles.miniPiece, styles.pieceP1]} />
              </View>
              <View style={[styles.miniSquare, styles.lightSquare]} />
              <View style={[styles.miniSquare, styles.darkSquare]}>
                <View style={[styles.miniPiece, styles.pieceP1]}>
                  <MaterialCommunityIcons name="crown" size={10} color="#f59e0b" />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.previewCaption}>
            Modo Offline vs Bot • 2 Jogadores • Temas Personalizáveis
          </Text>
        </View>

        {/* Recursos em Destaque */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="robot" size={20} color="#10b981" />
            <Text style={styles.featureLabel}>Vs Bot IA</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={20} color="#38bdf8" />
            <Text style={styles.featureLabel}>2 Jogadores</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="color-palette" size={20} color="#ec4899" />
            <Text style={styles.featureLabel}>4 Temas</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="volume-high" size={20} color="#f59e0b" />
            <Text style={styles.featureLabel}>Tempo & Som</Text>
          </View>
        </View>

        {/* Menu de Ações Principais */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.btnBot}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Tela3', { mode: 'bot' })}
          >
            <View style={styles.btnIconWrapper}>
              <MaterialCommunityIcons name="robot-excited" size={22} color="#ffffff" />
            </View>
            <View style={styles.btnTextWrapper}>
              <Text style={styles.btnPrimaryTitle}>MODO OFFLINE (VS BOT)</Text>
              <Text style={styles.btnPrimarySubtitle}>Desafie a Inteligência Artificial (3 níveis)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Tela3', { mode: 'pvp' })}
          >
            <View style={styles.btnIconWrapper}>
              <Ionicons name="people" size={22} color="#ffffff" />
            </View>
            <View style={styles.btnTextWrapper}>
              <Text style={styles.btnPrimaryTitle}>DOIS JOGADORES (LOCAL)</Text>
              <Text style={styles.btnPrimarySubtitle}>Partida Pass & Play no mesmo aparelho</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Tela2')}
          >
            <Ionicons name="book-outline" size={20} color="#38bdf8" style={styles.btnSecondaryIcon} />
            <Text style={styles.btnSecondaryText}>Instruções e Regras</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Tela4')}
          >
            <Ionicons name="information-circle-outline" size={20} color="#a855f7" style={styles.btnSecondaryIcon} />
            <Text style={styles.btnSecondaryText}>Créditos do Projeto</Text>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Rodapé Acadêmico */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Atividade Prática 11 • Programação para Dispositivos Móveis II
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 30,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 2,
    borderColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#f59e0b',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  badgeFatec: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeFatecText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  previewCard: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 18,
  },
  miniBoard: {
    width: 140,
    height: 105,
    borderWidth: 2,
    borderColor: '#b58863',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  miniRow: {
    flexDirection: 'row',
    height: 35,
  },
  miniSquare: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightSquare: {
    backgroundColor: '#f0d9b5',
  },
  darkSquare: {
    backgroundColor: '#b58863',
  },
  miniPiece: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceP1: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  pieceP2: {
    backgroundColor: '#3e2723',
    borderWidth: 1.5,
    borderColor: '#1b0000',
  },
  previewCaption: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flex: 1,
    backgroundColor: '#1e293b',
    marginHorizontal: 3,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureLabel: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '600',
    marginTop: 4,
  },
  menuContainer: {
    width: '100%',
    gap: 12,
  },
  btnBot: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  btnPrimary: {
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  btnIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  btnTextWrapper: {
    flex: 1,
  },
  btnPrimaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  btnPrimarySubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  btnSecondary: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnSecondaryIcon: {
    marginRight: 12,
  },
  btnSecondaryText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  footerNote: {
    marginTop: 26,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
});
