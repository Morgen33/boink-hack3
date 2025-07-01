
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { questions } from './meme-personality/data';
import { MemeChoice } from './meme-personality/types';
import { calculatePersonalityResult } from './meme-personality/gameLogic';
import { PersonalityResults } from './meme-personality/PersonalityResults';
import { QuestionCard } from './meme-personality/QuestionCard';
import { GameHeader } from './meme-personality/GameHeader';

interface MemePersonalityGameProps {
  onBack: () => void;
}

const MemePersonalityGame = ({ onBack }: MemePersonalityGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (choice: MemeChoice) => {
    const newAnswers = [...answers, choice.personality];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const resultType = calculatePersonalityResult(newAnswers);
      setResult(resultType);
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setGameComplete(false);
    setResult(null);
  };

  if (gameComplete && result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute left-4 top-4 md:left-8 md:top-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        
        <PersonalityResults result={result} onRetake={resetGame} />
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>
      
      <GameHeader currentQuestion={currentQuestion} totalQuestions={questions.length} />
      <QuestionCard question={question} onAnswer={handleAnswer} />
    </div>
  );
};

export default MemePersonalityGame;
