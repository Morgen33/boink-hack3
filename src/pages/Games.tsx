
import { useState } from "react";
import Header from "@/components/Header";
import DrunkOnAlpha from "@/components/games/DrunkOnAlpha";
import MemePersonalityGame from "@/components/games/MemePersonalityGame";
import GameCard from "@/components/games/GameCard";

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: "drunk-on-alpha",
      title: "🧠💥 Drunk on Alpha",
      tagline: "Too much alpha... not enough water.",
      description: "Match crypto tweets to price charts before you blackout! Test your degen knowledge in this arcade-style game.",
      status: "Available",
      difficulty: "Medium",
      players: "1,337 degens playing"
    },
    {
      id: "meme-personality",
      title: "🎭 What's Your Meme Energy?",
      tagline: "Discover your crypto meme personality!",
      description: "Take our totally scientific quiz to find out if you're an Apex Degen, Meme Lord, or Diamond Sage. Perfect for dating profiles!",
      status: "Available",
      difficulty: "Easy",
      players: "2,420 personalities discovered"
    },
    {
      id: "rug-runner",
      title: "🏃‍♂️ Rug Runner",
      tagline: "Coming Soon",
      description: "Dodge rugs and collect gems in this endless runner. Don't get rekt!",
      status: "Coming Soon",
      difficulty: "Hard",
      players: "Soon™"
    },
    {
      id: "yield-farm-fever",
      title: "🌾 Yield Farm Fever",
      tagline: "Coming Soon",
      description: "Build the ultimate DeFi portfolio while managing gas fees and impermanent loss.",
      status: "Coming Soon",
      difficulty: "Expert",
      players: "Soon™"
    }
  ];

  if (selectedGame === "drunk-on-alpha") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Header />
        <DrunkOnAlpha onBack={() => setSelectedGame(null)} />
      </div>
    );
  }

  if (selectedGame === "meme-personality") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Header />
        <MemePersonalityGame onBack={() => setSelectedGame(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            🎮 DEGEN ARCADE
          </h1>
          <p className="text-xl text-gray-300 mb-8 font-mono">
            Test your crypto knowledge • Win badges • Stay based
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm font-mono text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>2,420 Active Players</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>69,420 Games Played</span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={() => setSelectedGame(game.id)}
            />
          ))}
        </div>

        {/* Leaderboard Teaser */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4 font-mono text-purple-400">
              🏆 SOBEREST DEGENS LEADERBOARD
            </h2>
            <div className="space-y-2 font-mono text-sm">
              {[
                { rank: 1, name: "StonkDaddy69", score: "1,337", badge: "🧠" },
                { rank: 2, name: "YieldYolo", score: "1,234", badge: "💎" },
                { rank: 3, name: "RuggedRabbit", score: "999", badge: "🚀" },
                { rank: 4, name: "DegenWizard", score: "888", badge: "🎯" },
                { rank: 5, name: "AlphaHunter", score: "777", badge: "⚡" }
              ].map((player) => (
                <div key={player.rank} className="flex justify-between items-center p-2 bg-purple-900/20 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-400">#{player.rank}</span>
                    <span className="text-white">{player.name}</span>
                    <span>{player.badge}</span>
                  </div>
                  <span className="text-green-400">{player.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
