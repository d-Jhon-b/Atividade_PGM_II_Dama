// src/app/screens/tela4.tsx - Tela 4: Créditos do Jogo
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Tela4Screen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.crestCircle}>
            <Ionicons name="school" size={40} color="#38bdf8" />
          </View>
          <Text style={styles.title}>Créditos do Projeto</Text>
          <Text style={styles.subtitle}>Atividade Prática 11 • Jogo de Dama</Text>
        </View>

        {/* Card de Aviso Obrigatório da FATEC */}
        <View style={styles.mandatoryCard}>
          <View style={styles.mandatoryCardHeader}>
            <Ionicons name="warning" size={22} color="#f59e0b" />
            <Text style={styles.mandatoryCardTitle}>AVISO ACADÊMICO OBRIGATÓRIO</Text>
          </View>
          <Text style={styles.mandatoryQuote}>
            &quot;Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.&quot;
          </Text>
        </View>

        {/* Card de Informações do Aluno e Instituição */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionHeader}>DADOS DO PROJETO</Text>

          {/* Aluno */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person" size={16} color="#38bdf8" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Aluno / Desenvolvedor:</Text>
              <Text style={styles.infoValue}>Jhon Deyvid Quispe Mamani</Text>
            </View>
          </View>

          {/* Faculdade */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="business" size={16} color="#ec4899" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Faculdade:</Text>
              <Text style={styles.infoValue}>Fatec Itaquera (Centro Paula Souza)</Text>
            </View>
          </View>

          {/* Curso */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="code-slash" size={16} color="#10b981" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Curso:</Text>
              <Text style={styles.infoValue}>Desenvolvimento de Software Multiplataforma</Text>
            </View>
          </View>

          {/* Disciplina */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="phone-portrait" size={16} color="#a855f7" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Disciplina:</Text>
              <Text style={styles.infoValue}>Programação para Dispositivos Móveis II</Text>
            </View>
          </View>

          {/* Professor */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="ribbon" size={16} color="#fbbf24" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Professor Orientador:</Text>
              <Text style={styles.infoValue}>Prof. Jeferson de Souza Dias</Text>
            </View>
          </View>

          {/* Semestre */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="calendar" size={16} color="#60a5fa" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Turma / Semestre:</Text>
              <Text style={styles.infoValue}>5º Semestre • 2026</Text>
            </View>
          </View>
        </View>

        {/* Stack Tecnológico */}
        <View style={styles.techCard}>
          <Text style={styles.sectionHeader}>TECNOLOGIAS UTILIZADAS</Text>
          <View style={styles.techBadgesGrid}>
            <View style={styles.techBadge}>
              <Text style={styles.techBadgeText}>React Native</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techBadgeText}>Expo SDK 55</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techBadgeText}>Expo Router (app/screens)</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techBadgeText}>React Navigation Stack</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techBadgeText}>Vector Icons</Text>
            </View>
            <View style={styles.techBadge}>
              <Text style={styles.techBadgeText}>Web Audio API</Text>
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.btnPlay}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Tela3', { mode: 'bot' })}
          >
            <Ionicons name="play" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.btnPlayText}>IR PARA O JOGO DE DAMA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnHome}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Tela1')}
          >
            <Ionicons name="home-outline" size={18} color="#94a3b8" style={{ marginRight: 6 }} />
            <Text style={styles.btnHomeText}>Voltar à Página Inicial</Text>
          </TouchableOpacity>
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
    paddingTop: 24,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  crestCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 2,
    borderColor: '#38bdf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  mandatoryCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#f59e0b',
    marginBottom: 18,
  },
  mandatoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mandatoryCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#f59e0b',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  mandatoryQuote: {
    fontSize: 13,
    color: '#fef3c7',
    fontStyle: 'italic',
    lineHeight: 20,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 1,
  },
  techCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  techBadgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  techBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38bdf8',
  },
  actionsContainer: {
    gap: 10,
  },
  btnPlay: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPlayText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  btnHome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  btnHomeText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
});
