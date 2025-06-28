
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { demoProfiles, ProfileCard } from '@/data/demoProfiles';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  age: number | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  avatar_url: string | null;
  gender_identity: string | null;
  sexual_orientation: string | null;
  looking_for_gender: string[] | null;
  relationship_type: string | null;
}

export const useMatchingProfiles = (user: User | null) => {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const initializeProfiles = async () => {
      if (!user) return;

      console.log('Initializing matching profiles...');

      try {
        // First, get the current user's profile and preferences
        const { data: currentUserProfile, error: userError } = await supabase
          .from('profiles')
          .select('id, gender_identity, sexual_orientation, looking_for_gender, relationship_type')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user profile:', userError);
        } else {
          setUserProfile(currentUserProfile);
        }

        // Always start with demo profiles for immediate content
        setProfiles([...demoProfiles]);
        setLoading(false);

        // Then fetch real profiles with matching logic
        let query = supabase
          .from('profiles')
          .select('id, full_name, age, bio, location, interests, looking_for, avatar_url, gender_identity, sexual_orientation, looking_for_gender, relationship_type')
          .neq('id', user.id)
          .eq('profile_completed', true);

        // Apply gender preference filtering if user has preferences set
        if (currentUserProfile?.looking_for_gender && currentUserProfile.looking_for_gender.length > 0) {
          query = query.in('gender_identity', currentUserProfile.looking_for_gender);
        }

        const { data, error } = await query.limit(20);

        if (error) {
          console.error('Supabase query error:', error);
        } else {
          console.log('Real profiles fetched:', data?.length || 0);
          
          if (data && data.length > 0) {
            // Filter for mutual matching - only show profiles where both users match each other's preferences
            const mutualMatches = data.filter(profile => {
              // Check if the other user is looking for the current user's gender
              if (profile.looking_for_gender && profile.looking_for_gender.length > 0 && currentUserProfile?.gender_identity) {
                return profile.looking_for_gender.includes(currentUserProfile.gender_identity);
              }
              // If no specific gender preferences are set, include the profile
              return true;
            });

            console.log('Mutual matches found:', mutualMatches.length);

            // Combine demo profiles with real matching profiles and shuffle
            const allProfiles = [...demoProfiles, ...mutualMatches];
            const shuffledProfiles = allProfiles.sort(() => Math.random() - 0.5);
            console.log('Updated profiles with matching logic:', shuffledProfiles.length);
            setProfiles(shuffledProfiles);
          }
        }
      } catch (error: any) {
        console.error('Error fetching matching profiles:', error);
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
    nextProfile,
    userProfile
  };
};
