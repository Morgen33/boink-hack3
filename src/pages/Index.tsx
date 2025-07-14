
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileFlow } from '@/hooks/useProfileFlow';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PrototypeSlider from "@/components/PrototypeSlider";
import SafetyFeatures from "@/components/SafetyFeatures";
import Web3Features from "@/components/Web3Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import MVPOverlay from "@/components/MVPOverlay";
import GMGNLink from "@/components/header/GMGNLink";
import ProfileCompletionPrompt from "@/components/ProfileCompletionPrompt";
import IncompleteProfileWarning from "@/components/profile/IncompleteProfileWarning";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfileData();
  const navigate = useNavigate();
  
  // Handle profile flow routing
  useProfileFlow();

  useEffect(() => {
    // Check if user has seen the MVP disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('boink-mvp-disclaimer-seen');
    if (!hasSeenDisclaimer) {
      setShowOverlay(true);
    }
  }, []);

  // Smart routing for authenticated users - redirect to daily matches
  // Only if they have completed profile setup
  useEffect(() => {
    if (authLoading || profileLoading) return;

    // Only redirect if user has completed profile setup
    // useProfileFlow will handle redirecting incomplete profiles
    if (user && profile && profile.profile_completed && profile.platform_intent) {
      const timer = setTimeout(() => {
        navigate('/daily-matches');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  const handleEnterApp = () => {
    // Mark as seen and hide overlay
    localStorage.setItem('boink-mvp-disclaimer-seen', 'true');
    setShowOverlay(false);
  };

  const calculateCompletionPercentage = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'full_name', 'username', 'age', 'bio', 'location', 
      'gender_identity', 'sexual_orientation', 'looking_for',
      'wallet_address', 'favorite_crypto', 'crypto_experience'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = profile[field as keyof typeof profile];
      return value && value !== '' && value !== null;
    });
    
    return (completedFields.length / requiredFields.length) * 100;
  };

  return (
    <div className="min-h-screen">
      {showOverlay && <MVPOverlay onEnter={handleEnterApp} />}
      
      {showProfilePrompt && (
        <ProfileCompletionPrompt 
          onDismiss={() => setShowProfilePrompt(false)}
          completionPercentage={calculateCompletionPercentage()}
        />
      )}
      
      <ErrorBoundary fallback={({ error, resetError }) => (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-destructive">Authentication Issue</h2>
            <p className="text-muted-foreground">
              There was a problem after signing in. This is common on mobile browsers.
            </p>
            <button 
              onClick={() => window.location.href = '/account'} 
              className="px-4 py-2 bg-gradient-to-r from-web3-red to-web3-magenta text-white rounded hover:opacity-90"
            >
              Continue to Account
            </button>
          </div>
        </div>
      )}>
        <Header />
        <GMGNLink />
        
        <main>
          <Hero />
          <PrototypeSlider />
          <section id="safety">
            <SafetyFeatures />
          </section>
          <section id="features">
            <Web3Features />
          </section>
          <section id="pricing">
            <Pricing />
          </section>
          <section id="testimonials">
            <Testimonials />
          </section>
        </main>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default Index;
