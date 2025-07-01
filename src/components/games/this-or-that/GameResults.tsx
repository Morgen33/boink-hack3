
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserChoice, GameStats } from './types';
import { memeOptions } from './data';

interface GameResultsProps {
  choices: UserChoice[];
  stats: GameStats;
  onPlayAgain: () => void;
  onBack: () => void;
}

export const GameResults = ({ choices, stats, onPlayAgain, onBack }: GameResultsProps) => {
  // Calculate favorite memes and categories
  const chosenMemes = choices.map(choice => 
    memeOptions.find(meme => meme.id === choice.chosenMemeId)
  ).filter(Boolean);

  const categoryCount = chosenMemes.reduce((acc, meme) => {
    if (meme?.category) {
      acc[meme.category] = (acc[meme.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Mixed';

  const tagCount = chosenMemes.reduce((acc, meme) => {
    meme?.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-4">
          🎯 Your Meme Taste Profile
        </h1>
        <p className="text-lg text-gray-300">
          Based on your {choices.length} choices, here's your meme personality
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-black/50 backdrop-blur-sm border-2 border-gray-600/50">
          <CardHeader>
            <CardTitle className="text-pink-400">Your Meme Vibe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-2">
              {topCategory === 'Trading' && '📈'}
              {topCategory === 'Bullish' && '🚀'}
              {topCategory === 'Community' && '🦍'}
              {topCategory === 'Meme Coins' && '🐕'}
              {topCategory === 'Bearish' && '📉'}
              {topCategory === 'Lifestyle' && '🏎️'}
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{topCategory} Enthusiast</h3>
            <p className="text-gray-300 text-sm">
              You're drawn to {topCategory.toLowerCase()} memes - this says a lot about your crypto personality!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 backdrop-blur-sm border-2 border-gray-600/50">
          <CardHeader>
            <CardTitle className="text-orange-400">Your Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2 bg-purple-600/50 text-white border-purple-500/30">
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="text-gray-300 text-sm mt-4">
              These are your most chosen meme themes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8 bg-black/50 backdrop-blur-sm border-2 border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-cyan-400">🎮 Ready to Find Your Meme Match?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Your choices have been saved! Soon you'll be able to find other degens who share your meme taste.
          </p>
          <div className="text-sm text-gray-300">
            <p>• Compatibility matching coming soon</p>
            <p>• Compare your taste with friends</p>
            <p>• Discover new meme communities</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button onClick={onPlayAgain} className="bg-pink-600 hover:bg-pink-700">
          Play Again 🔄
        </Button>
        <Button onClick={onBack} variant="outline">
          Back to Games
        </Button>
      </div>
    </div>
  );
};
