import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameMode, GameSetup } from '@/types/game';
import { GAME_LETTERS } from '@/utils/wordValidation';
import { cn } from '@/lib/utils';
import socketService from '@/services/socketService';

interface MultiplayerSetupProps {
  onStart: (mode: GameMode, setup: GameSetup, gameCode?: string) => void;
  isHost?: boolean;
}

const MultiplayerSetup = ({ onStart, isHost = true }: MultiplayerSetupProps) => {
  const [gameCode, setGameCode] = useState('');
  const [letterA, setLetterA] = useState('ક');
  const [letterB, setLetterB] = useState('ખ');
  const [playerName, setPlayerName] = useState('');

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      alert('કૃપા કરીને તમારું નામ દાખલ કરો');
      return;
    }
    
    // Create game through socket
    socketService.createGame({ letterA, letterB }, (code, error) => {
      if (error) {
        console.error('Error creating game:', error);
        alert('રમત બનાવવામાં ત્રુટિ: ' + error);
      } else if (code) {
        console.log('Game created with code:', code);
        onStart('multiplayer', { letterA, letterB }, code);
      }
    });
  };

  const handleJoinGame = () => {
    if (gameCode.length !== 4) {
      alert('કૃપા કરીને યોગ્ય 4-અક્ષરનો રમત કોડ દાખલ કરો');
      return;
    }
    
    if (!playerName.trim()) {
      alert('કૃપા કરીને તમારું નામ દાખલ કરો');
      return;
    }
    
    // Join game through socket
    socketService.joinGame(gameCode, playerName, (success, error) => {
      if (error) {
        console.error('Error joining game:', error);
        alert('રમતમાં જોડાવામાં ત્રુટિ: ' + error);
      } else if (success) {
        console.log('Successfully joined game:', gameCode);
        onStart('multiplayer', { letterA, letterB }, gameCode);
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isHost ? (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">રમત બનાવો</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">તમારું નામ</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="તમારું નામ લખો..."
                className="text-lg py-6"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Team A નો અક્ષર</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-100 rounded-xl">
                {GAME_LETTERS.slice(0, 20).map((letter) => (
                  <button
                    key={`A-${letter}`}
                    onClick={() => setLetterA(letter)}
                    disabled={letter === letterB}
                    className={cn(
                      'w-10 h-10 rounded-lg text-xl font-bold transition-all',
                      letterA === letter
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : letter === letterB
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-100 text-gray-800'
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-center text-3xl font-bold text-blue-600">{letterA}</div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Team B નો અક્ષર</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-100 rounded-xl">
                {GAME_LETTERS.slice(0, 20).map((letter) => (
                  <button
                    key={`B-${letter}`}
                    onClick={() => setLetterB(letter)}
                    disabled={letter === letterA}
                    className={cn(
                      'w-10 h-10 rounded-lg text-xl font-bold transition-all',
                      letterB === letter
                        ? 'bg-purple-500 text-white shadow-lg scale-110'
                        : letter === letterA
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white hover:bg-purple-100 text-gray-800'
                    )}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-center text-3xl font-bold text-purple-600">{letterB}</div>
            </div>

            <Button
              onClick={handleCreateGame}
              className="w-full py-6 text-lg font-bold"
            >
              રમત બનાવો અને રમતા રહો
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">રમતમાં જોડાઓ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">રમત કોડ</label>
              <Input
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="ABCD"
                maxLength={4}
                className="text-center text-2xl py-6 uppercase"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">તમારું નામ</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="તમારું નામ લખો..."
                className="text-lg py-6"
              />
            </div>

            <Button
              onClick={handleJoinGame}
              disabled={gameCode.length !== 4}
              className="w-full py-6 text-lg font-bold"
            >
              રમતમાં જોડાઓ
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiplayerSetup;