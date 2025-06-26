
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="outline"
        className="border-border text-foreground hover:bg-accent"
        onClick={() => navigate('/auth')}
      >
        Sign In
      </Button>
      <Button
        className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90 text-white"
        onClick={() => navigate('/auth')}
      >
        Join Free
      </Button>
    </>
  );
};

export default AuthButtons;
