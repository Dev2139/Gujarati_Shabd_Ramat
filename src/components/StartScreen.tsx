import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users, Smartphone, Sparkles } from 'lucide-react';
import { GameMode, GameSetup } from '@/types/game';
import { GUJARATI_CONSONANTS } from '@/utils/wordValidation';
import { cn } from '@/lib/utils';

interface StartScreenProps {
  onStart: (mode: GameMode, setup: GameSetup) => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [letterA, setLetterA] = useState('ડ');
  const [letterB, setLetterB] = useState('બ');
  const [showSetup, setShowSetup] = useState(false);

  const handleStartGame = () => {
    if (letterA === letterB) {
      return; // Don't allow same letters
    }
    onStart('single', { letterA, letterB });
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">અવાજથી રમો</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          ગુજરાતી શબ્દ રમત
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
          બોલીને શબ્દો આપો - લખવાની જરૂર નથી! 🎤
        </p>
      </div>

      {!showSetup ? (
        <div className="grid gap-4 md:gap-6 w-full max-w-md animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button
            onClick={() => setShowSetup(true)}
            size="lg"
            className="h-auto py-6 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="bg-card/20 p-3 rounded-xl">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xl font-bold">રમત શરૂ કરો</p>
                <p className="text-sm opacity-80">અક્ષર પસંદ કરો અને રમો</p>
              </div>
              <Gamepad2 className="w-6 h-6" />
            </div>
          </Button>

          <Button
            disabled
            size="lg"
            className="h-auto py-6 px-8 bg-muted text-muted-foreground rounded-2xl opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="bg-card/50 p-3 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xl font-bold">Multiple Devices</p>
                <p className="text-sm">ટૂંક સમયમાં આવી રહ્યું છે...</p>
              </div>
            </div>
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-2xl animate-slide-up bg-card rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            ટીમ માટે અક્ષર પસંદ કરો
          </h3>

          {/* Team A Letter Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-teamA" />
              <span className="text-lg font-bold text-teamA">Team A નો અક્ષર:</span>
              <span className="text-3xl font-bold text-teamA">{letterA}</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-teamA-light rounded-xl">
              {GUJARATI_CONSONANTS.map((letter) => (
                <button
                  key={`A-${letter}`}
                  onClick={() => setLetterA(letter)}
                  disabled={letter === letterB}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xl font-bold transition-all',
                    letterA === letter
                      ? 'bg-teamA text-white shadow-lg scale-110'
                      : letter === letterB
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-card hover:bg-teamA/20 text-foreground'
                  )}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Team B Letter Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-teamB" />
              <span className="text-lg font-bold text-teamB">Team B નો અક્ષર:</span>
              <span className="text-3xl font-bold text-teamB">{letterB}</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-teamB-light rounded-xl">
              {GUJARATI_CONSONANTS.map((letter) => (
                <button
                  key={`B-${letter}`}
                  onClick={() => setLetterB(letter)}
                  disabled={letter === letterA}
                  className={cn(
                    'w-10 h-10 rounded-lg text-xl font-bold transition-all',
                    letterB === letter
                      ? 'bg-teamB text-white shadow-lg scale-110'
                      : letter === letterA
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-card hover:bg-teamB/20 text-foreground'
                  )}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowSetup(false)}
              className="flex-1 h-12 text-lg"
            >
              પાછા જાઓ
            </Button>
            <Button
              onClick={handleStartGame}
              disabled={letterA === letterB}
              className="flex-1 h-12 text-lg bg-gradient-to-r from-primary to-accent"
            >
              રમત શરૂ કરો 🎮
            </Button>
          </div>
        </div>
      )}

      {/* Game Rules */}
      <div className="mt-8 bg-card rounded-2xl p-6 max-w-lg w-full shadow-lg animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-xl font-bold text-foreground mb-4 text-center">
          રમતના નિયમો 📜
        </h3>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">🎤</span>
            <span>દરેક ટીમ <strong>બોલીને</strong> શબ્દ આપશે</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">🔇</span>
            <span>એક સમયે <strong>એક જ ટીમ</strong> બોલી શકશે</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-valid">✓</span>
            <span>દરેક સાચા શબ્દ માટે +1 પોઇન્ટ</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-invalid">✗</span>
            <span>પુનરાવર્તિત શબ્દ માન્ય નથી</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary">ℹ</span>
            <span>ન = ણ અને લ = ળ માન્ય છે</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StartScreen;
