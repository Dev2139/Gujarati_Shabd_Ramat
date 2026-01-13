import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gamepad2, Users, Smartphone, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameMode, GameSetup } from '@/types/game';
import { GUJARATI_CONSONANTS, GUJARATI_VOWELS, GUJARATI_MATRAS } from '@/utils/wordValidation';
import { cn } from '@/lib/utils';
import MultiplayerSetup from '@/components/MultiplayerSetup';

interface StartScreenProps {
  onStart: (mode: GameMode, setup: GameSetup, gameCode?: string) => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [letterA, setLetterA] = useState('ક');
  const [letterB, setLetterB] = useState('ખ');
  const [showSetup, setShowSetup] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  
  // State for tabs and letter selection
  const [activeTab, setActiveTab] = useState<'consonants' | 'vowels' | 'combinations'>('consonants');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Generate consonant-matra combinations
  const consonantMatraCombinations = [];
  for (const consonant of GUJARATI_CONSONANTS) {
    for (const matra of GUJARATI_MATRAS) {
      if (matra === 'ા') consonantMatraCombinations.push(consonant + 'ા');
      if (matra === 'િ') consonantMatraCombinations.push(consonant + 'િ');
      if (matra === 'ી') consonantMatraCombinations.push(consonant + 'ી');
      if (matra === 'ુ') consonantMatraCombinations.push(consonant + 'ુ');
      if (matra === 'ૂ') consonantMatraCombinations.push(consonant + 'ૂ');
      if (matra === 'ે') consonantMatraCombinations.push(consonant + 'ે');
      if (matra === 'ૈ') consonantMatraCombinations.push(consonant + 'ૈ');
      if (matra === 'ો') consonantMatraCombinations.push(consonant + 'ો');
      if (matra === 'ૌ') consonantMatraCombinations.push(consonant + 'ૌ');
    }
  }
  
  // Function to filter letters based on search term
  const filterLetters = (letters: string[]) => {
    if (!searchTerm) return letters;
    return letters.filter(letter => letter.includes(searchTerm));
  };
  
  // Function to get letters based on active tab
  const getLettersForTab = () => {
    let letters = [];
    if (activeTab === 'consonants') letters = GUJARATI_CONSONANTS;
    else if (activeTab === 'vowels') letters = GUJARATI_VOWELS;
    else letters = consonantMatraCombinations;
    
    return filterLetters(letters);
  };

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

      {!showSetup && !showMultiplayer ? (
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
            onClick={() => setShowMultiplayer(true)}
            size="lg"
            className="h-auto py-6 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="bg-card/20 p-3 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xl font-bold">બહુ-ઉપકરણ રમત</p>
                <p className="text-sm opacity-80">અલગ-અલગ ઉપકરણ પરથી રમો</p>
              </div>
              <Users className="w-6 h-6" />
            </div>
          </Button>
        </div>
      ) : showMultiplayer ? (
        <div className="w-full max-w-2xl animate-slide-up bg-card rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            બહુ-ઉપકરણ રમત
          </h3>
          
          <div className="flex gap-4 mb-6">
            <Button
              variant={showMultiplayer && !showSetup ? "default" : "outline"}
              onClick={() => {
                setShowSetup(false);
                setShowMultiplayer(true);
              }}
              className="flex-1 h-12 text-lg"
            >
              રમત બનાવો
            </Button>
            <Button
              variant={showSetup ? "default" : "outline"}
              onClick={() => {
                setShowSetup(true);
                setShowMultiplayer(false);
              }}
              className="flex-1 h-12 text-lg"
            >
              રમતમાં જોડાઓ
            </Button>
          </div>
          
          <MultiplayerSetup
            onStart={(mode, setup, gameCode) => {
              // Pass the gameCode to the parent component
              onStart(mode, setup);
              // In a real implementation, we would handle the gameCode here
              console.log('Starting multiplayer game with code:', gameCode);
            }}
            isHost={!showSetup}
          />
          
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowMultiplayer(false);
                setShowSetup(false);
              }}
              className="h-12 text-lg"
            >
              પાછા જાઓ
            </Button>
          </div>
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
            
            {/* Tab Navigation */}
            <div className="flex mb-3">
              <button
                className={`flex-1 py-2 px-4 rounded-l-lg text-center ${activeTab === 'consonants' ? 'bg-teamA text-white' : 'bg-muted'}`}
                onClick={() => setActiveTab('consonants')}
              >
                વ્યંજન (Consonants)
              </button>
              <button
                className={`flex-1 py-2 px-4 ${activeTab === 'vowels' ? 'bg-teamA text-white' : 'bg-muted'}`}
                onClick={() => setActiveTab('vowels')}
              >
                સ્વર (Vowels)
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-r-lg text-center ${activeTab === 'combinations' ? 'bg-teamA text-white' : 'bg-muted'}`}
                onClick={() => setActiveTab('combinations')}
              >
                માત્રા સાથે (With Matras)
              </button>
            </div>
            
            {/* Search Input */}
            {activeTab === 'combinations' && (
              <input
                type="text"
                placeholder="શોધો... (કા, કિ, કી, વગેરે)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-3 rounded-lg border border-input bg-background"
              />
            )}
            
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-teamA-light rounded-xl">
              {getLettersForTab().map((letter) => (
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
            
            {/* Tab Navigation */}
            <div className="flex mb-3">
              <button
                className={`flex-1 py-2 px-4 rounded-l-lg text-center ${activeTab === 'consonants' ? 'bg-teamB text-white' : 'bg-muted'}`}
                onClick={() => setActiveTab('consonants')}
              >
                વ્યંજન (Consonants)
              </button>
              <button
                className={`flex-1 py-2 px-4 ${activeTab === 'vowels' ? 'bg-teamB text-white' : 'bg-muted'}`}
                onClick={() => setActiveTab('vowels')}
              >
                સ્વર (Vowels)
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-r-lg text-center ${activeTab === 'combinations' ? 'bg-teamB text-white' : 'bg-muted'}`}
                onClick={() => setActiveTab('combinations')}
              >
                માત્રા સાથે (With Matras)
              </button>
            </div>
            
            {/* Search Input */}
            {activeTab === 'combinations' && (
              <input
                type="text"
                placeholder="શોધો... (કા, કિ, કી, વગેરે)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-3 rounded-lg border border-input bg-background"
              />
            )}
            
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-teamB-light rounded-xl">
              {getLettersForTab().map((letter) => (
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
