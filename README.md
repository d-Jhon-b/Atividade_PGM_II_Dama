# Atividade Prática 11 - Clone Jogo de Dama ♟️

Projeto desenvolvido para a disciplina de **Programação para Dispositivos Móveis II** (5º Semestre) da **FATEC Itaquera**, no curso de **Desenvolvimento de Software Multiplataforma**.

---

## 👨‍🎓 Informações do Aluno e Instituição
* **Aluno / Desenvolvedor:** Jhon Deyvid Quispe Mamani
* **Instituição:** Faculdade de Tecnologia de Itaquera - Fatec Itaquera (Centro Paula Souza)
* **Curso:** Graduação em Desenvolvimento de Software Multiplataforma (DSM)
* **Disciplina:** Programação para Dispositivos Móveis II (5º Semestre)
* **Professor Orientador:** Prof. Jeferson de Souza Dias
* **Data da Atividade:** 9/11/2026

---

## 📋 Requisitos Atendidos da Atividade

1. **Estrutura de Arquivos e Telas com React Navigation (`tela1.js`, `tela2.js`, `tela3.js`, `tela4.js`):**
   * `tela1.js` (**Tela 1 - Boas-Vindas**): Apresentação visual atraente, preview do tabuleiro, resumo de recursos e botões de navegação.
   * `tela2.js` (**Tela 2 - Instruções do Jogo**): Regras oficiais de movimentação, capturas, capturas em cadeia, coroação de dama e dicas estratégicas.
   * `tela3.js` (**Tela 3 - O Jogo**): Tabuleiro 8x8 interativo e responsivo, placar em tempo real, cronômetro, seletor de temas e modal de vitória.
   * `tela4.js` (**Tela 4 - Créditos**): Dados do aluno, curso, faculdade, disciplina, orientador e a frase acadêmica obrigatória em destaque:
     > *"Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real."*
   * `App.js`: Configuração do Stack Navigator com `@react-navigation/native-stack` e `NavigationContainer`.

2. **Templates de Cores para Tabuleiro e Peças (`temas.js`):**
   * Pelo menos 2 cores diferentes para o tabuleiro e peças (foram criados **4 temas completos**):
     * 🌲 **Madeira Clássica:** Tabuleiro tons de marrom/bege; peças mogno e marfim.
     * 🍃 **Floresta Esmeralda:** Tabuleiro estilo torneio verde e branco; peças âmbar e marfim.
     * ⚡ **Dark Cyber Neon:** Tabuleiro azul escuro/ardósia; peças rosa e ciano neon.
     * 🌊 **Oceano Safira:** Tabuleiro safira e azul claro; peças azul marinho e neve.
   * Seletor de temas com modal de pré-visualização instantânea das cores e peças durante a partida.

3. **Mecânica Completa do Jogo de Dama (`regrasDama.js`):**
   * Tabuleiro 8x8 nas casas escuras.
   * Movimentação diagonal para pedras comuns.
   * Capturas simples e obrigatórias (com destaque visual para peças que devem capturar).
   * **Captura para Trás:** Implementada conforme as regras brasileiras e internacionais.
   * **Capturas em Cadeia:** Se houver saltos subsequentes com a mesma peça, o turno continua para finalizar o combo de capturas.
   * **Coroação da Dama:** Peça atinge a última fileira e é promovida, recebendo uma coroa dourada e movimentação voadora ao longo das diagonais livres.
   * **Detecção de Vitória:** Por eliminação de todas as peças ou por bloqueio de movimentos válidos do oponente.

4. **Recursos Extras Implementados:**
   * 👥 **2 Jogadores Local (*Pass & Play*):** Indicador visual de turno ("Vez do Jogador 1 / Jogador 2").
   * ⏱️ **Cronômetro e Placar:** Tempo decorrido de partida (`MM:SS`), contador de peças restantes, damas e peças capturadas.
   * 🔊 **Efeitos Sonoros e Vibração (`soundManager.js`):** Sons para movimento, captura, coroação de dama e vitória com controle de Mudo (Mute/Unmute).
   * 🎨 **Ícones Vetoriais:** Utilização da biblioteca compatível `@expo/vector-icons`.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js v20+ / v22+
* Expo CLI (`npx expo`)

### Passos
1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npx expo start
   ```

3. Abra no navegador (pressione `w`), ou no aplicativo **Expo Go** do seu celular lendo o QR Code exibido.

---

## 🌐 Como Salvar e Entregar no SnackExpoDev (snack.expo.dev)

Conforme a instrução da atividade:
> *"O projeto tem que ser criado no React Native, deve ser salvo no SnackExpoDev e salvar o link na tarefa criado no Teams, conforme data limite de entrega."*

Para publicar no Snack:
1. Acesse **[snack.expo.dev](https://snack.expo.dev)**.
2. Na árvore de arquivos lateral do Snack, crie/substitua os seguintes arquivos com o conteúdo deste repositório:
   * `App.js`
   * `tela1.js`
   * `tela2.js`
   * `tela3.js`
   * `tela4.js`
   * `regrasDama.js`
   * `temas.js`
   * `soundManager.js`
3. No painel de dependências do Snack (`package.json`), certifique-se de que constam:
   * `@react-navigation/native`
   * `@react-navigation/native-stack`
   * `react-native-safe-area-context`
   * `react-native-screens`
   * `@expo/vector-icons`
4. Clique no botão **Save** no canto superior direito do Snack para gerar o link público.
5. Copie o link do seu Snack e cole na tarefa correspondente no **Microsoft Teams**.

---

## 🛡️ Verificação de Qualidade
* `npx tsc --noEmit`: 0 erros
* `npx expo lint`: 0 erros
* `npx expo-doctor`: 20/20 verificações aprovadas
