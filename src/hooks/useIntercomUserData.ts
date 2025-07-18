
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export const useIntercomUserData = () => {
  const { user } = useAuth();

  useEffect(() => {
    const updateIntercomSettings = async () => {
      if (!window.intercomSettings) {
        window.intercomSettings = {
          api_base: "https://api-iam.intercom.io",
          app_id: "ob1wk7lg"
        };
      }

      if (user) {
        console.log('🔄 Updating Intercom with user data:', user.id);
        
        try {
          // Fetch profile data to get full_name and created_at
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, created_at')
            .eq('id', user.id)
            .single();

          // Convert created_at to Unix timestamp (seconds)
          const createdAtTimestamp = profile?.created_at 
            ? Math.floor(new Date(profile.created_at).getTime() / 1000)
            : Math.floor(new Date(user.created_at).getTime() / 1000);

          // Update Intercom settings with user data
          window.intercomSettings = {
            ...window.intercomSettings,
            user_id: user.id,
            name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            created_at: createdAtTimestamp
          };

          console.log('✅ Intercom settings updated:', {
            user_id: user.id,
            name: window.intercomSettings.name,
            email: user.email,
            created_at: createdAtTimestamp
          });

          // Update Intercom if it's already loaded
          if (window.Intercom) {
            window.Intercom('update', window.intercomSettings);
            console.log('✅ Intercom widget updated with user data');
          }
        } catch (error) {
          console.error('❌ Error fetching profile for Intercom:', error);
          
          // Fallback to basic user data
          window.intercomSettings = {
            ...window.intercomSettings,
            user_id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            created_at: Math.floor(new Date(user.created_at).getTime() / 1000)
          };

          if (window.Intercom) {
            window.Intercom('update', window.intercomSettings);
          }
        }
      } else {
        console.log('👤 No user logged in - using anonymous Intercom settings');
        
        // Reset to basic settings for anonymous users
        window.intercomSettings = {
          api_base: "https://api-iam.intercom.io",
          app_id: "ob1wk7lg"
        };

        if (window.Intercom) {
          window.Intercom('update', window.intercomSettings);
          console.log('✅ Intercom reset for anonymous user');
        }
      }
    };

    updateIntercomSettings();
  }, [user]);

  return null;
};
