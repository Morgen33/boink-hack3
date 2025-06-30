
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
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
import TieredProfileWarning from "@/components/profile/TieredProfileWarning";
import { assessProfileQuality } from '@/utils/profileQualityUtils';

const Index = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfileData();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the MVP disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('boink-mvp-disclaimer-seen');
    if (!hasSeenDisclaimer) {
      setShowOverlay(true);
    }
  }, []);

  // Smart routing based on user and profile status
  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (user && profile) {
      const profileQuality = assessProfileQuality(profile);
      
      // Only redirect to daily matches if profile has good or excellent visibility
      if (profileQuality.visibilityStatus === 'good' || profileQuality.visibilityStatus === 'excellent') {
        navigate('/daily-matches');
      } else {
        // Show completion prompt for profiles with limited or no visibility
        const timer = setTimeout(() => {
          setShowProfilePrompt(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  const handleEnterApp = () => {
    // Mark as seen and hide overlay
    localStorage.setItem('boink-mvp-disclaimer-seen', 'true');
    setShowOverlay(false);
  };

  const calculateCompletionPercentage = () => {
    if (!profile) return 0;
    return assessProfileQuality(profile).percentage;
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
      
      <Header />
      <GMGNLink />
      
      {/* Show tiered warning for authenticated users with profiles that need improvement */}
      {user && profile && !showOverlay && !showProfilePrompt && (
        <div className="container mx-auto px-4 pt-24 pb-6">
          <TieredProfileWarning quality={assessProfileQuality(profile)} />
        </div>
      )}
      
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
    </div>
  );
};

export default Index;
