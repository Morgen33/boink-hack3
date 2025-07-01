
import { MemeMatchup } from './types';
import { MemeCard } from './MemeCard';

interface MatchupCardProps {
  matchup: MemeMatchup;
  onChoice: (chosenMemeId: string) => void;
}

export const MatchupCard = ({ matchup, onChoice }: MatchupCardProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Favorite!</h2>
        <p className="text-gray-400 text-lg">Click on the meme that speaks to your soul 🚀</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="order-1 lg:order-none">
          <MemeCard 
            meme={matchup.memeA}
            onSelect={() => onChoice(matchup.memeA.id)}
          />
        </div>
        
        <div className="order-3 lg:order-none text-center flex justify-center items-center">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xl font-bold py-2 px-4 rounded-full shadow-lg">
            VS
          </div>
        </div>
        
        <div className="order-2 lg:order-none">
          <MemeCard 
            meme={matchup.memeB}
            onSelect={() => onChoice(matchup.memeB.id)}
          />
        </div>
      </div>
      
      <div className="text-center mt-8">
        <div className="inline-block bg-purple-600/20 border border-purple-500/30 rounded-full px-6 py-2">
          <span className="text-purple-400 font-medium">Category: {matchup.category}</span>
        </div>
      </div>
    </div>
  );
};
