
import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FBE24F] to-[#FFA70F] rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-[#FF7A55] to-[#F51F3B] bg-clip-text text-transparent">
              Boink
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Where Bonk Community Finds Love
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A safe, welcoming space for crypto enthusiasts to build meaningful connections. 
            Join thousands of verified members in the most trusted Web3 dating community.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-[#F51F3B] to-[#E809CB] hover:from-[#F51F3B]/90 hover:to-[#E809CB]/90 text-white text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              Join Free Today
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-xl px-12 py-6 rounded-full transition-all duration-300">
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">Verified Safe</p>
              <p className="text-sm text-gray-500">ID & Wallet Verified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-lg font-semibold text-gray-800">Real Connections</p>
              <p className="text-sm text-gray-500">Genuine Relationships</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">50K+ Members</p>
              <p className="text-sm text-gray-500">Active Community</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FBE24F]/20 to-[#FFA70F]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Sparkles className="w-8 h-8 text-[#FFA70F]" />
              </div>
              <p className="text-lg font-semibold text-gray-800">Premium Features</p>
              <p className="text-sm text-gray-500">Advanced Matching</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
