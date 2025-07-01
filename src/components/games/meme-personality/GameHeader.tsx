
interface GameHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const GameHeader = ({ currentQuestion, totalQuestions }: GameHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
        🧠 What's Your Meme Energy?
      </h1>
      <p className="text-gray-300 mb-4">
        Discover your crypto meme personality through totally scientific scenarios
      </p>
      
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-400">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
    </div>
  );
};
