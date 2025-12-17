import { useCallback, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StartScreen from '@/components/StartScreen';
import TeamCard from '@/components/TeamCard';
import VoiceInput from '@/components/VoiceInput';
import WordList from '@/components/WordList';
import GameControls from '@/components/GameControls';
import WinnerAnnouncement from '@/components/WinnerAnnouncement';
import { useGameState } from '@/hooks/useGameState';
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

  const currentTeamRef = useRef<'A' | 'B' | null>(null);
  const [recognitionError, setRecognitionError] = useState<string>('');

  const handleSpeechResult = useCallback((transcript: string) => {
    if (currentTeamRef.current && transcript) {
      submitWord(transcript, currentTeamRef.current);
      currentTeamRef.current = null;
    }
  }, [submitWord]);

  const handleSpeechError = useCallback((errorMsg: string) => {
    setRecognitionError(errorMsg);
    setTeamSpeaking(null);
    currentTeamRef.current = null;
  }, [setTeamSpeaking]);

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
    setTeamSpeaking(team);
    startListening();
  }, [setTeamSpeaking, startListening]);

  const handleStopSpeaking = useCallback(() => {
    stopListening();
    // Don't reset speaking team here - wait for result
    setTimeout(() => {
      if (currentTeamRef.current) {
        setTeamSpeaking(null);
        currentTeamRef.current = null;
      }
    }, 2000);
  }, [stopListening, setTeamSpeaking]);

  const handleGameStart = useCallback((mode: 'single' | 'multiplayer', setup: GameSetup) => {
    startGame(mode, setup);
  }, [startGame]);

  const { isPlaying, teams, winner, speakingTeam } = gameState;

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
                error={error || recognitionError}
                lastRecognizedWord={lastRecognizedWord}
                isSupported={isSupported}
              />
            )}

            {/* Game Controls */}
            <GameControls
              onEndGame={endGame}
              onPrint={printWords}
              onRestart={restartGame}
              isGameEnded={!isPlaying && winner !== null}
            />

            {/* Word Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <WordList
                words={teams.A.words}
                team="A"
                title={`Team A - "${teams.A.letter}" ના શબ્દો`}
              />
              <WordList
                words={teams.B.words}
                team="B"
                title={`Team B - "${teams.B.letter}" ના શબ્દો`}
              />
            </div>
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
