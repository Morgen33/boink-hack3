import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAuthRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check URL parameters for auth errors
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('Auth error from URL:', error, errorDescription);
      toast({
        title: "Authentication Error",
        description: errorDescription || error,
        variant: "destructive",
      });
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  // Redirect if already authenticated - but not during initial OAuth callback
  useEffect(() => {
    // Don't redirect if we're processing an OAuth callback
    const isOAuthCallback = window.location.search.includes('code=') || window.location.hash.includes('access_token');
    
    if (user && !isOAuthCallback) {
      navigate('/account');
    }
  }, [user, navigate]);
};