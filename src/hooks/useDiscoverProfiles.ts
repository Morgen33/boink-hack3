
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { demoProfiles, ProfileCard } from '@/data/demoProfiles';
import { User } from '@supabase/supabase-js';

export const useDiscoverProfiles = (user: User | null) => {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const initializeProfiles = async () => {
      if (!user) return;

      console.log('Initializing profiles...');
      console.log('Demo profiles available:', demoProfiles.length);

      // Always start with demo profiles
      setProfiles([...demoProfiles]);
      setLoading(false);

      // Then try to fetch real profiles and add them
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, age, bio, location, interests, looking_for, avatar_url')
          .neq('id', user.id)
          .eq('profile_completed', true)
          .limit(10);

        if (error) {
          console.error('Supabase query error:', error);
        } else {
          console.log('Real profiles fetched:', data?.length || 0);
          
          if (data && data.length > 0) {
            // Combine demo profiles with real profiles and shuffle
            const allProfiles = [...demoProfiles, ...data];
            const shuffledProfiles = allProfiles.sort(() => Math.random() - 0.5);
            console.log('Updated profiles with real data:', shuffledProfiles.length);
            setProfiles(shuffledProfiles);
          }
        }
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        // Demo profiles are already set, so we're good
      }
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
