
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigationItems } from "@/constants/navigation";
import MailNotification from "./MailNotification";

interface MobileMenuProps {
  isOpen: boolean;
  user: SupabaseUser | null;
  onNavClick: (href: string) => void;
  onAuthClick: () => void;
  onProfileClick: () => void;
  onSignOut: () => void;
}

const MobileMenu = ({ isOpen, user, onNavClick, onAuthClick, onProfileClick, onSignOut }: MobileMenuProps) => {
  if (!isOpen) return null;

  const authRequiredItems = ['Daily Matches', 'My Matches', 'Discover'];
  
  const filteredItems = navigationItems.filter(item => {
    if (authRequiredItems.includes(item.name)) {
      return user !== null;
    }
    return true;
  });

  return (
    <div className="md:hidden py-4 border-t border-border bg-background">
      <nav className="flex flex-col space-y-4">
        {filteredItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavClick(item.href)}
            className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium px-4 py-2 text-left bg-transparent border-none cursor-pointer"
          >
            {item.name}
          </button>
        ))}
        <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-border">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-2 py-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                </div>
              </div>
              <MailNotification variant="mobile" className="w-full justify-start" />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onProfileClick}
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-accent"
                onClick={onAuthClick}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90 text-white"
                onClick={onAuthClick}
              >
                Join Free
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
