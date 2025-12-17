import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, PartyPopper, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WinnerAnnouncementProps {
  winner: 'A' | 'B' | 'tie';
  scoreA: number;
  scoreB: number;
}

const WinnerAnnouncement = ({ winner, scoreA, scoreB }: WinnerAnnouncementProps) => {
  useEffect(() => {
    // Fire confetti logic
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = winner === 'A' 
      ? ['#3b82f6', '#60a5fa', '#fbbf24'] 
      : winner === 'B'
        ? ['#a855f7', '#c084fc', '#fbbf24']
        : ['#fbbf24', '#f59e0b', '#eab308'];

    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, [winner]);

  // Function to go home and reload everything
  const handleGoHome = () => {
    window.location.href = '/'; // Navigates to root and reloads the page
  };

  const getMessage = () => {
    if (winner === 'tie') return 'રમત ટાઈ! 🤝';
    return `Team ${winner} જીત્યું! 🎉`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          'bg-white rounded-3xl p-8 md:p-12 text-center shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300',
          winner === 'A' && 'border-t-8 border-blue-500',
          winner === 'B' && 'border-t-8 border-purple-500',
          winner === 'tie' && 'border-t-8 border-yellow-500'
        )}
      >
        <div className="flex justify-center mb-4">
          {winner === 'tie' ? (
            <PartyPopper className="w-20 h-20 text-yellow-500 animate-bounce" />
          ) : (
            <Trophy className="w-20 h-20 text-yellow-500 animate-bounce" />
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
          {getMessage()}
        </h2>

        {/* Score Display */}
        <div className="flex justify-center items-center gap-8 mb-8 bg-slate-50 p-6 rounded-2xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Team A</p>
            <p className={cn('text-4xl font-black', winner === 'A' ? 'text-blue-600' : 'text-slate-400')}>
              {scoreA}
            </p>
          </div>
          <div className="text-2xl text-slate-300 font-bold">vs</div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Team B</p>
            <p className={cn('text-4xl font-black', winner === 'B' ? 'text-purple-600' : 'text-slate-400')}>
              {scoreB}
            </p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        {/* HOME PAGE BUTTON */}
        <Button
          onClick={handleGoHome}
          size="lg"
          className="w-full h-14 text-xl font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform transition active:scale-95"
        >
          <Home className="w-6 h-6 mr-3" />
          હોમ પેજ (Home Page)
        </Button>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;