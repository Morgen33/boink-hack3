
import { Loader2, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import ProfileCompletionSuccess from './ProfileCompletionSuccess';

interface ProfileCompletionProps {
  isNewUser: boolean;
}

const ProfileCompletion = ({ isNewUser }: ProfileCompletionProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md p-8">
          <ProfileCompletionSuccess />
          
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-4">
            {isNewUser ? "Welcome to Boink! 🎉" : "Profile Updated! 🎉"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isNewUser 
              ? "Your degen profile is now live and ready to attract fellow crypto enthusiasts! You're now visible in discovery and will start receiving matches!"
              : "Your profile has been updated successfully! You're visible in discovery and ready for matches!"
            }
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Taking you to Discover...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
