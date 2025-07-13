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
        {/* Meme Generator Promotion */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center gap-6 mb-6">
            <img 
              src="/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png" 
              alt="Boink Meme Generator" 
              className="w-96 h-96 rounded-lg shadow-lg mx-auto"
            />
            <p className="text-lg text-gray-700 max-w-2xl">
              Try Our Brand New Meme Generator{" "}
              <a 
                href="https://www.cryptofightclub.wtf/boink/memegenerator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-web3-red hover:text-web3-magenta font-bold underline transition-colors"
              >
                HERE
              </a>
              {" "}made by our friends over at{" "}
              <a 
                href="https://www.cryptofightclub.wtf/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-web3-orange hover:text-web3-yellow font-medium underline transition-colors"
              >
                Crypto Fight Club
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
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
