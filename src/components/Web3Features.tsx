
import { Bitcoin, Shield, Users, Heart, Award, Rocket, Briefcase, Network } from "lucide-react";

const Web3Features = () => {
  return (
    <section className="py-8 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          {/* Verified Profiles */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#3A3000] rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[#FBE24F]" />
            </div>
            <h3 className="text-white font-bold mb-1">Verified Profiles</h3>
            <p className="text-gray-400 text-sm">Wallet & Identity Verified</p>
          </div>
          
          {/* Dual Purpose */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#3A0000] rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-[#F51F3B]" />
            </div>
            <h3 className="text-white font-bold mb-1">Dual Purpose</h3>
            <p className="text-gray-400 text-sm">Dating & Networking</p>
          </div>
          
          {/* Web3 Community */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#3A003A] rounded-lg flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#E809CB]" />
            </div>
            <h3 className="text-white font-bold mb-1">Web3 Community</h3>
            <p className="text-gray-400 text-sm">Professionals & Builders</p>
          </div>
          
          {/* Smart Matching */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#3A3000] rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-8 h-8 text-[#FFA70F]" />
            </div>
            <h3 className="text-white font-bold mb-1">Smart Matching</h3>
            <p className="text-gray-400 text-sm">AI-Powered Connections</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Web3Features;
