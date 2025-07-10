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

      // Don't redirect if user is on auth, platform-intent, or profile setup pages
      const protectedPaths = ['/auth', '/platform-intent', '/profile/setup'];
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

        // If user hasn't chosen platform intent, redirect to platform intent page
        if (!profile?.platform_intent) {
          navigate('/platform-intent');
          return;
        }

        // All users with platform intent go to account page
        // They can choose which forms to complete from there
        navigate('/account');

      } catch (error) {
        console.error('Error in profile flow check:', error);
      }
    };

    checkAndRedirectUser();
  }, [user, loading, isNewUser, navigate, location.pathname]);
};