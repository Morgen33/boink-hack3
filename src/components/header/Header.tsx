
import { Menu, X, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";
import MailNotification from "./MailNotification";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      console.log('🚪 Signing out user');
      await signOut();
      // The AuthContext's signOut will handle the redirect
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect anyway
      navigate('/auth');
    }
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      // If we're already on the homepage, scroll to the section
      if (location.pathname === '/') {
        const element = document.querySelector(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to homepage with hash
        navigate(href);
      }
    } else {
      // Regular navigation
      navigate(href);
    }
    setIsMenuOpen(false);
  };

  const handleAuthNavigation = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const handleHelpClick = () => {
    if ((window as any).showIntercom) {
      (window as any).showIntercom();
    } else {
      console.log('Intercom not yet loaded');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          <Navigation onNavClick={handleNavigation} />

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleHelpClick}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Help & Support"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <ThemeToggle />
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-border border-t-web3-red"></div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <MailNotification variant="desktop" />
                <UserMenu user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          user={user}
          onNavClick={handleNavigation}
          onAuthClick={handleAuthNavigation}
          onProfileClick={handleProfileNavigation}
          onSignOut={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;
