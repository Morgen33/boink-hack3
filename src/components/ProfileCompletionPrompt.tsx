
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Sparkles, User, Heart } from 'lucide-react';
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
      <Card className="max-w-md w-full border-2 border-web3-red/30 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Your crypto dating journey is almost ready! Complete your profile to start matching with fellow degens.
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span className="font-semibold">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>

            {/* Benefits */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-web3-cyan flex-shrink-0" />
                <span className="text-sm">Show your crypto personality</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-web3-red flex-shrink-0" />
                <span className="text-sm">Get better matches</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-web3-magenta flex-shrink-0" />
                <span className="text-sm">Access exclusive features</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleFinishProfile}
              className="w-full bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Finish My Profile
            </Button>
            
            {onDismiss && (
              <Button 
                variant="outline" 
                onClick={onDismiss}
                className="w-full"
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
