
import { Button } from "@/components/ui/button";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    status: string;
    difficulty: string;
    players: string;
  };
  onPlay: () => void;
}

const GameCard = ({ game, onPlay }: GameCardProps) => {
  const isAvailable = game.status === "Available";

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2 font-mono">{game.title}</h3>
        <p className="text-purple-400 text-sm font-mono italic">{game.tagline}</p>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {game.description}
      </p>
      
      <div className="space-y-2 mb-4 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={isAvailable ? "text-green-400" : "text-yellow-400"}>
            {game.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Difficulty:</span>
          <span className="text-red-400">{game.difficulty}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Players:</span>
          <span className="text-blue-400">{game.players}</span>
        </div>
      </div>
      
      <Button
        onClick={onPlay}
        disabled={!isAvailable}
        className={`w-full font-mono font-bold ${
          isAvailable
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isAvailable ? "🎮 PLAY NOW" : "⏳ SOON™"}
      </Button>
    </div>
  );
};

export default GameCard;
