
import { ExternalLink, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WeSupport = () => {
  const supportedCommunities = [
    {
      name: "OG $PEANUT",
      description: "The original peanut community on Solana",
      twitter: "https://x.com/OgPeanut_solana",
      imagePlaceholder: "Upload OG $PEANUT logo"
    },
    {
      name: "Dundies",
      description: "The Dundies District community",
      twitter: "https://x.com/DundiesDistrict",
      imagePlaceholder: "Upload Dundies logo"
    },
    {
      name: "Dong",
      description: "DongCoin community on Cardano",
      twitter: "https://x.com/DongCoinADA",
      imagePlaceholder: "Upload Dong logo"
    },
    {
      name: "Tradies",
      description: "The Tradie community",
      twitter: "https://x.com/tradiecoinmeme",
      imagePlaceholder: "Upload Tradies logo"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
              Boink
            </a>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="/discover" className="text-gray-600 hover:text-gray-900 transition-colors">Discover</a>
              <a href="/events" className="text-gray-600 hover:text-gray-900 transition-colors">Events</a>
              <a href="/we-support" className="text-web3-red font-semibold">We Support</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Communities We Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Boink proudly supports these amazing crypto communities. Together, we're building 
            the future of Web3 dating and bringing people together through shared values and interests.
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {supportedCommunities.map((community, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6">
                {/* Image Placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">📸</span>
                    </div>
                    <p className="text-xs text-gray-500">{community.imagePlaceholder}</p>
                  </div>
                </div>

                {/* Community Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {community.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {community.description}
                </p>

                {/* Twitter Link */}
                <a
                  href={community.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors group-hover:scale-105 transform duration-200"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Follow on X</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-web3-yellow/10 to-web3-orange/10 rounded-2xl p-8 border border-web3-orange/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to see your community here?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always looking to support more amazing crypto communities. 
              Reach out to us and let's build something together!
            </p>
            <a
              href="/auth"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-web3-red to-web3-magenta text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeSupport;
