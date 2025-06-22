
import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_theme(colors.gray.400)_1px,_transparent_0)] bg-[size:24px_24px]"></div>
      
      {/* Gentle Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-3 h-3 bg-web3-coral/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-web3-magenta/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-web3-orange/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
              Boink
            </h1>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Where Bonk Community Finds Love
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            A safe, welcoming space for crypto enthusiasts to build meaningful connections. 
            Join thousands of verified members in the most trusted Web3 dating community.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Join Free Today
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4 rounded-full transition-all duration-300">
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Verified Safe</p>
              <p className="text-xs text-gray-500">ID & Wallet Verified</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">Real Connections</p>
              <p className="text-xs text-gray-500">Genuine Relationships</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">50K+ Members</p>
              <p className="text-xs text-gray-500">Active Community</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Premium Features</p>
              <p className="text-xs text-gray-500">Advanced Matching</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
