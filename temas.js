// temas.js - Templates de cores para o tabuleiro e as peças

export const TEMAS = [
  {
    id: 'madeira',
    nome: 'Madeira Clássica',
    descricao: 'Visual aconchegante e tradicional de jogos de tabuleiro de madeira.',
    tabuleiro: {
      clara: '#f0d9b5',
      escura: '#b58863',
      borda: '#6d4c41',
      casaSelecionada: '#ffd54f',
      movimentoPossivel: 'rgba(76, 175, 80, 0.45)',
      capturaPossivel: 'rgba(239, 83, 80, 0.65)',
    },
    pecas: {
      p1: {
        principal: '#fffdf7',
        borda: '#d7ccc8',
        sombra: '#bcaaa4',
        anel: '#8d6e63',
        coroa: '#f59e0b',
        rotulo: 'Brancas / Madeira Clara',
      },
      p2: {
        principal: '#3e2723',
        borda: '#271613',
        sombra: '#1b0000',
        anel: '#5d4037',
        coroa: '#fbbf24',
        rotulo: 'Pretas / Mogno',
      },
    },
  },
  {
    id: 'esmeralda',
    nome: 'Floresta Esmeralda',
    descricao: 'Inspirado nos tradicionais tabuleiros de torneios profissionais.',
    tabuleiro: {
      clara: '#f1f8e9',
      escura: '#2e7d32',
      borda: '#1b5e20',
      casaSelecionada: '#ffeb3b',
      movimentoPossivel: 'rgba(129, 199, 132, 0.55)',
      capturaPossivel: 'rgba(244, 67, 54, 0.7)',
    },
    pecas: {
      p1: {
        principal: '#ffffff',
        borda: '#cfd8dc',
        sombra: '#b0bec5',
        anel: '#78909c',
        coroa: '#f59e0b',
        rotulo: 'Branco Marfim',
      },
      p2: {
        principal: '#e65100',
        borda: '#bf360c',
        sombra: '#870000',
        anel: '#ff6f00',
        coroa: '#ffeb3b',
        rotulo: 'Âmbar Dourado',
      },
    },
  },
  {
    id: 'cyber',
    nome: 'Dark Cyber Neon',
    descricao: 'Contraste moderno de alta definição com tons ciano e rosa neon.',
    tabuleiro: {
      clara: '#1e293b',
      escura: '#0f172a',
      borda: '#334155',
      casaSelecionada: '#38bdf8',
      movimentoPossivel: 'rgba(34, 197, 94, 0.5)',
      capturaPossivel: 'rgba(244, 63, 94, 0.7)',
    },
    pecas: {
      p1: {
        principal: '#06b6d4',
        borda: '#22d3ee',
        sombra: '#0891b2',
        anel: '#a5f3fc',
        coroa: '#fef08a',
        rotulo: 'Ciano Neon',
      },
      p2: {
        principal: '#f43f5e',
        borda: '#fb7185',
        sombra: '#e11d48',
        anel: '#fecdd3',
        coroa: '#fef08a',
        rotulo: 'Rosa Choque',
      },
    },
  },
  {
    id: 'oceano',
    nome: 'Oceano Safira',
    descricao: 'Tons serenos de azul marinho com contraste nítido e suave.',
    tabuleiro: {
      clara: '#e0f2fe',
      escura: '#0284c7',
      borda: '#0369a1',
      casaSelecionada: '#fde047',
      movimentoPossivel: 'rgba(56, 189, 248, 0.5)',
      capturaPossivel: 'rgba(239, 68, 68, 0.7)',
    },
    pecas: {
      p1: {
        principal: '#f8fafc',
        borda: '#cbd5e1',
        sombra: '#94a3b8',
        anel: '#64748b',
        coroa: '#eab308',
        rotulo: 'Neve Glacial',
      },
      p2: {
        principal: '#1e3a8a',
        borda: '#172554',
        sombra: '#0f172a',
        anel: '#3b82f6',
        coroa: '#facc15',
        rotulo: 'Azul Abissal',
      },
    },
  },
];

export const TEMA_PADRAO = TEMAS[0];
