import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, AlertCircle } from 'lucide-react';
import { getTeamLetter } from '@/utils/wordValidation';
import { cn } from '@/lib/utils';

interface WordInputProps {
  currentTeam: 'A' | 'B';
  onSubmit: (word: string) => void;
  error?: string;
  disabled?: boolean;
}

const WordInput = ({ currentTeam, onSubmit, error, disabled }: WordInputProps) => {
  const [word, setWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const teamLetter = getTeamLetter(currentTeam);
  const isTeamA = currentTeam === 'A';

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentTeam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && !disabled) {
      onSubmit(word.trim());
      setWord('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-3">
        <div
          className={cn(
            'text-center p-3 rounded-xl transition-all duration-300',
            isTeamA ? 'bg-teamA-light' : 'bg-teamB-light'
          )}
        >
          <p className="text-lg font-medium text-foreground">
            Team {currentTeam} - "{teamLetter}" થી શરૂ થતો શબ્દ લખો
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={`${teamLetter}... શબ્દ લખો`}
              className={cn(
                'text-xl md:text-2xl h-14 px-4 bg-card border-2 transition-all',
                error ? 'border-invalid animate-shake' : 'border-border focus:border-primary'
              )}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={!word.trim() || disabled}
            className={cn(
              'h-14 px-6 text-lg font-bold transition-all duration-300',
              isTeamA 
                ? 'bg-teamA hover:bg-teamA/90' 
                : 'bg-teamB hover:bg-teamB/90',
              'text-primary-foreground'
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-invalid animate-slide-up bg-invalid/10 p-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>
    </form>
  );
};

export default WordInput;
