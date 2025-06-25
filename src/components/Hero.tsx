import { Button } from "@/components/ui/button";
import { ParticleTextEffect } from "@/components/ui/interactive-text-particle";
import { Shield, Heart, Users, Sparkles, Coins, Sun, Moon } from "lucide-react";
import { useState } from "react";

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-24 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Day/Night Toggle Button */}
      <div className="absolute top-28 right-6 z-20">
        <Button 
          onClick={toggleDarkMode} 
          variant="outline" 
          size="icon" 
          className={`rounded-full border-2 transition-all duration-300 ${isDarkMode ? 'border-yellow-400 bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Floating Hearts and Coins */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hearts */}
        <Heart className="absolute top-32 left-10 w-6 h-6 text-[#F51F3B] animate-bounce" style={{ animationDelay: '0s' }} />
        <Heart className="absolute top-44 right-16 w-4 h-4 text-[#E809CB] animate-bounce" style={{ animationDelay: '1s' }} />
        <Heart className="absolute bottom-40 left-20 w-5 h-5 text-[#F51F3B] animate-bounce" style={{ animationDelay: '2s' }} />
        <Heart className="absolute top-72 left-1/4 w-4 h-4 text-[#FF7A55] animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Heart className="absolute bottom-60 right-1/4 w-6 h-6 text-[#E809CB] animate-bounce" style={{ animationDelay: '1.5s' }} />
        
        {/* Coins */}
        <Coins className="absolute top-52 right-10 w-6 h-6 text-[#FFA70F] animate-bounce" style={{ animationDelay: '0.8s' }} />
        <Coins className="absolute bottom-32 left-32 w-5 h-5 text-[#FBE24F] animate-bounce" style={{ animationDelay: '2.2s' }} />
        <Coins className="absolute top-84 right-1/3 w-4 h-4 text-[#FFA70F] animate-bounce" style={{ animationDelay: '1.8s' }} />
        <Coins className="absolute bottom-72 left-1/3 w-6 h-6 text-[#FBE24F] animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Interactive BOINK Title */}
          <div className="relative h-48 md:h-64 mb-8">
            <ParticleTextEffect
              text="BOINK"
              colors={['FBE24F', 'FFA70F', 'FF7A55', 'F51F3B', 'E809CB']}
              className="absolute inset-0"
              animationForce={100}
              particleDensity={3}
            />
          </div>
          
          {/* Character Image - Between Logo and Subtitle with proper spacing */}
          <div className="relative mb-12">
            {/* Character-specific floating elements */}
            <Heart className="absolute -top-2 -right-2 w-4 h-4 text-[#F51F3B] animate-pulse" />
            <Coins className="absolute -bottom-2 -left-2 w-4 h-4 text-[#FFA70F] animate-pulse" />
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-semibold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Where Degens Find Their Forever Person
          </h2>
          
          {/* Hackathon Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FBE24F]/20 to-[#FFA70F]/20 rounded-full border border-[#FFA70F]/30 mb-6">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-orange-700'}`}>
              Built for Bonk Hackathon 2024 🚀
            </span>
          </div>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Tired of rugpulls in love? Join the wildest crypto dating scene where diamond hands meet diamond hearts. 
            For serious lovers who speak fluent degen but want something real AF.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-[#F51F3B] to-[#E809CB] hover:from-[#F51F3B]/90 hover:to-[#E809CB]/90 text-white text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Let's Fucking Go! 🚀
            </Button>
            <Button size="lg" variant="outline" className={`border-2 text-xl px-12 py-6 rounded-full transition-all duration-300 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              Show Me the Alpha
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t transition-colors duration-500 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className={`text-lg font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>No Rug Pulls</p>
              <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wallet & Soul Verified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <p className={`text-lg font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Real Feels</p>
              <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actual Relationships</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className={`text-lg font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>50K+ Degens</p>
              <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active & Based</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FBE24F]/20 to-[#FFA70F]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Sparkles className="w-8 h-8 text-[#FFA70F]" />
              </div>
              <p className={`text-lg font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Alpha Features</p>
              <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Next-Level Matching</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
