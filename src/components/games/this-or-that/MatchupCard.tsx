
import { MemeMatchup } from './types';
import { MemeCard } from './MemeCard';

interface MatchupCardProps {
  matchup: MemeMatchup;
  onChoice: (chosenMemeId: string) => void;
}

export const MatchupCard = ({ matchup, onChoice }: MatchupCardProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Favorite!</h2>
        <p className="text-gray-400">Click on the meme that speaks to your soul 🚀</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <MemeCard 
          meme={matchup.memeA}
          onSelect={() => onChoice(matchup.memeA.id)}
        />
        
        <div className="text-center text-2xl font-bold text-gray-500">
          VS
        </div>
        
        <MemeCard 
          meme={matchup.memeB}
          onSelect={() => onChoice(matchup.memeB.id)}
        />
      </div>
      
      <div className="text-center mt-6 text-sm text-gray-500">
        Category: {matchup.category}
      </div>
    </div>
  );
};
