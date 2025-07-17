import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useProfileFlow = () => {
  const { user, loading, isNewUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAndRedirectUser = async () => {
      // Don't redirect if we're still loading or no user
      if (loading || !user) return;

      // Don't redirect if user is on auth or account pages
      const protectedPaths = ['/auth', '/account'];
      if (protectedPaths.some(path => location.pathname.startsWith(path))) {
        return;
      }

      try {
        // Check user's profile status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('platform_intent, profile_completed, networking_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking profile:', error);
          return;
        }

        // Redirect users to account page if they're not already there
        // The account page will handle showing platform intent selection if needed
        if (location.pathname !== '/account') {
          navigate('/account');
        }

      } catch (error) {
        console.error('Error in profile flow check:', error);
      }
    };

    checkAndRedirectUser();
  }, [user, loading, isNewUser, navigate, location.pathname]);
};