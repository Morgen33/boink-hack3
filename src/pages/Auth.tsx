
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSpotifyIntegration } from "@/hooks/useSpotifyIntegration";
import { AuthForm } from "@/components/auth/AuthForm";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSpotifyCallback } = useSpotifyIntegration(user);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    if (session) {
      // Redirect authenticated users
      navigate('/account');
      return;
    }

    // Check if this is an OAuth callback or recovery
    const isOAuthCallback = window.location.search.includes('code=') || 
                           window.location.hash.includes('access_token') ||
                           window.location.hash.includes('type=recovery');

    if (isOAuthCallback) {
      setIsProcessingCallback(true);
      handleAuthCallback();
    }
  }, [session, navigate]);

  const handleAuthCallback = async () => {
    try {
      // Handle deep link authentication
      const params = new URLSearchParams(window.location.hash.substring(1));
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
        return;
      }

      // Handle Spotify callback
      const urlParams = new URLSearchParams(window.location.search);
      const spotifyCode = urlParams.get('code');
      const spotifyState = urlParams.get('state');
      
      if (spotifyCode && spotifyState && user) {
        const success = await handleSpotifyCallback(spotifyCode, spotifyState);
        if (success) {
          // Clean up URL and redirect
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/account');
        }
        return;
      }

      // If we get here and there's no specific callback to handle, 
      // just wait for the auth state to update
      setTimeout(() => {
        setIsProcessingCallback(false);
      }, 2000);

    } catch (error) {
      console.error('Error handling auth callback:', error);
      setIsProcessingCallback(false);
      toast({
        title: "Authentication Error",
        description: "There was an issue processing your authentication. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show processing screen during OAuth callbacks
  if (isProcessingCallback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-2xl font-bold">Processing Authentication...</h1>
          <p className="text-muted-foreground">Please wait, you will be redirected shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Join our community and start connecting'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign In Button */}
          <GoogleSignIn loading={loading} setLoading={setLoading} />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <AuthForm 
            isLogin={isLogin}
            onToggleMode={() => setIsLogin(!isLogin)}
            loading={loading}
            setLoading={setLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
