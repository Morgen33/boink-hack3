
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileCard } from '@/data/demoProfiles';
import { User } from '@supabase/supabase-js';
import { useUserBlocks } from './useUserBlocks';

export const useDiscoverProfiles = (user: User | null) => {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isUserBlocked } = useUserBlocks();

  useEffect(() => {
    const initializeProfiles = async () => {
      if (!user) return;

      console.log('Initializing profiles...');
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, age, bio, location, interests, looking_for, avatar_url')
          .neq('id', user.id)
          .limit(20);

        if (error) {
          console.error('Supabase query error:', error);
        } else {
          console.log('Real profiles fetched:', data?.length || 0);
          const filteredProfiles = (data || []).filter(profile => !isUserBlocked(profile.id));
          const shuffledProfiles = filteredProfiles.sort(() => Math.random() - 0.5);
          setProfiles(shuffledProfiles);
        }
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        setProfiles([]);
      }
      
      setLoading(false);
    };

    initializeProfiles();
  }, [user]);

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length - 1;

  return {
    profiles,
    loading,
    currentIndex,
    currentProfile,
    hasMoreProfiles,
    nextProfile
  };
};
