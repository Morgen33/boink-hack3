
import { Bitcoin, Shield, Users, Heart, Award, Rocket, Briefcase, Network } from "lucide-react";

const Web3Features = () => {
  const features = [
    {
      icon: Heart,
      title: "Dating & Romance",
      description: "Find your perfect romantic match based on shared Web3 interests, crypto experience, and lifestyle preferences. Connect with someone who truly gets your passion.",
      gradient: "from-web3-red to-web3-magenta",
      delay: "0s"
    },
    {
      icon: Users,
      title: "Professional Networking",
      description: "Connect with co-founders, investors, developers, and industry leaders. Build meaningful business relationships in the Web3 ecosystem.",
      gradient: "from-blue-500 to-purple-500",
      delay: "0.2s"
    },
    {
      icon: Bitcoin,
      title: "Crypto-Native Matching",
      description: "Advanced matching algorithm considers your DeFi activity, NFT collections, investment strategies, and crypto philosophy for better connections.",
      gradient: "from-web3-yellow to-web3-orange",
      delay: "0.4s"
    },
    {
      icon: Shield,
      title: "Verified Identities",
      description: "Multi-layer verification through wallet signatures, social media connections, and community vouching ensures authentic, trustworthy profiles.",
      gradient: "from-web3-orange to-web3-coral",
      delay: "0.6s"
    },
    {
      icon: Briefcase,
      title: "Professional Profiles",
      description: "Showcase your expertise, projects, and professional background. Connect based on skills, industry experience, and collaboration goals.",
      gradient: "from-web3-coral to-web3-red",
      delay: "0.8s"
    },
    {
      icon: Network,
      title: "Dual-Purpose Platform",
      description: "One profile, two opportunities. Switch seamlessly between dating and networking modes, or use both simultaneously for maximum connections.",
      gradient: "from-web3-magenta to-web3-pink",
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
            Dating & Networking Reimagined for Web3
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The first platform designed specifically for Web3 professionals seeking both meaningful business 
            connections and romantic relationships. Built by crypto natives, for crypto natives.
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
              1K+
            </div>
            <p className="text-gray-300">Web3 Professionals</p>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-orange to-web3-coral bg-clip-text text-transparent mb-2">
              500+
            </div>
            <p className="text-gray-300">Successful Connections</p>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-coral to-web3-red bg-clip-text text-transparent mb-2">
              2
            </div>
            <p className="text-gray-300">Profile Types</p>
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className="text-gray-300">Platform Active</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Web3Features;
