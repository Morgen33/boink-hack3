
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useIntercom } from './useIntercom';

interface ProfileData {
  full_name?: string;
  created_at?: string;
}

export const useIntercomWithUserData = (appId: string) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Fetch profile data when user changes
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        setProfileData(null);
        return;
      }

      try {
        console.log('🔍 Fetching profile data for Intercom user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, created_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('❌ Error fetching profile data for Intercom:', error);
          return;
        }

        if (profile) {
          console.log('✅ Profile data fetched for Intercom:', profile);
          setProfileData(profile);
        }
      } catch (error) {
        console.error('❌ Error in fetchProfileData:', error);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  // Prepare user data for Intercom
  const userData = user ? {
    user_id: user.id,
    name: profileData?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    created_at: profileData?.created_at ? Math.floor(new Date(profileData.created_at).getTime() / 1000) : Math.floor(Date.now() / 1000),
  } : undefined;

  console.log('📊 Intercom user data prepared:', userData);

  // Use the enhanced Intercom hook with user data
  return useIntercom(appId, userData);
};
