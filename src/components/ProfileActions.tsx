
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface ProfileActionsProps {
  onLike: () => void;
  onPass: () => void;
}

const ProfileActions = ({ onLike, onPass }: ProfileActionsProps) => {
  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPass();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike();
  };

  return (
    <div className="flex justify-center gap-4 mt-8">
      <Button
        onClick={handlePass}
        variant="outline"
        size="lg"
        className="rounded-full w-16 h-16 border-2 hover:bg-red-50 hover:border-red-200"
      >
        <X className="w-6 h-6 text-red-500" />
      </Button>
      <Button
        onClick={handleLike}
        size="lg"
        className="rounded-full w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
      >
        <Heart className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};

export default ProfileActions;
