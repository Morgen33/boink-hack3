
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IncompleteProfileWarningProps {
  showButton?: boolean;
  className?: string;
}

const IncompleteProfileWarning = ({ showButton = true, className = "" }: IncompleteProfileWarningProps) => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  return (
    <Alert className={`border-orange-500 bg-orange-50 dark:bg-orange-950 ${className}`}>
      <AlertTriangle className="h-6 w-6 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-200 text-xl font-bold flex items-center gap-2">
        <EyeOff className="h-5 w-5" />
        Profile Incomplete - You're Invisible! 👻
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300 mt-2">
        <div className="mb-3">
          <strong>You won't appear in discovery or receive matches</strong> until you complete your profile. 
          Other users can't see you right now!
        </div>
        <div className="text-sm mb-3">
          ✅ Complete all profile sections<br/>
          ✅ Submit your profile<br/>
          ✅ Start getting matches!
        </div>
        {showButton && (
          <Button 
            onClick={handleCompleteProfile}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
          >
            Complete My Profile Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default IncompleteProfileWarning;
