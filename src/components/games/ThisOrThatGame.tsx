
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { memeMatchups } from './this-or-that/data';
import { UserChoice, GameStats } from './this-or-that/types';
import { GameHeader } from './this-or-that/GameHeader';
import { MatchupCard } from './this-or-that/MatchupCard';
import { GameResults } from './this-or-that/GameResults';

interface ThisOrThatGameProps {
  onBack: () => void;
}

const ThisOrThatGame = ({ onBack }: ThisOrThatGameProps) => {
  const [currentMatchupIndex, setCurrentMatchupIndex] = useState(0);
  const [choices, setChoices] = useState<UserChoice[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const totalRounds = 10; // Limit to 10 rounds for better UX

  const handleChoice = (chosenMemeId: string) => {
    const currentMatchup = memeMatchups[currentMatchupIndex];
    
    const newChoice: UserChoice = {
      matchupId: currentMatchup.id,
      chosenMemeId,
      timestamp: new Date()
    };

    const newChoices = [...choices, newChoice];
    setChoices(newChoices);

    // Move to next matchup or complete game
    if (currentMatchupIndex < totalRounds - 1) {
      setTimeout(() => {
        setCurrentMatchupIndex(currentMatchupIndex + 1);
      }, 500); // Small delay for better UX
    } else {
      setTimeout(() => {
        setGameComplete(true);
      }, 500);
    }
  };

  const resetGame = () => {
    setCurrentMatchupIndex(0);
    setChoices([]);
    setGameComplete(false);
  };

  if (gameComplete) {
    const stats: GameStats = {
      totalChoices: choices.length,
      favoriteCategories: []
    };

    return (
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute left-4 top-4 md:left-8 md:top-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        
        <GameResults 
          choices={choices}
          stats={stats}
          onPlayAgain={resetGame}
          onBack={onBack}
        />
      </div>
    );
  }

  const currentMatchup = memeMatchups[currentMatchupIndex];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>
      
      <GameHeader 
        currentRound={currentMatchupIndex + 1}
        totalRounds={totalRounds}
        score={choices.length}
      />
      
      <MatchupCard 
        matchup={currentMatchup}
        onChoice={handleChoice}
      />
    </div>
  );
};

export default ThisOrThatGame;
