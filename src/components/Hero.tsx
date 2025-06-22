
import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, Rocket } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-web3 bg-[length:400%_400%] animate-gradient-shift"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Boink
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            The safest place to find love and connections in the Bonk ecosystem
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            Connect with like-minded crypto enthusiasts, DeFi innovators, and Bonk builders. 
            Built with security first, powered by blockchain trust.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105">
              Start Dating Safely
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105">
              Join Network
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/90 font-semibold">Verified Safe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/90 font-semibold">Real Connections</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/90 font-semibold">Bonk Community</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/90 font-semibold">Future Ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
