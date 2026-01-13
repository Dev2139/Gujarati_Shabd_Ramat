import { useCallback, useRef, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StartScreen from '@/components/StartScreen';
import TeamCard from '@/components/TeamCard';
import VoiceInput from '@/components/VoiceInput';
import WordList from '@/components/WordList';
import GameControls from '@/components/GameControls';
import WinnerAnnouncement from '@/components/WinnerAnnouncement';
import { useGameState } from '@/hooks/useGameState';
import { useMultiplayerGameState } from '@/hooks/useMultiplayerGameState';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { GameSetup } from '@/types/game';

const Index = () => {
  const {
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
  } = useGameState();
  
  const {
    gameState: multiplayerGameState,
    gameMode: multiplayerGameMode,
    error: multiplayerError,
    lastRecognizedWord: multiplayerLastWord,
    isConnected,
    startMultiplayerGame,
    submitWord: multiplayerSubmitWord,
    setTeamSpeaking: multiplayerSetTeamSpeaking,
    endGame: multiplayerEndGame,
    restartGame: multiplayerRestartGame,
    printWords: multiplayerPrintWords,
    setError: setMultiplayerError,
    createGame,
    joinGame,
  } = useMultiplayerGameState();
  
  // Use multiplayer state when in multiplayer mode
  const isMultiplayer = gameMode === 'multiplayer';
  const currentGameState = isMultiplayer ? multiplayerGameState : gameState;
  const currentError = isMultiplayer ? multiplayerError : error;
  const currentLastWord = isMultiplayer ? multiplayerLastWord : lastRecognizedWord;
  
  const handleSubmitWord = useCallback((word: string, team: 'A' | 'B') => {
    if (isMultiplayer) {
      return multiplayerSubmitWord(word, team);
    } else {
      return submitWord(word, team);
    }
  }, [isMultiplayer, multiplayerSubmitWord, submitWord]);
  
  const handleEndGame = useCallback(() => {
    if (isMultiplayer) {
      multiplayerEndGame();
    } else {
      endGame();
    }
  }, [isMultiplayer, multiplayerEndGame, endGame]);
  
  const handleRestartGame = useCallback(() => {
    if (isMultiplayer) {
      multiplayerRestartGame();
    } else {
      restartGame();
    }
  }, [isMultiplayer, multiplayerRestartGame, restartGame]);
  
  const handlePrintWords = useCallback(() => {
    if (isMultiplayer) {
      multiplayerPrintWords();
    } else {
      printWords();
    }
  }, [isMultiplayer, multiplayerPrintWords, printWords]);
  
  const handleSetTeamSpeaking = useCallback((team: 'A' | 'B' | null) => {
    if (isMultiplayer) {
      multiplayerSetTeamSpeaking(team);
    } else {
      setTeamSpeaking(team);
    }
  }, [isMultiplayer, multiplayerSetTeamSpeaking, setTeamSpeaking]);

  const currentTeamRef = useRef<'A' | 'B' | null>(null);
  const [recognitionError, setRecognitionError] = useState<string>('');

  const handleSpeechResult = useCallback((transcript: string) => {
    if (currentTeamRef.current && transcript) {
      handleSubmitWord(transcript, currentTeamRef.current);
      currentTeamRef.current = null;
    }
  }, [handleSubmitWord]);

  const handleSpeechError = useCallback((errorMsg: string) => {
    setRecognitionError(errorMsg);
    handleSetTeamSpeaking(null);
    currentTeamRef.current = null;
  }, [handleSetTeamSpeaking]);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  const handleStartSpeaking = useCallback((team: 'A' | 'B') => {
    setRecognitionError('');
    currentTeamRef.current = team;
    handleSetTeamSpeaking(team);
    startListening();
  }, [handleSetTeamSpeaking, startListening]);

  const handleStopSpeaking = useCallback(() => {
    stopListening();
    // Don't reset speaking team here - wait for result
    setTimeout(() => {
      if (currentTeamRef.current) {
        handleSetTeamSpeaking(null);
        currentTeamRef.current = null;
      }
    }, 2000);
  }, [stopListening, handleSetTeamSpeaking]);

  const handleGameStart = useCallback((mode: 'single' | 'multiplayer', setup: GameSetup, gameCode?: string) => {
    if (mode === 'multiplayer' && gameCode) {
      startMultiplayerGame(mode, setup, gameCode);
    } else {
      startGame(mode, setup, gameCode);
    }
  }, [startGame, startMultiplayerGame]);

  const { isPlaying, teams, winner, speakingTeam } = currentGameState;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {!gameMode ? (
          <StartScreen onStart={handleGameStart} />
        ) : (
          <div className="space-y-6 md:space-y-8 animate-slide-up">
            {/* Team Cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <TeamCard
                team={teams.A}
                isActive={isPlaying && speakingTeam === 'A'}
                isWinner={winner === 'A'}
                isSpeaking={speakingTeam === 'A'}
              />
              <TeamCard
                team={teams.B}
                isActive={isPlaying && speakingTeam === 'B'}
                isWinner={winner === 'B'}
                isSpeaking={speakingTeam === 'B'}
              />
            </div>

            {/* Voice Input */}
            {isPlaying && (
              <VoiceInput
                teams={teams}
                speakingTeam={speakingTeam}
                onStartSpeaking={handleStartSpeaking}
                onStopSpeaking={handleStopSpeaking}
                error={currentError || recognitionError}
                lastRecognizedWord={currentLastWord}
                isSupported={isSupported}
              />
            )}

            {/* Word Lists */}
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
                <div className="flex-1 min-w-0">
                  <WordList
                    words={teams.A.words}
                    team="A"
                    title={`Team A - "${teams.A.letter}" ના શબ્દો`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <WordList
                    words={teams.B.words}
                    team="B"
                    title={`Team B - "${teams.B.letter}" ના શબ્દો`}
                  />
                </div>
              </div>
            </div>

            {/* Game Controls */}
            <GameControls
              onEndGame={handleEndGame}
              onPrint={handlePrintWords}
              onRestart={handleRestartGame}
              isGameEnded={!isPlaying && winner !== null}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Winner Announcement Modal */}
      {winner && (
        <WinnerAnnouncement
          winner={winner}
          scoreA={teams.A.score}
          scoreB={teams.B.score}
        />
      )}
    </div>
  );
};

export default Index;
