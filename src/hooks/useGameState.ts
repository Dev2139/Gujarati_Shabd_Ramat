import { useState, useCallback } from 'react';
import { GameState, Word, GameMode, GameSetup } from '@/types/game';
import { validateWord } from '@/utils/wordValidation';

const createInitialGameState = (setup?: GameSetup): GameState => ({
  isPlaying: false,
  currentTeam: null,
  teams: {
    A: {
      id: 'A',
      name: 'Team A',
      letter: setup?.letterA || 'ક',
      score: 0,
      words: [],
    },
    B: {
      id: 'B',
      name: 'Team B',
      letter: setup?.letterB || 'ખ',
      score: 0,
      words: [],
    },
  },
  winner: null,
  isListening: false,
  speakingTeam: null,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [error, setError] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [lastRecognizedWord, setLastRecognizedWord] = useState<string>('');

  const startGame = useCallback((mode: GameMode, setup: GameSetup) => {
    setGameMode(mode);
    setGameState({
      ...createInitialGameState(setup),
      isPlaying: true,
    });
    setError('');
    setLastRecognizedWord('');
  }, []);

  const setTeamSpeaking = useCallback((team: 'A' | 'B' | null) => {
    setGameState((prev) => ({
      ...prev,
      speakingTeam: team,
      isListening: team !== null,
    }));
  }, []);

  const submitWord = useCallback((word: string, team: 'A' | 'B') => {
    setError('');
    setLastRecognizedWord(word);
    
    const teamData = gameState.teams[team];
    const allWords = [
      ...gameState.teams.A.words,
      ...gameState.teams.B.words,
    ].map((w) => w.text);

    const validation = validateWord(word, teamData.letter, allWords);

    const newWord: Word = {
      id: `${Date.now()}-${Math.random()}`,
      text: word,
      team: team,
      isValid: validation.isValid,
      isDuplicate: validation.isDuplicate,
      timestamp: Date.now(),
    };

    setGameState((prev) => {
      const updatedTeam = {
        ...prev.teams[team],
        words: [...prev.teams[team].words, newWord],
        score: validation.isValid ? prev.teams[team].score + 1 : prev.teams[team].score,
      };

      return {
        ...prev,
        teams: {
          ...prev.teams,
          [team]: updatedTeam,
        },
        speakingTeam: null,
        isListening: false,
      };
    });

    if (!validation.isValid) {
      setError(validation.error || 'અમાન્ય શબ્દ');
    }

    return validation;
  }, [gameState.teams]);

  const endGame = useCallback(() => {
    setGameState((prev) => {
      const scoreA = prev.teams.A.score;
      const scoreB = prev.teams.B.score;
      
      let winner: 'A' | 'B' | 'tie';
      if (scoreA > scoreB) {
        winner = 'A';
      } else if (scoreB > scoreA) {
        winner = 'B';
      } else {
        winner = 'tie';
      }

      return {
        ...prev,
        isPlaying: false,
        winner,
        speakingTeam: null,
        isListening: false,
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setGameState(createInitialGameState());
    setGameMode(null);
    setError('');
    setLastRecognizedWord('');
  }, []);

  const printWords = useCallback(() => {
    const printContent = `
      <html>
        <head>
          <title>ગુજરાતી શબ્દ રમત - પરિણામ</title>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Noto Sans Gujarati', sans-serif;
              padding: 20px;
            }
            h1 { text-align: center; }
            h2 { margin-top: 20px; }
            .team-a { color: #0ea5e9; }
            .team-b { color: #a855f7; }
            .valid { color: green; }
            .invalid { color: red; text-decoration: line-through; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .score { font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>જડીયાણા પ્રાથમિક શાળા</h1>
          <h2>ગુજરાતી શબ્દ રમત - પરિણામ</h2>
          
          <h3 class="team-a">Team A (${gameState.teams.A.letter}) - સ્કોર: <span class="score">${gameState.teams.A.score}</span></h3>
          <table>
            <tr><th>શબ્દ</th><th>સ્થિતિ</th></tr>
            ${gameState.teams.A.words.map(w => `
              <tr class="${w.isValid ? 'valid' : 'invalid'}">
                <td>${w.text}</td>
                <td>${w.isValid ? 'માન્ય ✓' : (w.isDuplicate ? 'પુનરાવર્તિત ✗' : 'અમાન્ય ✗')}</td>
              </tr>
            `).join('')}
          </table>

          <h3 class="team-b">Team B (${gameState.teams.B.letter}) - સ્કોર: <span class="score">${gameState.teams.B.score}</span></h3>
          <table>
            <tr><th>શબ્દ</th><th>સ્થિતિ</th></tr>
            ${gameState.teams.B.words.map(w => `
              <tr class="${w.isValid ? 'valid' : 'invalid'}">
                <td>${w.text}</td>
                <td>${w.isValid ? 'માન્ય ✓' : (w.isDuplicate ? 'પુનરાવર્તિત ✗' : 'અમાન્ય ✗')}</td>
              </tr>
            `).join('')}
          </table>

          ${gameState.winner ? `
            <h2 style="text-align: center; margin-top: 30px;">
              ${gameState.winner === 'tie' ? 'રમત ટાઈ! 🤝' : `Team ${gameState.winner} જીત્યું! 🎉`}
            </h2>
          ` : ''}

          <p style="margin-top: 30px; text-align: center; color: #666;">
            Developed by Dev Patel | +91 6354236105
          </p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }, [gameState]);

  return {
    gameState,
    gameMode,
    error,
    lastRecognizedWord,
    startGame,
    submitWord,
    setTeamSpeaking,
    endGame,
    restartGame,
    printWords,
    setError,
  };
};
