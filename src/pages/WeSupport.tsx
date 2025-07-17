import { ExternalLink, Twitter, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WeSupport = () => {
  const { toast } = useToast();
  const supportedCommunities = [
    {
      name: "OG $PEANUT",
      description: "The original peanut community on Solana",
      twitter: "https://x.com/OgPeanut_solana",
      imageUrl: "/lovable-uploads/b4303f13-613e-4a0e-ab8e-2cd5c4b529ef.png",
      socialType: "twitter" as const
    },
    {
      name: "Dundies",
      description: "The Dundies District community",
      twitter: "https://x.com/DundiesDistrict",
      imageUrl: "/lovable-uploads/dc258823-b296-4c84-b5b7-d579ea1aa53b.png",
      socialType: "twitter" as const
    },
    {
      name: "Dong",
      description: "DongCoin community on Cardano",
      twitter: "https://x.com/DongCoinADA",
      imageUrl: "/lovable-uploads/0ae100ee-46dd-4f1c-b302-6eacd6dd6a36.png",
      socialType: "twitter" as const
    },
    {
      name: "Tradies",
      description: "The Tradie community",
      twitter: "https://x.com/tradiecoinmeme",
      imageUrl: "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png",
      socialType: "twitter" as const
    },
    {
      name: "Defcon 7",
      description: "Defcon 7 crypto community",
      twitter: "https://x.com/Defcon7_",
      imageUrl: "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png",
      socialType: "twitter" as const
    },
    {
      name: "DefiTimez Mag",
      description: "DeFiTimeZ is a multilingual digital magazine dedicated to educating readers about decentralized finance (DeFi), blockchain, and cryptocurrency, featuring weekly deep dives into the latest trends and projects in the space",
      twitter: "https://x.com/DeFiTimeZ",
      website: "https://defitimez.com/",
      imageUrl: "/lovable-uploads/27c8a8df-2ef1-48a3-9908-670f2dd47f1e.png",
      socialType: "twitter" as const
    },
    {
      name: "Pixio",
      description: "AI-powered creative platform offering innovative solutions for digital content creation and automation",
      twitter: "https://x.com/pixio_ai",
      website: "https://pixio.myapps.ai/",
      imageUrl: "/lovable-uploads/c4dad640-8e57-4a14-920c-f1baf8e619a9.png",
      socialType: "twitter" as const
    },
    {
      name: "AI Tutor",
      description: "AI Tutor will break you free with all of the latest models, cutting edge tools, and unlimited messages.",
      twitter: "https://x.com/myaitutor",
      website: "https://account.myapps.ai/",
      imageUrl: "/lovable-uploads/3a9453e6-a166-42dc-8c6d-5513288fc087.png",
      socialType: "twitter" as const
    },
    {
      name: "Crypto Fight Club",
      description: "Underground crypto community bringing fighters together in the digital arena",
      twitter: "https://x.com/CFConSolana",
      imageUrl: "/lovable-uploads/69920a1b-cbdf-43b5-9795-aa06eae29bc3.png",
      socialType: "twitter" as const
    },
    {
      name: "Metal Warriors",
      description: "Enter the Metal Warriorverse! Four alien outlaws bringing their unique brand of metal music, graphic novels, digital collectibles and more to Earth's most worthy",
      twitter: "https://x.com/MetalWarriorOFL",
      website: "https://metalwarrior.com/",
      imageUrl: "/lovable-uploads/162943d8-170e-471a-bf00-a300a9637ffb.png",
      socialType: "twitter" as const
    },
    {
      name: "Kori",
      description: "Content creator and crypto enthusiast",
      twitter: "https://x.com/pomkori",
      imageUrl: "/lovable-uploads/e6e0a477-c9fe-46b3-b7a4-04c351f7e3b5.png",
      socialType: "twitter" as const
    },
    {
      name: "Shiba Army",
      description: "Shiba Army community",
      twitter: "https://x.com/shibaarmycall",
      website: "https://shibarmycall.site/",
      imageUrl: "/lovable-uploads/4a6ee6fe-4d1d-4eac-89d3-5dee75336f46.png",
      socialType: "twitter" as const
    },
    {
      name: "Bae Bot",
      description: "AI-powered Telegram bot for the crypto community",
      twitter: "https://x.com/BaeBoT_Tech",
      imageUrl: "/lovable-uploads/0f9e0179-5f0c-4e3f-85ba-84a62530d2b6.png",
      socialType: "twitter" as const
    }
  ];

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          subject: "Community Partnership Inquiry"
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully! We'll get back to you soon."
      });
      setContactForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Error sending contact email:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-web3 bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-web3-yellow/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-web3-magenta/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-web3-coral/15 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="text-3xl font-bold text-white hover:scale-105 transition-transform duration-300">
              Boink
            </a>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105 transform">Home</a>
              <a href="/discover" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105 transform">Discover</a>
              <a href="/events" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105 transform">Events</a>
              <a href="/we-support" className="text-white font-semibold border-b-2 border-white/50">We Support</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 bg-clip-text bg-gradient-to-r from-white to-white/80">
            Communities We Support
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Boink proudly supports these amazing crypto communities. Together, we're building 
            the future of Web3 dating and bringing people together through shared values and interests.
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {supportedCommunities.map((community, index) => (
            <div 
              key={index} 
              className="group relative bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 hover:bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-web3-magenta/20 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-web3-yellow/0 via-web3-coral/0 to-web3-magenta/0 group-hover:from-web3-yellow/10 group-hover:via-web3-coral/10 group-hover:to-web3-magenta/10 transition-all duration-500"></div>
              
              <div className="relative z-10">
                {/* Image or Placeholder */}
                <div className="w-full h-48 rounded-xl mb-4 flex items-center justify-center overflow-hidden bg-white/20 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                  {community.imageUrl ? (
                    <img 
                      src={community.imageUrl} 
                      alt={community.name}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center border-2 border-dashed border-white/30">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 bg-white/30 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">📸</span>
                        </div>
                        <p className="text-xs text-white/70">Image placeholder</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Community Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-web3-red transition-colors duration-300">
                  {community.name}
                </h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {community.description}
                </p>

                {/* Social Links */}
                <div className="space-y-3">
                  {community.twitter && (
                    <a
                      href={community.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-web3-red transition-colors duration-300 group/link"
                    >
                      <Twitter className="w-4 h-4 mr-2 group-hover/link:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium">Follow on X</span>
                      <ExternalLink className="w-3 h-3 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </a>
                  )}
                  
                  {community.website && (
                    <div>
                      <a
                        href={community.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-web3-coral transition-colors duration-300 group/link"
                      >
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/link:scale-110 transition-transform duration-300" />
                        <span className="text-sm font-medium">Visit Website</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-10 border border-white/30 max-w-4xl mx-auto overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-web3-coral/10 via-web3-magenta/10 to-web3-red/10 rounded-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Want to see your community here?
              </h2>
              <p className="text-gray-700 mb-8 text-lg">
                We're always looking to support more amazing crypto communities. 
                Reach out to us and let's build something together!
              </p>
              
              <form onSubmit={handleContactSubmit} className="max-w-md mx-auto space-y-6">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-web3-red focus:ring-web3-red/50"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-web3-red focus:ring-web3-red/50"
                  required
                />
                <Textarea
                  placeholder="Tell us about your community and how we can work together..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full h-32 resize-none bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-web3-red focus:ring-web3-red/50"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-web3-coral to-web3-magenta text-white font-semibold rounded-full py-3 px-8 hover:from-web3-red hover:to-web3-pink transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-web3-magenta/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Sending..." : "Get in Touch"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeSupport;
