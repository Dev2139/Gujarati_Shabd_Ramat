import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  team: 'A' | 'B';
  teamLetter: string;
  isListening: boolean;
  isDisabled: boolean;
  onPress: () => void; // This will now act as our Click handler
  onRelease: () => void;
}

const VoiceButton = ({
  team,
  teamLetter,
  isListening,
  isDisabled,
  onPress,
}: VoiceButtonProps) => {
  const isTeamA = team === 'A';

  return (
    <div className="flex flex-col items-center gap-3">
      <p className={cn(
        'text-lg font-bold transition-opacity duration-300',
        isTeamA ? 'text-blue-600' : 'text-purple-600',
        isDisabled && 'opacity-50'
      )}>
        Team {team} - "{teamLetter}"
      </p>
      
      <Button
        // Changed to simple onClick for "one click is enough" requirement
        onClick={onPress}
        disabled={isDisabled}
        className={cn(
          'w-32 h-32 md:w-40 md:h-40 rounded-full transition-all duration-500 flex flex-col items-center justify-center gap-2 shadow-xl',
          isTeamA 
            ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
            : 'bg-gradient-to-br from-purple-500 to-purple-700',
          isListening && 'scale-110 ring-8 ring-yellow-400 animate-pulse',
          isDisabled && 'grayscale opacity-40 cursor-not-allowed border-none'
        )}
      >
        {isListening ? (
          <>
            <Volume2 className="w-12 h-12 md:w-16 md:h-16 animate-bounce" />
            <span className="text-sm font-bold">બોલો...</span>
          </>
        ) : isDisabled ? (
          <>
            <MicOff className="w-12 h-12 md:w-16 md:h-16" />
            <span className="text-sm font-bold">રાહ જુઓ</span>
          </>
        ) : (
          <>
            <Mic className="w-12 h-12 md:w-16 md:h-16" />
            <span className="text-sm font-bold">દબાવો</span>
          </>
        )}
      </Button>

      {isListening && (
        <p className="text-sm text-blue-500 font-medium animate-pulse">
          🎤 સાંભળી રહ્યું છે...
        </p>
      )}
    </div>
  );
};

export default VoiceButton;