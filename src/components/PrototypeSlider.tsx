
import { InfiniteSlider } from "@/components/ui/infinite-slider-horizontal";
import { Heart, Coins, Star, Sparkles } from "lucide-react";

const prototypes = [
  {
    title: "Wallet Connect",
    description: "Link your crypto wallet",
    icon: Coins,
    color: "from-[#FBE24F] to-[#FFA70F]"
  },
  {
    title: "NFT Profile",
    description: "Show off your collection",
    icon: Star,
    color: "from-[#FFA70F] to-[#FF7A55]"
  },
  {
    title: "Crypto Dating",
    description: "Match with diamond hands",
    icon: Heart,
    color: "from-[#FF7A55] to-[#F51F3B]"
  },
  {
    title: "Alpha Features",
    description: "Next-level matching",
    icon: Sparkles,
    color: "from-[#F51F3B] to-[#E809CB]"
  },
  {
    title: "Web3 Verified",
    description: "Authentic profiles only",
    icon: Star,
    color: "from-[#E809CB] to-[#FBE24F]"
  }
];

const PrototypeSlider = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FBE24F]/20 to-[#FFA70F]/20 rounded-full border border-[#FFA70F]/30 mb-4">
            <span className="text-sm font-medium text-orange-700">
              🚀 Built as My Initial Prototype
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Future of Web3 Dating
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of crypto-native dating features
          </p>
        </div>

        <div className="space-y-12 py-8">
          {/* First row - normal direction */}
          <div className="overflow-visible">
            <InfiniteSlider direction="horizontal" duration={20} className="py-4">
              {prototypes.map((prototype, index) => (
                <div key={index} className="flex-shrink-0 w-80">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 mx-2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${prototype.color} rounded-xl flex items-center justify-center mb-4`}>
                      <prototype.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {prototype.title}
                    </h3>
                    <p className="text-gray-600">
                      {prototype.description}
                    </p>
                  </div>
                </div>
              ))}
            </InfiniteSlider>
          </div>

          {/* Second row - reverse direction */}
          <div className="overflow-visible">
            <InfiniteSlider direction="horizontal" reverse duration={25} className="py-4">
              {prototypes.map((prototype, index) => (
                <div key={index} className="flex-shrink-0 w-80">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 mx-2">
                    <div className={`w-12 h-12 bg-gradient-to-r ${prototype.color} rounded-xl flex items-center justify-center mb-4`}>
                      <prototype.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {prototype.title}
                    </h3>
                    <p className="text-gray-600">
                      {prototype.description}
                    </p>
                  </div>
                </div>
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrototypeSlider;
