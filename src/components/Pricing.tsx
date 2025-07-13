
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Rocket } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Explorer",
      price: "Free",
      period: "forever",
      description: "Perfect for getting started in Boink dating",
      icon: Star,
      gradient: "from-web3-yellow to-web3-orange",
      features: [
        "Create verified profile",
        "5 matches per day",
        "Basic messaging",
        "Community access",
        "Safety monitoring",
        "Profile verification badge"
      ],
      buttonText: "Start Free",
      popular: false
    },
    {
      name: "Connector",
      price: "$9.99",
      period: "per month",
      description: "For serious Boink relationship seekers",
      icon: Crown,
      gradient: "from-web3-coral to-web3-red",
      features: [
        "Everything in Explorer",
        "Unlimited matches",
        "Advanced filters",
        "Priority support",
        "Read receipts",
        "Boost profile visibility",
        "NFT gallery showcase",
        "Private wallet connections",
        "Advanced safety features"
      ],
      buttonText: "Go Premium",
      popular: true
    },
    {
      name: "Builder",
      price: "$19.99",
      period: "per month",
      description: "For Boink entrepreneurs and thought leaders",
      icon: Rocket,
      gradient: "from-web3-magenta to-web3-pink",
      features: [
        "Everything in Connector",
        "VIP profile badge",
        "Event networking access",
        "1-on-1 dating coach",
        "Portfolio showcase",
        "Investment matching",
        "Exclusive events",
        "White-glove verification",
        "Custom profile themes",
        "Analytics dashboard"
      ],
      buttonText: "Level Up",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-6">
            Choose Your Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you build meaningful connections in the Boink ecosystem. 
            Every plan includes our industry-leading safety features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in ${
                plan.popular ? 'ring-2 ring-web3-coral scale-105' : ''
              }`}
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-web3-coral to-web3-red text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className={`w-5 h-5 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white rounded-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-105`}
                >
                  {plan.buttonText}
                </Button>
              </div>

              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-web3-yellow/10 to-web3-orange/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-web3-yellow to-web3-orange bg-clip-text text-transparent mb-4">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try any premium plan risk-free. If you don't find meaningful connections or feel unsafe, 
              we'll refund every penny. Your trust and safety are our guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
