// src/app/screens/tela2.tsx - Tela 2: Instruções do Jogo
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function Tela2Screen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="book-open-page-variant" size={36} color="#38bdf8" />
          <Text style={styles.headerTitle}>Como Jogar Dama</Text>
          <Text style={styles.headerSubtitle}>
            Guia oficial de regras e mecânicas da nossa versão
          </Text>
        </View>

        {/* Card 1: Objetivo */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.badgeIcon, { backgroundColor: '#0284c7' }]}>
              <Ionicons name="trophy" size={18} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>1. Objetivo do Jogo</Text>
          </View>
          <Text style={styles.cardBody}>
            O objetivo é capturar todas as peças do adversário ou deixá-lo sem movimentos
            válidos disponíveis (bloqueio total). Vence quem eliminar todas as peças opostas
            ou imobilizar o oponente.
          </Text>
        </View>

        {/* Card 2: Movimentação Básica */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.badgeIcon, { backgroundColor: '#10b981' }]}>
              <Ionicons name="arrow-up-circle" size={18} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>2. Movimentação Básica</Text>
          </View>
          <Text style={styles.cardBody}>
            • O jogo ocorre exclusivamente nas casas escuras do tabuleiro 8x8.{'\n'}
            • As pedras comuns se movem <Text style={styles.boldText}>uma casa na diagonal para frente</Text> em direção ao campo adversário.{'\n'}
            • Jogador 1 (inferior) avança para cima; Jogador 2 (superior) avança para baixo.
          </Text>
        </View>

        {/* Card 3: Captura e Saltos Múltiplos */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.badgeIcon, { backgroundColor: '#ef4444' }]}>
              <MaterialCommunityIcons name="sword-cross" size={18} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>3. Captura e Saltos Múltiplos</Text>
          </View>
          <Text style={styles.cardBody}>
            • Para capturar, salte sobre a peça adversária adjacente e pouse na casa vazia logo atrás.{'\n'}
            • <Text style={styles.boldText}>Captura para Trás:</Text> Pedras comuns podem capturar tanto para frente quanto para trás.{'\n'}
            • <Text style={styles.boldText}>Captura Obrigatória:</Text> Se houver uma captura disponível no seu turno, você deve executá-la (o jogo destacará a jogada em vermelho/verde).{'\n'}
            • <Text style={styles.boldText}>Múltiplas Capturas:</Text> Se após um salto a mesma peça puder capturar novamente, o turno continua para completar a cadeia de saltos!
          </Text>
        </View>

        {/* Card 4: Dama (Coroação) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.badgeIcon, { backgroundColor: '#f59e0b' }]}>
              <MaterialCommunityIcons name="crown" size={18} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>4. A Dama (Coroação)</Text>
          </View>
          <Text style={styles.cardBody}>
            • Uma pedra é promovida a <Text style={styles.boldText}>Dama</Text> assim que atinge a última fileira do lado adversário.{'\n'}
            • A Dama ganha o símbolo de coroa dourada.{'\n'}
            • <Text style={styles.boldText}>Dama Voadora:</Text> Pode se mover e capturar por longas distâncias em qualquer sentido diagonal, desde que o caminho esteja livre.
          </Text>
        </View>

        {/* Card 5: Recursos do App */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.badgeIcon, { backgroundColor: '#8b5cf6' }]}>
              <Ionicons name="sparkles" size={18} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>5. Recursos do App</Text>
          </View>
          <Text style={styles.cardBody}>
            • <Text style={styles.boldText}>Temas de Cores:</Text> Escolha entre Madeira Clássica, Floresta Esmeralda, Dark Cyber e Oceano Safira.{'\n'}
            • <Text style={styles.boldText}>Cronômetro:</Text> Acompanhe a duração da partida em tempo real.{'\n'}
            • <Text style={styles.boldText}>Placar de Peças:</Text> Visualize quantas peças restam e quantas foram capturadas.{'\n'}
            • <Text style={styles.boldText}>Áudio & Vibração:</Text> Feedback sonoro para jogadas, capturas e vitória (com botão de mudo).
          </Text>
        </View>

        {/* Botão de Ir para o Jogo */}
        <TouchableOpacity
          style={styles.btnStart}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Tela3', { mode: 'bot' })}
        >
          <Ionicons name="game-controller" size={22} color="#ffffff" style={styles.btnStartIcon} />
          <Text style={styles.btnStartText}>ENTENDI, IR PARA O JOGO!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnBack}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color="#94a3b8" />
          <Text style={styles.btnBackText}>Voltar</Text>
        </TouchableOpacity>
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
    paddingTop: 24,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  cardBody: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#38bdf8',
  },
  btnStart: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#10b981',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  btnStartIcon: {
    marginRight: 8,
  },
  btnStartText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 6,
  },
  btnBackText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: 6,
  },
});
