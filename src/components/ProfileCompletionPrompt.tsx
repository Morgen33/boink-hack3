
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { EyeOff, Eye, Sparkles, User, Heart, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionPromptProps {
  onDismiss?: () => void;
  completionPercentage?: number;
}

const ProfileCompletionPrompt = ({ onDismiss, completionPercentage = 0 }: ProfileCompletionPromptProps) => {
  const navigate = useNavigate();

  const handleFinishProfile = () => {
    navigate('/profile');
  };

  const getPromptConfig = () => {
    if (completionPercentage < 30) {
      return {
        icon: <EyeOff className="w-10 h-10 text-white" />,
        bgGradient: 'from-red-500 to-orange-500',
        title: '⚠️ YOU\'RE INVISIBLE!',
        subtitle: 'Complete Your Profile to Appear in Discovery',
        mainMessage: '🚫 Right now, you\'re completely invisible to other users!',
        description: 'No one can see you, match with you, or find you in Boink discovery until you add more basic information.',
        buttonText: 'Make Me Visible - Complete Profile Now!',
        buttonGradient: 'from-red-600 to-orange-600'
      };
    } else if (completionPercentage < 60) {
      return {
        icon: <AlertTriangle className="w-10 h-10 text-white" />,
        bgGradient: 'from-orange-500 to-yellow-500',
        title: '⚠️ LIMITED VISIBILITY',
        subtitle: 'Improve Your Profile for Better Matches',
        mainMessage: '📍 You have basic visibility but limited matching potential!',
        description: 'Adding more information will help you get better matches and appear more often in discovery.',
        buttonText: 'Improve My Profile for Better Matches!',
        buttonGradient: 'from-orange-600 to-yellow-600'
      };
    } else {
      return {
        icon: <Eye className="w-10 h-10 text-white" />,
        bgGradient: 'from-blue-500 to-purple-500',
        title: '👍 GOOD PROFILE!',
        subtitle: 'Polish a Few Details for Maximum Impact',
        mainMessage: '✨ You\'re visible with good matching potential!',
        description: 'Your profile is working well. Add a few more details to maximize your matching potential.',
        buttonText: 'Optimize My Profile!',
        buttonGradient: 'from-blue-600 to-purple-600'
      };
    }
  };

  const config = getPromptConfig();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-orange-500 shadow-2xl bg-orange-50 dark:bg-orange-950">
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${config.bgGradient} rounded-full flex items-center justify-center mb-4`}>
            {config.icon}
          </div>
          <CardTitle className="text-2xl text-orange-800 dark:text-orange-200 font-bold">
            {config.title}
          </CardTitle>
          <div className="text-lg text-orange-700 dark:text-orange-300 font-semibold mt-2">
            {config.subtitle}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg mb-4 border border-orange-300">
              <p className="text-orange-800 dark:text-orange-200 font-semibold text-lg mb-2">
                {config.mainMessage}
              </p>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                {config.description}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Profile Quality</span>
                <span className="font-bold text-orange-600">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-4" />
              <div className="text-xs text-muted-foreground">
                {completionPercentage < 30 
                  ? "Not visible in discovery" 
                  : completionPercentage < 60 
                    ? "Limited visibility" 
                    : "Good visibility - can be optimized"}
              </div>
            </div>

            {/* What happens when you improve */}
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-4 border border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span className="text-green-800 dark:text-green-200 font-semibold">
                  After improving your profile:
                </span>
              </div>
              <div className="space-y-2 text-left text-sm text-green-700 dark:text-green-300">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>✅ Better visibility in Boink discovery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 flex-shrink-0" />
                  <span>✅ Higher quality matches</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>✅ More daily match opportunities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleFinishProfile}
              className={`w-full bg-gradient-to-r ${config.buttonGradient} hover:opacity-90 text-white font-bold text-lg py-6`}
              size="lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              {config.buttonText}
            </Button>
            
            {onDismiss && (
              <Button 
                variant="outline" 
                onClick={onDismiss}
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Maybe Later
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletionPrompt;
