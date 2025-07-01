
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Link2, RefreshCw } from 'lucide-react';
import { PersonalityType } from './types';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  result: PersonalityType;
  onRetake: () => void;
}

export const ShareButtons = ({ result, onRetake }: ShareButtonsProps) => {
  const { toast } = useToast();

  const shareToTwitter = () => {
    const text = `I just discovered my crypto meme personality: ${result.name} ${result.emoji}! ${result.description} What's your meme energy? 🚀`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const text = `I just discovered my crypto meme personality: ${result.name} ${result.emoji}! ${result.description}`;
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied! 🔗",
      description: "Share your meme personality with the world!",
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Button onClick={shareToTwitter} className="bg-blue-500 hover:bg-blue-600">
        <Twitter className="w-4 h-4 mr-2" />
        Share on X
      </Button>
      <Button onClick={shareToFacebook} className="bg-blue-700 hover:bg-blue-800">
        <Facebook className="w-4 h-4 mr-2" />
        Share on Facebook
      </Button>
      <Button onClick={shareToLinkedIn} className="bg-blue-600 hover:bg-blue-700">
        <Linkedin className="w-4 h-4 mr-2" />
        Share on LinkedIn
      </Button>
      <Button onClick={copyLink} variant="outline">
        <Link2 className="w-4 h-4 mr-2" />
        Copy Link
      </Button>
      <Button onClick={onRetake} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Retake Quiz
      </Button>
    </div>
  );
};
