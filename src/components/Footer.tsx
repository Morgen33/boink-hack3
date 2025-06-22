import { Heart, Shield, Users, Mail } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "How it Works", href: "#" },
        { name: "Safety Center", href: "#" },
        { name: "Success Stories", href: "#" },
        { name: "Community Guidelines", href: "#" }
      ]
    },
    {
      title: "Web3 Features",
      links: [
        { name: "Wallet Integration", href: "#" },
        { name: "NFT Galleries", href: "#" },
        { name: "DAO Governance", href: "#" },
        { name: "Token Rewards", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Report Issues", href: "#" },
        { name: "Safety Resources", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-web3-red to-web3-magenta rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-web3-yellow to-web3-orange bg-clip-text text-transparent">
                Boink
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The safest and most trusted Web3 dating platform for the Bonk community. 
              Connecting crypto enthusiasts, DeFi builders, and 
              blockchain innovators worldwide.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                <span>Verified Safe</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2 text-blue-400" />
                <span>50K+ Members</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest Web3 dating tips and platform updates.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-800 rounded-full p-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent px-4 py-2 text-white placeholder-gray-400 outline-none"
                />
                <button className="bg-gradient-to-r from-web3-red to-web3-magenta text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 Web3 Hearts. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
