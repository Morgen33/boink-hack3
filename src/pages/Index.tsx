
import { useState, useEffect } from 'react';
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

const Index = () => {
  const [showOverlay, setShowOverlay] = useState(false);

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

  return (
    <div className="min-h-screen">
      {showOverlay && <MVPOverlay onEnter={handleEnterApp} />}
      
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
