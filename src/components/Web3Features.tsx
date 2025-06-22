
import { Bitcoin, Shield, Users, Heart, Award, Rocket } from "lucide-react";

const Web3Features = () => {
  const features = [
    {
      icon: Bitcoin,
      title: "Crypto-Native Matching",
      description: "Find your perfect match based on DeFi interests, NFT collections, and investment strategies. Connect with people who share your Web3 vision.",
      gradient: "from-web3-yellow to-web3-orange",
      delay: "0s"
    },
    {
      icon: Shield,
      title: "Blockchain Verification",
      description: "Verify your identity through on-chain transactions and wallet history. No more fake profiles or catfishing in our community.",
      gradient: "from-web3-orange to-web3-coral",
      delay: "0.2s"
    },
    {
      icon: Users,
      title: "DAO Governance",
      description: "Community-driven platform decisions. Token holders vote on new features, safety policies, and platform improvements.",
      gradient: "from-web3-coral to-web3-red",
      delay: "0.4s"
    },
    {
      icon: Heart,
      title: "NFT Date Experiences",
      description: "Unlock exclusive dating experiences with NFTs. VIP events, private lounges, and unique date activities only for holders.",
      gradient: "from-web3-red to-web3-magenta",
      delay: "0.6s"
    },
    {
      icon: Award,
      title: "On-Chain Reputation",
      description: "Build your dating reputation on the blockchain. Positive interactions and successful matches create immutable trust scores.",
      gradient: "from-web3-magenta to-web3-pink",
      delay: "0.8s"
    },
    {
      icon: Rocket,
      title: "Future-Proof Love",
      description: "Smart contracts for relationship milestones, decentralized storage for memories, and Web3 tools for modern couples.",
      gradient: "from-web3-pink to-web3-salmon",
      delay: "1s"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FBE24F 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #FF7A55 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dating Reimagined for Web3
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of online dating with blockchain technology, crypto culture, 
            and decentralized trust. Built by Web3 natives, for Web3 natives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 animate-slide-in-left"
              style={{animationDelay: feature.delay}}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-yellow to-web3-orange bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <p className="text-gray-300">Active Web3 Singles</p>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-orange to-web3-coral bg-clip-text text-transparent mb-2">
              2.5K
            </div>
            <p className="text-gray-300">Successful Matches</p>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-coral to-web3-red bg-clip-text text-transparent mb-2">
              150+
            </div>
            <p className="text-gray-300">Happy Couples</p>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-2">
              50+
            </div>
            <p className="text-gray-300">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Web3Features;
