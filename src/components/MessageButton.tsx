import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MessageButtonProps {
  targetUserId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const MessageButton = ({ targetUserId, variant = 'outline', size = 'default', className }: MessageButtonProps) => {
  const { user } = useSimpleAuth();
  const { createConversation } = useConversations(user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleMessage = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.id === targetUserId) {
      toast({
        title: "Can't message yourself",
        description: "You can't send messages to your own profile!",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const conversationId = await createConversation(targetUserId);
      
      if (conversationId) {
        navigate('/messages');
        toast({
          title: "Ready to chat!",
          description: "Your conversation is ready. Start messaging!",
        });
      } else {
        toast({
          title: "Unable to start conversation",
          description: "You can only message people you've liked or who have liked you.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleMessage}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4 mr-2" />
      )}
      {loading ? 'Starting...' : 'Message'}
    </Button>
  );
};

export default MessageButton;