import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileCard } from '@/data/demoProfiles';
import { User } from '@supabase/supabase-js';
import { useUserBlocks } from './useUserBlocks';

interface DailyMatch {
  id: string;
  matched_profile_id: string;
  compatibility_score: number;
  match_breakdown: any; // JSONB from database
  generated_at: string;
  expires_at: string;
  viewed: boolean;
  liked: boolean | null;
}

interface DailyMatchWithProfile extends DailyMatch {
  profile: ProfileCard;
}

export const useDailyMatches = (user: User | null) => {
  const [matches, setMatches] = useState<DailyMatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isUserBlocked } = useUserBlocks();

  useEffect(() => {
    const fetchDailyMatches = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('Fetching daily matches for user:', user.id);
      setLoading(true);
      setError(null);

      try {
        // Fetch daily matches that haven't expired
        const { data: dailyMatches, error: matchesError } = await supabase
          .from('daily_matches')
          .select(`
            id,
            matched_profile_id,
            compatibility_score,
            match_breakdown,
            generated_at,
            expires_at,
            viewed,
            liked
          `)
          .eq('user_id', user.id)
          .gt('expires_at', new Date().toISOString())
          .order('compatibility_score', { ascending: false });

        if (matchesError) {
          console.error('Error fetching daily matches:', matchesError);
          setError('Failed to load daily matches');
          return;
        }

        if (!dailyMatches || dailyMatches.length === 0) {
          console.log('No daily matches found');
          setMatches([]);
          return;
        }

        console.log('Found daily matches:', dailyMatches.length);

        // Get the profile details for each match
        const profileIds = dailyMatches.map(match => match.matched_profile_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, age, bio, location, interests, looking_for, avatar_url')
          .in('id', profileIds);

        if (profilesError) {
          console.error('Error fetching match profiles:', profilesError);
          setError('Failed to load match profiles');
          return;
        }

        // Combine matches with profile data and filter blocked users
        const matchesWithProfiles: DailyMatchWithProfile[] = dailyMatches.map(match => {
          const profile = profiles?.find(p => p.id === match.matched_profile_id);
          return {
            ...match,
            profile: {
              id: profile?.id || '',
              full_name: profile?.full_name || null,
              age: profile?.age || null,
              bio: profile?.bio || null,
              location: profile?.location || null,
              interests: profile?.interests || [],
              looking_for: profile?.looking_for || null,
              avatar_url: profile?.avatar_url || null,
              isDemo: false
            }
          };
        }).filter(match => match.profile.id && !isUserBlocked(match.profile.id)); // Filter out blocked users

        console.log('Daily matches with profiles:', matchesWithProfiles.length);
        setMatches(matchesWithProfiles);

      } catch (error: any) {
        console.error('Error in useDailyMatches:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyMatches();
  }, [user]);

  const markAsViewed = async (matchId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_matches')
        .update({ viewed: true })
        .eq('id', matchId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking match as viewed:', error);
      } else {
        // Update local state
        setMatches(prev => prev.map(match => 
          match.id === matchId ? { ...match, viewed: true } : match
        ));
      }
    } catch (error) {
      console.error('Error updating match viewed status:', error);
    }
  };

  const markAsLiked = async (matchId: string, liked: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_matches')
        .update({ liked, viewed: true })
        .eq('id', matchId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking match as liked:', error);
      } else {
        // Update local state
        setMatches(prev => prev.map(match => 
          match.id === matchId ? { ...match, liked, viewed: true } : match
        ));
      }
    } catch (error) {
      console.error('Error updating match liked status:', error);
    }
  };

  const nextMatch = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentMatch = matches[currentIndex];
  const hasMoreMatches = currentIndex < matches.length - 1;

  return {
    matches,
    loading,
    error,
    currentIndex,
    currentMatch,
    hasMoreMatches,
    nextMatch,
    markAsViewed,
    markAsLiked
  };
};