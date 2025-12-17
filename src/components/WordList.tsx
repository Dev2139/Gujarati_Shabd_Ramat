import { Word } from '@/types/game';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WordListProps {
  words: Word[];
  team: 'A' | 'B';
  title: string;
}

const WordList = ({ words, team, title }: WordListProps) => {
  const isTeamA = team === 'A';
  
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden shadow-lg',
        isTeamA ? 'bg-teamA-light border-2 border-teamA/30' : 'bg-teamB-light border-2 border-teamB/30'
      )}
    >
      <div
        className={cn(
          'p-3 text-center font-bold text-primary-foreground',
          isTeamA ? 'bg-teamA' : 'bg-teamB'
        )}
      >
        {title} ({words.length} શબ્દો)
      </div>
      
      <ScrollArea className="h-48 md:h-64">
        <div className="p-3 space-y-2">
          {words.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              હજુ કોઈ શબ્દ નથી
            </p>
          ) : (
            words.map((word, index) => (
              <div
                key={word.id}
                className={cn(
                  'flex items-center justify-between p-2 rounded-lg animate-slide-up bg-card/50',
                  word.isDuplicate && 'line-through opacity-60',
                  !word.isValid && !word.isDuplicate && 'opacity-60'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span
                  className={cn(
                    'text-lg font-medium',
                    word.isValid ? 'text-valid' : 'text-invalid'
                  )}
                >
                  {word.text}
                </span>
                {word.isValid ? (
                  <Check className="w-5 h-5 text-valid" />
                ) : (
                  <X className="w-5 h-5 text-invalid" />
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WordList;
