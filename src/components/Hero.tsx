
import { Button } from "@/components/ui/button";
import { ParticleTextEffect } from "@/components/ui/interactive-text-particle";
import { Shield, Heart, Users, Sparkles, Coins, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileData } from "@/hooks/useProfileData";

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfileData();

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleMainCTA = () => {
    if (authLoading || profileLoading) return;
    
    if (!user) {
      navigate('/auth');
    } else if (profile?.profile_completed) {
      navigate('/daily-matches');
    } else {
      navigate('/profile');
    }
  };

  const getMainCTAText = () => {
    if (authLoading || profileLoading) return "Loading...";
    
    if (!user) return "Let's Go! 🚀";
    if (profile?.profile_completed) return "Show My Matches! 💕";
    return "Complete Profile! ✨";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-background text-foreground">
      {/* Day/Night Toggle Button */}
      <div className="absolute top-28 right-6 z-20">
        <Button 
          onClick={toggleDarkMode} 
          variant="outline" 
          size="icon" 
          className="rounded-full border-2 transition-all duration-300"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Floating Hearts and Coins */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hearts */}
        <Heart className="absolute top-32 left-10 w-6 h-6 text-web3-red animate-bounce" style={{ animationDelay: '0s' }} />
        <Heart className="absolute top-44 right-16 w-4 h-4 text-web3-magenta animate-bounce" style={{ animationDelay: '1s' }} />
        <Heart className="absolute bottom-40 left-20 w-5 h-5 text-web3-red animate-bounce" style={{ animationDelay: '2s' }} />
        <Heart className="absolute top-72 left-1/4 w-4 h-4 text-web3-coral animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Heart className="absolute bottom-60 right-1/4 w-6 h-6 text-web3-magenta animate-bounce" style={{ animationDelay: '1.5s' }} />
        
        {/* Coins */}
        <Coins className="absolute top-52 right-10 w-6 h-6 text-web3-orange animate-bounce" style={{ animationDelay: '0.8s' }} />
        <Coins className="absolute bottom-32 left-32 w-5 h-5 text-web3-yellow animate-bounce" style={{ animationDelay: '2.2s' }} />
        <Coins className="absolute top-84 right-1/3 w-4 h-4 text-web3-orange animate-bounce" style={{ animationDelay: '1.8s' }} />
        <Coins className="absolute bottom-72 left-1/3 w-6 h-6 text-web3-yellow animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Interactive BOINK Title */}
          <div className="relative h-80 md:h-96 -mb-4">
            <ParticleTextEffect
              text="BOINK"
              colors={['FBE24F', 'FFA70F', 'FF7A55', 'F51F3B', 'E809CB']}
              className="absolute inset-0"
              animationForce={100}
              particleDensity={3}
            />
          </div>

          {/* Character Image - Moved down with color-changing ring */}
          <div className="relative mb-12 mt-8">
            {/* Color-changing circular ring background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-80 h-80 rounded-full p-2 bg-gradient-web3"
                style={{
                  animation: 'spin 8s linear infinite'
                }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </div>
            </div>
            
            {/* Character image */}
            <div className="relative z-10">
              <img 
                src="/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png" 
                alt="Cute demon character with heart eyes" 
                className="w-64 h-64 mx-auto relative z-10 rounded-full"
              />
              {/* Character-specific floating elements */}
              <Heart className="absolute -top-2 -right-2 w-4 h-4 text-web3-red animate-pulse z-20" />
              <Coins className="absolute -bottom-2 -left-2 w-4 h-4 text-web3-orange animate-pulse z-20" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Where crypto culture meets human connection. Finally.
          </h2>
          
          {/* Hackathon Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-web3-yellow/20 to-web3-orange/20 rounded-full border border-web3-orange/30 mb-6">
            <span className="text-sm font-medium text-web3-orange dark:text-yellow-300">
              Built for Bonk Hackathon 2025 🚀
            </span>
          </div>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            The first platform built for Web3 natives seeking both professional networking and romantic connections. 
            Whether you're looking for your next co-founder, investor, or life partner - we've got you covered.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={handleMainCTA}
              disabled={authLoading || profileLoading}
              className="bg-gradient-to-r from-web3-red to-web3-magenta hover:from-web3-red/90 hover:to-web3-magenta/90 text-white text-2xl px-16 py-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-bold"
            >
              {getMainCTAText()}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-semibold text-foreground">Verified Profiles</p>
              <p className="text-sm text-muted-foreground">Wallet & Identity Verified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-200 dark:from-red-900/20 dark:to-pink-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Heart className="w-8 h-8 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-lg font-semibold text-foreground">Dual Purpose</p>
              <p className="text-sm text-muted-foreground">Dating & Networking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-lg font-semibold text-foreground">Web3 Community</p>
              <p className="text-sm text-muted-foreground">Professionals & Builders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-web3-yellow/20 to-web3-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Sparkles className="w-8 h-8 text-web3-orange" />
              </div>
              <p className="text-lg font-semibold text-foreground">Smart Matching</p>
              <p className="text-sm text-muted-foreground">AI-Powered Connections</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
