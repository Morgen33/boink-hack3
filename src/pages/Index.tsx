
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
import IncompleteProfileWarning from "@/components/profile/IncompleteProfileWarning";

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
    </div>
  );
};

export default Index;
