
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="w-10 h-10 bg-gradient-to-r from-web3-red to-web3-magenta rounded-lg flex items-center justify-center mr-3">
        <Heart className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
        Boink
      </span>
    </Link>
  );
};

export default Logo;
