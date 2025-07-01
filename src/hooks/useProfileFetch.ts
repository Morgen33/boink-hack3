
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/ProfileTypes';
import { createProfileFromData } from '@/utils/profileDataUtils';

export const useProfileFetch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;

    try {
      console.log('Refreshing profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      console.log('Profile data refreshed:', data);
      const profileData = createProfileFromData(data);
      setProfile(profileData);
      return profileData;
    } catch (error: any) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        await refreshProfile();
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  return { profile, loading, setProfile, refreshProfile };
};
