import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";

interface MailNotificationProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

const MailNotification = ({ variant = "desktop", className = "" }: MailNotificationProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allConversations, getUnreadCount } = useConversations(user);

  // Calculate total unread messages
  const totalUnreadCount = allConversations.reduce((total, conversation) => {
    return total + getUnreadCount(conversation);
  }, 0);

  const handleMailClick = () => {
    navigate('/messages');
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size={variant === "desktop" ? "sm" : "default"}
      className={`relative ${className}`}
      onClick={handleMailClick}
    >
      <Mail className={variant === "desktop" ? "h-5 w-5" : "h-6 w-6"} />
      {totalUnreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-gradient-to-r from-web3-red to-web3-magenta border-0 text-white min-w-5"
        >
          {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
        </Badge>
      )}
      {variant === "mobile" && (
        <span className="ml-2">Messages</span>
      )}
    </Button>
  );
};

export default MailNotification;