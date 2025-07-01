
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question, MemeChoice } from './types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (choice: MemeChoice) => void;
}

export const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  return (
    <>
      {/* Scenario Image */}
      <div className="mb-6">
        <img 
          src={question.scenarioImage} 
          alt="Scenario"
          className="w-full max-w-md mx-auto rounded-lg border-2 border-purple-500/30 object-cover"
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-center">
            {question.scenario}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {question.choices.map((choice) => (
              <Button
                key={choice.id}
                variant="outline"
                className="w-full h-auto p-6 text-left justify-start hover:bg-purple-900/20 hover:border-purple-500 flex items-center space-x-6"
                onClick={() => onAnswer(choice)}
              >
                {choice.memeImage && (
                  <img 
                    src={choice.memeImage} 
                    alt="Choice meme"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-600 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <span className="text-xl mr-3">{choice.text.split(' ')[0]}</span>
                  <span className="text-base">{choice.text.substring(choice.text.indexOf(' ') + 1)}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-400">
        Choose the option that best represents your meme energy! 🚀
      </div>
    </>
  );
};
