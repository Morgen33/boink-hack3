
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigationItems } from "@/constants/navigation";

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

  return (
    <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-sm">
      <nav className="flex flex-col space-y-4">
        {navigationItems.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavClick(item.href)}
            className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium px-4 py-3 text-left bg-transparent border-none cursor-pointer touch-manipulation"
          >
            {item.name}
          </button>
        ))}
        <div className="flex flex-col space-y-3 px-4 pt-4 border-t border-border">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-2 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start touch-manipulation"
                onClick={onProfileClick}
                size="lg"
              >
                <Settings className="mr-2 h-5 w-5" />
                Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start touch-manipulation"
                onClick={onSignOut}
                size="lg"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-accent touch-manipulation"
                onClick={onAuthClick}
                size="lg"
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90 text-white touch-manipulation"
                onClick={onAuthClick}
                size="lg"
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
