import { Button } from '@/components/ui/button';
import { Flag, Printer, ExternalLink, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  onEndGame: () => void;
  onPrint: () => void;
  onRestart: () => void;
  isGameEnded: boolean;
  isProcessing?: boolean; // New: prevents clicking during speech
}

const GameControls = ({ 
  onEndGame, 
  onPrint, 
  onRestart, 
  isGameEnded, 
  isProcessing 
}: GameControlsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {!isGameEnded ? (
        <Button
          onClick={onEndGame}
          disabled={isProcessing}
          variant="destructive"
          size="lg"
          className="text-lg font-bold px-8 h-12 shadow-md transition-all active:scale-95"
        >
          <Flag className="w-5 h-5 mr-2" />
          રમત પૂરી કરો (End Game)
        </Button>
      ) : (
        <Button
          onClick={onRestart}
          size="lg"
          className="text-lg font-bold px-8 h-12 bg-green-600 hover:bg-green-700 text-white shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          નવી રમત (Restart)
        </Button>
      )}

      <Button
        onClick={onPrint}
        variant="outline"
        size="lg"
        className="text-lg font-bold px-8 h-12 border-2 hover:bg-slate-100 transition-all active:scale-95"
      >
        <Printer className="w-5 h-5 mr-2" />
        પ્રિન્ટ (Print)
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="text-lg font-bold px-8 h-12 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
      >
        <a
          href="https://shabda-antakshari.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          શબ્દ અંતાક્ષરી
        </a>
      </Button>
    </div>
  );
};

export default GameControls;