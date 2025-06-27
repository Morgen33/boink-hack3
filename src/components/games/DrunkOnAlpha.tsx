
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Tweet {
  id: string;
  author: string;
  content: string;
  avatar: string;
}

interface Chart {
  id: string;
  pattern: string;
  color: string;
  description: string;
}

interface GameState {
  sobrietyPoints: number;
  drunkMeter: number;
  score: number;
  streak: number;
  level: number;
  gameOver: boolean;
  won: boolean;
}

interface DrunkOnAlphaProps {
  onBack: () => void;
}

const DrunkOnAlpha = ({ onBack }: DrunkOnAlphaProps) => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    sobrietyPoints: 3,
    drunkMeter: 0,
    score: 0,
    streak: 0,
    level: 1,
    gameOver: false,
    won: false
  });
  
  const [currentTweets, setCurrentTweets] = useState<Tweet[]>([]);
  const [currentCharts, setCurrentCharts] = useState<Chart[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<{[key: string]: string}>({});
  const [gameStarted, setGameStarted] = useState(false);

  const tweets: Tweet[] = [
    {
      id: "1",
      author: "@YieldYolo",
      content: "Just aped my entire bag into $BONK at 3am. Either Lambo or food stamps. No in between. 🚀💎",
      avatar: "🦍"
    },
    {
      id: "2",
      author: "@RuggedRabbit",
      content: "PSA: If your shitcoin has 'Safe' in the name, it's about to get rugged harder than my grandmother's carpet.",
      avatar: "🐰"
    },
    {
      id: "3",
      author: "@StonkDaddy69",
      content: "BREAKING: Vitalik just tweeted a picture of his breakfast. $ETH to $10k confirmed. Trust me bro.",
      avatar: "👨‍💼"
    },
    {
      id: "4",
      author: "@DegenWizard",
      content: "Technical analysis says we're forming a double rainbow unicorn pattern. 100x incoming. Source: voices in my head.",
      avatar: "🧙‍♂️"
    },
    {
      id: "5",
      author: "@AlphaHunter",
      content: "Sold my kidney to buy more $PEPE. Don't need two anyway. Diamond hands forever! 💎🙌",
      avatar: "🎯"
    }
  ];

  const charts: Chart[] = [
    {
      id: "chart1",
      pattern: "📈📈📈🚀",
      color: "text-green-400",
      description: "Moon Mission"
    },
    {
      id: "chart2",
      pattern: "📉📉💀⚰️",
      color: "text-red-400",
      description: "Rug Pull"
    },
    {
      id: "chart3",
      pattern: "📈📉📈📉",
      color: "text-yellow-400",
      description: "Crab Market"
    }
  ];

  const correctMatches: {[key: string]: string} = {
    "1": "chart1", // YieldYolo ape -> Moon
    "2": "chart2", // RuggedRabbit -> Rug Pull
    "3": "chart1", // StonkDaddy -> Moon
    "4": "chart3", // DegenWizard -> Crab
    "5": "chart1"  // AlphaHunter -> Moon
  };

  const startNewRound = () => {
    const shuffledTweets = [...tweets].sort(() => Math.random() - 0.5).slice(0, 3);
    const shuffledCharts = [...charts].sort(() => Math.random() - 0.5).slice(0, 2);
    
    setCurrentTweets(shuffledTweets);
    setCurrentCharts(shuffledCharts);
    setSelectedMatches({});
  };

  const handleMatch = (tweetId: string, chartId: string) => {
    setSelectedMatches(prev => ({
      ...prev,
      [tweetId]: chartId
    }));
  };

  const submitAnswers = () => {
    let correctCount = 0;
    let totalAnswered = 0;

    currentTweets.forEach(tweet => {
      if (selectedMatches[tweet.id]) {
        totalAnswered++;
        if (correctMatches[tweet.id] === selectedMatches[tweet.id]) {
          correctCount++;
        }
      }
    });

    if (totalAnswered === 0) {
      toast({
        title: "Bruh...",
        description: "You need to match at least one tweet to a chart!",
        variant: "destructive"
      });
      return;
    }

    const wrongCount = totalAnswered - correctCount;
    const newDrunkMeter = Math.min(100, gameState.drunkMeter + (wrongCount * 25));
    const newScore = gameState.score + (correctCount * 100 * gameState.level);
    const newStreak = correctCount === totalAnswered ? gameState.streak + 1 : 0;

    if (newDrunkMeter >= 100) {
      // Game Over - Blackout
      setGameState(prev => ({
        ...prev,
        drunkMeter: 100,
        score: newScore,
        streak: newStreak,
        gameOver: true,
        won: false
      }));
      
      toast({
        title: "🍺 BLACKOUT! 🍺",
        description: "You aped too hard, champ. Final score: " + newScore,
        variant: "destructive"
      });
    } else {
      // Continue game
      setGameState(prev => ({
        ...prev,
        drunkMeter: newDrunkMeter,
        score: newScore,
        streak: newStreak,
        level: Math.floor(newStreak / 3) + 1
      }));

      if (correctCount > 0) {
        toast({
          title: "🎯 Nice Alpha!",
          description: `+${correctCount * 100 * gameState.level} points! Streak: ${newStreak}`,
        });
      }

      if (wrongCount > 0) {
        toast({
          title: "🍺 Wrong, degen!",
          description: `Drunk meter +${wrongCount * 25}%. Stay focused!`,
          variant: "destructive"
        });
      }

      // Start new round after delay
      setTimeout(() => {
        startNewRound();
      }, 2000);
    }
  };

  const resetGame = () => {
    setGameState({
      sobrietyPoints: 3,
      drunkMeter: 0,
      score: 0,
      streak: 0,
      level: 1,
      gameOver: false,
      won: false
    });
    setGameStarted(false);
    setSelectedMatches({});
  };

  const startGame = () => {
    setGameStarted(true);
    startNewRound();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <Button
            onClick={onBack}
            variant="ghost"
            className="absolute top-24 left-4 text-white hover:text-purple-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/50 rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-4 font-mono bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              🧠💥 DRUNK ON ALPHA
            </h1>
            <p className="text-purple-400 text-lg mb-6 font-mono italic">
              "Too much alpha... not enough water."
            </p>
            
            <div className="text-left space-y-4 text-gray-300 mb-8">
              <h3 className="text-xl font-bold text-white font-mono">How to Play:</h3>
              <ul className="space-y-2 font-mono text-sm">
                <li>• Match crypto tweets to the charts they likely caused</li>
                <li>• Correct matches = points & sobriety</li>
                <li>• Wrong matches = drunk meter goes up</li>
                <li>• Reach 100% drunk = BLACKOUT (game over)</li>
                <li>• Survive as long as possible & climb the leaderboard!</li>
              </ul>
            </div>
            
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono font-bold text-lg px-8 py-3"
            >
              🎮 START GAME
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-black/80 backdrop-blur-sm border border-red-500/50 rounded-lg p-8">
            <h1 className="text-4xl font-bold mb-4 font-mono text-red-400">
              🍺 BLACKOUT! 🍺
            </h1>
            <p className="text-xl mb-6 font-mono text-gray-300">
              You aped too hard, champ.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="text-2xl font-mono text-white">
                Final Score: <span className="text-green-400">{gameState.score.toLocaleString()}</span>
              </div>
              <div className="text-lg font-mono text-purple-400">
                Best Streak: <span className="text-yellow-400">{gameState.streak}</span>
              </div>
              <div className="text-lg font-mono text-blue-400">
                Level Reached: <span className="text-cyan-400">{gameState.level}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-mono font-bold px-6 py-2 mr-4"
              >
                🔄 APE AGAIN
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20 font-mono font-bold px-6 py-2"
              >
                🏠 BACK TO ARCADE
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-white hover:text-purple-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 font-mono">{gameState.score.toLocaleString()}</div>
            <div className="text-sm text-gray-400 font-mono">SCORE</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 font-mono">{gameState.streak}</div>
            <div className="text-sm text-gray-400 font-mono">STREAK</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 font-mono">{gameState.level}</div>
            <div className="text-sm text-gray-400 font-mono">LEVEL</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
            <div className="text-sm text-gray-400 font-mono mb-2">DRUNK METER</div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${gameState.drunkMeter}%` }}
              ></div>
            </div>
            <div className="text-center text-lg font-mono text-red-400">{gameState.drunkMeter}% 🍺</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tweets Section */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 font-mono">📱 DEGEN TWEETS</h2>
            <div className="space-y-4">
              {currentTweets.map((tweet) => (
                <div key={tweet.id} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{tweet.avatar}</span>
                    <span className="font-mono text-blue-400">{tweet.author}</span>
                  </div>
                  <p className="text-gray-300 text-sm font-mono leading-relaxed">{tweet.content}</p>
                  
                  <div className="mt-3">
                    <select
                      value={selectedMatches[tweet.id] || ""}
                      onChange={(e) => handleMatch(tweet.id, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                    >
                      <option value="">Select a chart...</option>
                      {currentCharts.map((chart) => (
                        <option key={chart.id} value={chart.id}>
                          {chart.pattern} - {chart.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 font-mono">📊 PRICE CHARTS</h2>
            <div className="space-y-4">
              {currentCharts.map((chart) => (
                <div key={chart.id} className="bg-gray-900/50 border border-gray-600 rounded-lg p-6 text-center">
                  <div className={`text-4xl mb-2 ${chart.color} font-mono`}>
                    {chart.pattern}
                  </div>
                  <div className="text-lg font-mono text-white">{chart.description}</div>
                  <div className="text-sm text-gray-400 font-mono mt-2">Chart ID: {chart.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <Button
            onClick={submitAnswers}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono font-bold text-lg px-8 py-3"
          >
            📊 SUBMIT MATCHES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrunkOnAlpha;
