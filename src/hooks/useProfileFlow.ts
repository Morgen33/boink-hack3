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

      // Don't redirect if user is on auth, account, or profile pages
      const protectedPaths = ['/auth', '/account', '/profile'];
      if (protectedPaths.some(path => location.pathname.startsWith(path))) {
        return;
      }

      try {
        // Check user's profile status
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('platform_intent, profile_completed, networking_completed, dating_profile_completed')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking profile:', error);
          return;
        }

        // Only redirect if user needs to set platform intent OR complete their profile
        const needsPlatformIntent = !profile?.platform_intent;
        const needsProfileCompletion = profile?.platform_intent && !profile?.profile_completed;
        
        if (needsPlatformIntent || needsProfileCompletion) {
          console.log('🔄 User needs setup, redirecting to account:', {
            needsPlatformIntent,
            needsProfileCompletion,
            current_path: location.pathname
          });
          navigate('/account');
        }

      } catch (error) {
        console.error('Error in profile flow check:', error);
      }
    };

    checkAndRedirectUser();
  }, [user, loading, isNewUser, navigate, location.pathname]);
};