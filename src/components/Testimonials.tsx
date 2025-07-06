
import { Star, Quote, Shield } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DeFi Developer",
      avatar: "SC",
      rating: 5,
      text: "I was so tired of explaining what DeFi was on other dating apps. Here, everyone gets it! Met my partner at a Web3 meetup we both discovered through the platform. The safety features made me feel secure from day one.",
      gradient: "from-web3-yellow to-web3-orange"
    },
    {
      name: "Marcus Thompson",
      role: "NFT Artist",
      avatar: "MT",
      rating: 5,
      text: "The NFT gallery feature is amazing! I could showcase my art and connect with collectors who appreciated my work. Found love AND new collectors. The verification system kept all the scammers away.",
      gradient: "from-web3-coral to-web3-red"
    },
    {
      name: "Elena Rodriguez",
      role: "Crypto Investor",
      avatar: "ER",
      rating: 5,
      text: "Finally, a dating platform that understands crypto anxiety! The safety education and community support helped me navigate Web3 dating confidently. Met my fiancé here - we're planning a blockchain wedding!",
      gradient: "from-web3-magenta to-web3-pink"
    },
    {
      name: "David Kim",
      role: "Blockchain Consultant",
      avatar: "DK",
      rating: 5,
      text: "The quality of connections here is incredible. Everyone is verified, educated about Web3, and genuinely looking for meaningful relationships. The reputation system works - met only high-quality people.",
      gradient: "from-web3-orange to-web3-coral"
    },
    {
      name: "Priya Patel",
      role: "Smart Contract Auditor",
      avatar: "PP",
      rating: 5,
      text: "As someone who audits contracts for security, I was impressed by their safety measures. The on-chain verification gave me confidence that profiles were real. Found my partner who shares my passion for security!",
      gradient: "from-web3-red to-web3-magenta"
    },
    {
      name: "Alex Johnson",
      role: "DAO Founder",
      avatar: "AJ",
      rating: 5,
      text: "The governance features are brilliant! Being able to vote on platform changes made me feel like a true community member. Met someone who joined my DAO and is now my co-founder in life and business.",
      gradient: "from-web3-pink to-web3-salmon"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Love Stories from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real people finding real connections in the Web3 world. See why thousands trust 
            Web3 Hearts for safe, authentic dating experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-8 h-8 text-gray-300" />
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-web3-yellow/10 to-web3-orange/10 rounded-full px-8 py-4">
            <Shield className="w-6 h-6 text-web3-orange mr-3" />
            <span className="text-gray-700 font-semibold">
              Built for the Web3 community with love
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
