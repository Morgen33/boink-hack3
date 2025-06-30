
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';

const ProfileVisibilityAlert = () => {
  return (
    <Alert className="border-red-500 bg-red-50 dark:bg-red-950 mb-6 sticky top-0 z-10">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertDescription className="text-red-800 dark:text-red-200 font-semibold text-lg">
        <div className="flex items-center gap-2 mb-2">
          <EyeOff className="h-5 w-5" />
          <span className="text-xl">⚠️ YOU ARE CURRENTLY INVISIBLE IN DISCOVERY</span>
        </div>
        <div className="text-base">
          You must <strong>complete and submit your entire profile</strong> to appear in Boink discovery and match with other users. 
          Until then, you won't be seen by anyone!
        </div>
        <div className="flex items-center gap-2 mt-2 text-green-700 dark:text-green-300">
          <Eye className="h-4 w-4" />
          <span className="text-sm">Complete all steps → Submit → Become visible to matches</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileVisibilityAlert;
