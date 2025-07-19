
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GoogleSignInProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const GoogleSignIn = ({ loading, setLoading }: GoogleSignInProps) => {
  const { toast } = useToast();

  // Check if running in iframe (like Lovable preview)
  const isInIframe = window.self !== window.top;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('🔄 STARTING Google sign in...');
      console.log('📍 Current URL:', window.location.href);
      console.log('🌐 Origin:', window.location.origin);
      console.log('🖼️ Is in iframe:', isInIframe);
      
      if (isInIframe) {
        console.log('⚠️ In iframe - opening popup');
        const authUrl = `https://pizlzaomylxreizohewd.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + '/account')}`;
        console.log('🔗 Auth URL:', authUrl);
        
        const popup = window.open(authUrl, 'google-auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        toast({
          title: "Authentication Window Opened",
          description: "Complete the sign-in in the popup window. You may need to allow popups for this site.",
          variant: "default",
        });

        // Listen for popup closure
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setLoading(false);
            // Check if auth was successful
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }, 1000);

        return;
      }
      
      console.log('✅ Not in iframe - proceeding with normal OAuth');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`
        }
      });
      
      if (error) {
        console.error('❌ OAuth ERROR:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('✅ OAuth call completed successfully');
    } catch (error: any) {
      console.error('❌ CATCH BLOCK - Google sign-in error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      toast({
        title: "Google Sign-in Error",
        description: error.message || "Failed to sign in with Google. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 Google sign-in attempt finished');
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="w-full"
      size="lg"
      disabled={loading}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {loading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
};
