
import { Shield, Lock, Users, Award, Bell, Star } from "lucide-react";

const SafetyFeatures = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: "Wallet Verification",
      description: "Connect your wallet to verify your identity and establish trust within the Web3 community. Authentic profiles only.",
      color: "from-web3-red to-web3-magenta"
    },
    {
      icon: Lock,
      title: "Privacy Controls",
      description: "Full control over your profile visibility and who can contact you. Switch between public discovery and private networking modes.",
      color: "from-web3-orange to-web3-coral"
    },
    {
      icon: Users,
      title: "Professional Standards",
      description: "Curated community of verified Web3 professionals. Our standards ensure quality connections for both dating and networking.",
      color: "from-web3-magenta to-web3-pink"
    },
    {
      icon: Award,
      title: "Profile Quality",
      description: "Detailed profile validation ensures complete and authentic information, creating a high-quality networking environment.",
      color: "from-web3-coral to-web3-salmon"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get notified about meaningful connections, profile views, and opportunities that match your networking or dating goals.",
      color: "from-web3-peach to-web3-cream"
    },
    {
      icon: Star,
      title: "Verified Web3 Identity",
      description: "Link your ENS domain, showcase your NFT collections, and connect social media to build a comprehensive Web3 identity.",
      color: "from-web3-yellow to-web3-orange"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-web3-magenta via-web3-red to-web3-orange bg-clip-text text-transparent mb-6 animate-scale-in">
            🛡️ Built with Trust & Safety in Mind 🔐
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
            We prioritize authentic connections in Web3. Our comprehensive verification system ensures you're 
            connecting with real people, whether for professional networking or romantic relationships. ✨
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
                100%
              </div>
              <p className="text-gray-600">Wallet Verification</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-orange to-web3-coral bg-clip-text text-transparent mb-2">
                2
              </div>
              <p className="text-gray-600">Profile Types Available</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-magenta to-web3-pink bg-clip-text text-transparent mb-2">
                Real-Time
              </div>
              <p className="text-gray-600">Matching Algorithm</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl font-bold bg-gradient-to-r from-web3-yellow to-web3-orange bg-clip-text text-transparent mb-2">
                Web3
              </div>
              <p className="text-gray-600">Native Platform</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyFeatures;
