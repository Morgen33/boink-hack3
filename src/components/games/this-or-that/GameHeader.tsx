
interface GameHeaderProps {
  currentRound: number;
  totalRounds: number;
  score?: number;
}

export const GameHeader = ({ currentRound, totalRounds, score }: GameHeaderProps) => {
  const progressPercentage = (currentRound / totalRounds) * 100;
  
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-6">
        🔥 This or That Memes
      </h1>
      <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
        Choose your favorite meme and discover your meme compatibility with other degens
      </p>
      
      <div className="max-w-md mx-auto mb-6">
        <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 backdrop-blur-sm border border-gray-600/30">
          <div 
            className="bg-gradient-to-r from-pink-500 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-gray-400">
          <div className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-600/30">
            <span className="text-sm font-medium">Round {currentRound} of {totalRounds}</span>
          </div>
          {score !== undefined && (
            <div className="bg-purple-800/50 px-4 py-2 rounded-full border border-purple-500/30">
              <span className="text-sm font-medium text-purple-300">Choices: {score}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
