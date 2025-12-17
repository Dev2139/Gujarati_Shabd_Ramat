import { Team } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy, Mic } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  isActive: boolean;
  isWinner?: boolean;
  isSpeaking?: boolean;
}

const TeamCard = ({ team, isActive, isWinner, isSpeaking }: TeamCardProps) => {
  const isTeamA = team.id === 'A';
  
  return (
    <div
      className={cn(
        'relative rounded-2xl p-4 md:p-6 transition-all duration-500 overflow-hidden',
        isTeamA ? 'team-a-gradient' : 'team-b-gradient',
        isSpeaking && 'ring-4 ring-gold animate-pulse-glow scale-105',
        isWinner && 'ring-4 ring-gold'
      )}
    >
      {/* Winner Badge */}
      {isWinner && (
        <div className="absolute top-2 right-2 animate-bounce-soft">
          <Trophy className="w-8 h-8 text-gold drop-shadow-lg" />
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute top-2 left-2">
          <Mic className="w-6 h-6 text-gold animate-pulse" />
        </div>
      )}

      <div className="text-center text-primary-foreground">
        <h2 className="text-xl md:text-2xl font-bold mb-1">
          Team {team.id}
        </h2>
        <div className="bg-card/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-block mb-3">
          <span className="text-lg">અક્ષર: </span>
          <span className="text-3xl md:text-4xl font-bold">{team.letter}</span>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-3">
          <p className="text-sm opacity-80">સ્કોર</p>
          <p className="text-4xl md:text-5xl font-bold animate-pop">{team.score}</p>
        </div>

        {isSpeaking && (
          <p className="mt-3 text-sm bg-gold/20 rounded-full px-3 py-1 inline-block animate-bounce-soft">
            બોલી રહ્યા છો... 🎤
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
