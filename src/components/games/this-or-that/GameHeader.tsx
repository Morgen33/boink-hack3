
interface GameHeaderProps {
  currentRound: number;
  totalRounds: number;
  score?: number;
}

export const GameHeader = ({ currentRound, totalRounds, score }: GameHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-4">
        🔥 This or That Memes
      </h1>
      <p className="text-gray-300 mb-4">
        Choose your favorite meme and discover your meme compatibility with other degens
      </p>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentRound / totalRounds) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>Round {currentRound} of {totalRounds}</span>
        {score !== undefined && <span>Choices Made: {score}</span>}
      </div>
    </div>
  );
};
