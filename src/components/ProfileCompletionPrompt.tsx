
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Sparkles, User, Heart, EyeOff, Eye } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-red-500 shadow-2xl bg-red-50 dark:bg-red-950">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <EyeOff className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-red-800 dark:text-red-200 font-bold">
            ⚠️ YOU'RE INVISIBLE!
          </CardTitle>
          <div className="text-lg text-red-700 dark:text-red-300 font-semibold mt-2">
            Complete Your Profile to Appear in Discovery
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4 border border-red-300">
              <p className="text-red-800 dark:text-red-200 font-semibold text-lg mb-2">
                🚫 Right now, you're completely invisible to other users!
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                No one can see you, match with you, or find you in Boink discovery until you finish your profile.
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Profile Completion</span>
                <span className="font-bold text-red-600">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-4" />
              <div className="text-xs text-muted-foreground">
                {completionPercentage < 100 ? "Not visible in discovery" : "Ready to go live!"}
              </div>
            </div>

            {/* What happens when you complete */}
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-4 border border-green-300">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span className="text-green-800 dark:text-green-200 font-semibold">
                  After completing your profile:
                </span>
              </div>
              <div className="space-y-2 text-left text-sm text-green-700 dark:text-green-300">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span>✅ You'll appear in Boink discovery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 flex-shrink-0" />
                  <span>✅ Other users can see and match with you</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>✅ You'll start receiving daily matches</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleFinishProfile}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 text-white font-bold text-lg py-6"
              size="lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              Make Me Visible - Complete Profile Now!
            </Button>
            
            {onDismiss && (
              <Button 
                variant="outline" 
                onClick={onDismiss}
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
              >
                Stay Invisible for Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletionPrompt;
