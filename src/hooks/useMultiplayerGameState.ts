import { useState, useEffect, useCallback } from 'react';
import { GameState, GameMode, GameSetup, Word } from '@/types/game';
import { validateWord } from '@/utils/wordValidation';
import socketService from '@/services/socketService';

const createInitialGameState = (setup?: GameSetup, gameCode?: string): GameState => ({
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
  gameCode,
  isMultiplayer: gameCode !== undefined,
  players: {},
});

export const useMultiplayerGameState = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [error, setError] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [lastRecognizedWord, setLastRecognizedWord] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayerTeam, setCurrentPlayerTeam] = useState<'A' | 'B' | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for game events
    socketService.onGameStarted((gameState) => {
      setGameState(gameState);
      setGameMode('multiplayer');
    });

    socketService.onWordSubmitted((data) => {
      setGameState(prev => {
        const updatedTeam = {
          ...prev.teams[data.team],
          words: [...prev.teams[data.team].words, {
            id: `${Date.now()}-${Math.random()}`,
            text: data.word,
            team: data.team,
            isValid: data.isValid,
            isDuplicate: data.isDuplicate,
            timestamp: Date.now(),
          }],
          score: data.isValid ? prev.teams[data.team].score + 1 : prev.teams[data.team].score,
        };

        return {
          ...prev,
          teams: {
            ...prev.teams,
            [data.team]: updatedTeam,
          },
        };
      });
    });

    socketService.onGameEnded((winner) => {
      setGameState(prev => ({
        ...prev,
        winner,
        isPlaying: false,
      }));
    });

    socketService.onTurnChanged((currentTeam) => {
      setGameState(prev => ({
        ...prev,
        currentTeam,
      }));
    });

    socketService.onGameError((errorMsg) => {
      setError(errorMsg);
    });

    return () => {
      socketService.offGameStarted();
      socketService.offWordSubmitted();
      socketService.offGameEnded();
      socketService.offTurnChanged();
      socketService.offGameError();
    };
  }, []);

  const startMultiplayerGame = useCallback((mode: GameMode, setup: GameSetup, gameCode?: string) => {
    setGameMode(mode);
    setGameState({
      ...createInitialGameState(setup, gameCode),
      isPlaying: true,
    });
    setError('');
    setLastRecognizedWord('');
  }, []);

  const submitWord = useCallback((word: string, team: 'A' | 'B') => {
    setError('');
    setLastRecognizedWord(word);

    // For multiplayer, we need to send the word to the server
    if (gameState.isMultiplayer && gameState.gameCode) {
      // Validate the word locally first
      const teamData = gameState.teams[team];
      const allWords = [
        ...gameState.teams.A.words,
        ...gameState.teams.B.words,
      ].map((w) => w.text);

      const validation = validateWord(word, teamData.letter, allWords);

      // Send to server
      socketService.submitWord(gameState.gameCode, word, team, (success) => {
        if (!success) {
          setError('શબ્દ સબમિટ કરવામાં ત્રુટિ આવી');
        }
      });

      return validation;
    } else {
      // For single player, handle locally
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
        };
      });

      if (!validation.isValid) {
        setError(validation.error || 'અમાન્ય શબ્દ');
      }

      return validation;
    }
  }, [gameState]);

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
    if (gameState.gameCode) {
      // In multiplayer, we might want to reset the game on the server
      setGameState(createInitialGameState({ letterA: gameState.teams.A.letter, letterB: gameState.teams.B.letter }, gameState.gameCode));
    } else {
      setGameState(createInitialGameState());
    }
    setGameMode(null);
    setError('');
    setLastRecognizedWord('');
  }, [gameState]);

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

  const createGame = useCallback((setup: GameSetup, callback: (gameCode: string, error?: string) => void) => {
    socketService.createGame(setup, callback);
  }, []);

  const joinGame = useCallback((gameCode: string, playerName: string, callback: (success: boolean, error?: string) => void) => {
    socketService.joinGame(gameCode, playerName, callback);
  }, []);

  const setTeamSpeaking = useCallback((team: 'A' | 'B' | null) => {
    setGameState((prev) => ({
      ...prev,
      speakingTeam: team,
      isListening: team !== null,
    }));
  }, []);

  return {
    gameState,
    gameMode,
    error,
    lastRecognizedWord,
    isConnected,
    currentPlayerTeam,
    startMultiplayerGame,
    submitWord,
    setTeamSpeaking,
    endGame,
    restartGame,
    printWords,
    setError,
    createGame,
    joinGame,
  };
};