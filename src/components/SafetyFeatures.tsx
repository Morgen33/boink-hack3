
import { Shield, Lock, Users, Award, Bell, Star } from "lucide-react";

const SafetyFeatures = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Multi-Layer Verification",
      description: "Blockchain identity verification, social media linking, and community vouching system to ensure authentic profiles.",
      color: "from-web3-red to-web3-magenta"
    },
    {
      icon: Lock,
      title: "Encrypted Communications",
      description: "End-to-end encrypted messaging with optional self-destructing messages for ultimate privacy protection.",
      color: "from-web3-orange to-web3-coral"
    },
    {
      icon: Users,
      title: "Community Safety Network",
      description: "Decentralized reporting system where the community helps identify and remove bad actors together.",
      color: "from-web3-magenta to-web3-pink"
    },
    {
      icon: Award,
      title: "Reputation System",
      description: "On-chain reputation tracking that rewards good behavior and flags concerning patterns automatically.",
      color: "from-web3-coral to-web3-salmon"
    },
    {
      icon: Bell,
      title: "Smart Safety Alerts",
      description: "AI-powered alerts that warn you about potential scams, fake profiles, or suspicious activities.",
      color: "from-web3-peach to-web3-cream"
    },
    {
      icon: Star,
      title: "Verified Web3 Profiles",
      description: "Connect your wallet, ENS domain, and NFT collections to prove your authentic presence in Web3.",
      color: "from-web3-yellow to-web3-orange"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Safety is Our Priority
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand that crypto can feel scary. That's why we've built the most comprehensive 
            safety system in Web3 dating, protecting you from scams, fake profiles, and bad actors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Trust Metrics */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-2">
                99.8%
              </div>
              <p className="text-gray-600">Scam Prevention Rate</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-orange to-web3-coral bg-clip-text text-transparent mb-2">
                100%
              </div>
              <p className="text-gray-600">Verification Required</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-magenta to-web3-pink bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-gray-600">Safety Monitoring</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-yellow to-web3-orange bg-clip-text text-transparent mb-2">
                4.9★
              </div>
              <p className="text-gray-600">Safety Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyFeatures;
