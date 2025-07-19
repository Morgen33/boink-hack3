import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSpotifyIntegration } from "@/hooks/useSpotifyIntegration";

const Auth = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSpotifyCallback } = useSpotifyIntegration(user);

  useEffect(() => {
    if (session) {
      // Redirect authenticated users
      navigate('/profile');
    }

    // Handle deep link authentication
    const handleDeepLinkAuth = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1)); // Remove the '#'
      const type = params.get('type');
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresIn = params.get('expires_in');

      if (type === 'recovery' && accessToken && refreshToken && expiresIn) {
        // Handle password recovery
        toast({
          title: "Password Recovery",
          description: "You can now set your new password.",
        });
        navigate(`/account?accessToken=${accessToken}&refreshToken=${refreshToken}&expiresIn=${expiresIn}`);
      }
    };

    handleDeepLinkAuth();

    // Handle Spotify callback
    const urlParams = new URLSearchParams(window.location.search);
    const spotifyCode = urlParams.get('code');
    const spotifyState = urlParams.get('state');
    
    if (spotifyCode && spotifyState && user) {
      handleSpotifyCallback(spotifyCode, spotifyState).then((success) => {
        if (success) {
          // Clean up URL and redirect
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/profile');
        }
      });
    }
  }, [user, navigate, handleSpotifyCallback, session, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Please wait, you will be redirected.</p>
      </div>
    </div>
  );
};

export default Auth;
