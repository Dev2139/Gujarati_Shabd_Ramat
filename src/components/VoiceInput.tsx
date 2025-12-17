import VoiceButton from './VoiceButton';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  teams: {
    A: { letter: string };
    B: { letter: string };
  };
  speakingTeam: 'A' | 'B' | null;
  onStartSpeaking: (team: 'A' | 'B') => void;
  onStopSpeaking: () => void;
  error?: string;
  lastRecognizedWord?: string;
  isSupported: boolean;
}

const VoiceInput = ({
  teams,
  speakingTeam,
  onStartSpeaking,
  onStopSpeaking,
  error,
  lastRecognizedWord,
  isSupported,
}: VoiceInputProps) => {
  if (!isSupported) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p className="font-bold">બ્રાઉઝર સપોર્ટ નથી</p>
        <p className="text-sm">કૃપા કરીને Chrome અથવા Edge બ્રાઉઝર વાપરો</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Message */}
      <div className="text-center">
        {speakingTeam ? (
          <p className={cn(
            'text-xl font-bold animate-pulse',
            speakingTeam === 'A' ? 'text-teamA' : 'text-teamB'
          )}>
            Team {speakingTeam} બોલી રહી છે... 🎤
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">
            તમારી ટીમનું બટન દબાવીને શબ્દ બોલો
          </p>
        )}
      </div>

      {/* Voice Buttons */}
      <div className="flex justify-center gap-8 md:gap-16">
        <VoiceButton
          team="A"
          teamLetter={teams.A.letter}
          isListening={speakingTeam === 'A'}
          isDisabled={speakingTeam !== null && speakingTeam !== 'A'}
          onPress={() => onStartSpeaking('A')}
          onRelease={onStopSpeaking}
        />
        <VoiceButton
          team="B"
          teamLetter={teams.B.letter}
          isListening={speakingTeam === 'B'}
          isDisabled={speakingTeam !== null && speakingTeam !== 'B'}
          onPress={() => onStartSpeaking('B')}
          onRelease={onStopSpeaking}
        />
      </div>

      {/* Last Recognized Word */}
      {lastRecognizedWord && (
        <div className="text-center animate-pop">
          <p className="text-sm text-muted-foreground mb-1">ઓળખાયેલ શબ્દ:</p>
          <p className="text-2xl font-bold text-foreground">"{lastRecognizedWord}"</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-center gap-2 text-invalid animate-slide-up bg-invalid/10 p-3 rounded-xl max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
