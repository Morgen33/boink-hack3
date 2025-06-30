
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Eye, Sparkles } from 'lucide-react';

const ProfileCompletionSuccess = () => {
  return (
    <Alert className="border-green-500 bg-green-50 dark:bg-green-950 mb-6">
      <CheckCircle className="h-6 w-6 text-green-600" />
      <AlertTitle className="text-green-800 dark:text-green-200 text-xl font-bold flex items-center gap-2">
        <Eye className="h-5 w-5" />
        🎉 You're Now Visible in Discovery!
      </AlertTitle>
      <AlertDescription className="text-green-700 dark:text-green-300 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4" />
          <strong>Congratulations!</strong> Your profile is complete and live.
        </div>
        <div className="text-sm">
          ✅ You now appear in Boink discovery<br/>
          ✅ Other users can see and match with you<br/>
          ✅ You'll start receiving daily matches<br/>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileCompletionSuccess;
