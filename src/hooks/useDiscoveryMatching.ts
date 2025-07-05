import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Enhanced profile interface for Discovery matching
export interface EnhancedProfileCard {
  id: string;
  full_name: string | null;
  age: number | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  avatar_url: string | null;
  isDemo?: boolean;
  // Extended fields for detailed modal
  gender_identity: string | null;
  sexual_orientation: string | null;
  relationship_type: string | null;
  looking_for_gender: string[] | null;
  wallet_address: string | null;
  favorite_crypto: string | null;
  crypto_experience: string | null;
  portfolio_size: string | null;
  trading_style: string | null;
  defi_protocols: string[] | null;
  nft_collections: string[] | null;
  meme_coin_holdings: string[] | null;
  biggest_crypto_win: string | null;
  biggest_crypto_loss: string | null;
  crypto_motto: string | null;
  degen_score: number | null;
  username: string | null;
  photo_urls: string[] | null;
}

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
  favorite_crypto: string | null;
  crypto_experience: string | null;
  portfolio_size: string | null;
  trading_style: string | null;
  defi_protocols: string[] | null;
  nft_collections: string[] | null;
  meme_coin_holdings: string[] | null;
  biggest_crypto_win: string | null;
  biggest_crypto_loss: string | null;
  crypto_motto: string | null;
  degen_score: number | null;
  username: string | null;
  photo_urls: string[] | null;
  created_at: string;
  profile_completed: boolean | null;
}

interface DiscoveryFilters {
  maxDistance?: number;
  newThisWeek: boolean;
  ageRange?: { min: number; max: number };
  minCompatibilityScore?: number;
}

interface MatchScore {
  profile: Profile;
  score: number;
  breakdown: {
    genderMatch: number;
    ageCompatibility: number;
    locationScore: number;
    interestMatch: number;
    cryptoCompatibility: number;
    relationshipMatch: number;
  };
}

export const useDiscoveryMatching = (user: User | null) => {
  const [profiles, setProfiles] = useState<EnhancedProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [filters, setFilters] = useState<DiscoveryFilters>({
    newThisWeek: false,
    minCompatibilityScore: 0.5
  });

  // Strict mutual match validation
  const isStrictMutualMatch = (userProfile: Profile, otherProfile: Profile): boolean => {
    // Both users must have gender preferences set for strict matching
    if (!userProfile.looking_for_gender || !otherProfile.looking_for_gender) {
      return false;
    }

    if (userProfile.looking_for_gender.length === 0 || otherProfile.looking_for_gender.length === 0) {
      return false;
    }

    // User wants other's gender AND other wants user's gender
    const userWantsOther = otherProfile.gender_identity && 
      userProfile.looking_for_gender.includes(otherProfile.gender_identity);
    
    const otherWantsUser = userProfile.gender_identity && 
      otherProfile.looking_for_gender.includes(userProfile.gender_identity);

    return userWantsOther && otherWantsUser;
  };

  // Enhanced compatibility scoring with proper mutual matching
  const calculateCompatibilityScore = (userProfile: Profile, otherProfile: Profile): MatchScore => {
    let totalScore = 0;
    const breakdown = {
      genderMatch: 0,
      ageCompatibility: 0,
      locationScore: 0,
      interestMatch: 0,
      cryptoCompatibility: 0,
      relationshipMatch: 0,
    };

    // 1. Strict Gender Mutual Match (30% weight - increased importance)
    const genderWeight = 0.30;
    const isMutualMatch = isStrictMutualMatch(userProfile, otherProfile);
    breakdown.genderMatch = isMutualMatch ? 1.0 : 0;
    totalScore += breakdown.genderMatch * genderWeight;

    // 2. Age Compatibility (15% weight)
    const ageWeight = 0.15;
    let ageScore = 0.5;
    
    if (userProfile.age && otherProfile.age) {
      const ageDiff = Math.abs(userProfile.age - otherProfile.age);
      if (ageDiff <= 2) ageScore = 1.0;
      else if (ageDiff <= 5) ageScore = 0.9;
      else if (ageDiff <= 8) ageScore = 0.7;
      else if (ageDiff <= 12) ageScore = 0.5;
      else if (ageDiff <= 18) ageScore = 0.3;
      else ageScore = 0.1;
    }
    
    breakdown.ageCompatibility = ageScore;
    totalScore += ageScore * ageWeight;

    // 3. Location Score (10% weight)
    const locationWeight = 0.10;
    let locationScore = 0.3;
    
    if (userProfile.location && otherProfile.location) {
      const userLoc = userProfile.location.toLowerCase();
      const otherLoc = otherProfile.location.toLowerCase();
      
      if (userLoc === otherLoc) {
        locationScore = 1.0;
      } else {
        // Check city match
        const userCity = userLoc.split(',')[0]?.trim();
        const otherCity = otherLoc.split(',')[0]?.trim();
        
        // Check state/country match
        const userState = userLoc.split(',').pop()?.trim();
        const otherState = otherLoc.split(',').pop()?.trim();
        
        if (userCity === otherCity) {
          locationScore = 0.9;
        } else if (userState === otherState) {
          locationScore = 0.6;
        } else {
          locationScore = 0.2;
        }
      }
    }
    
    breakdown.locationScore = locationScore;
    totalScore += locationScore * locationWeight;

    // 4. Interest Matching (20% weight)
    const interestWeight = 0.20;
    let interestScore = 0.3;
    
    if (userProfile.interests && otherProfile.interests && 
        userProfile.interests.length > 0 && otherProfile.interests.length > 0) {
      const userInterests = userProfile.interests.map(i => i.toLowerCase());
      const otherInterests = otherProfile.interests.map(i => i.toLowerCase());
      
      const commonInterests = userInterests.filter(interest => 
        otherInterests.some(otherInt => 
          otherInt.includes(interest) || interest.includes(otherInt)
        )
      );
      
      const totalUniqueInterests = new Set([...userInterests, ...otherInterests]).size;
      interestScore = commonInterests.length / Math.min(userInterests.length, otherInterests.length);
      interestScore = Math.min(interestScore, 1.0);
    }
    
    breakdown.interestMatch = interestScore;
    totalScore += interestScore * interestWeight;

    // 5. Crypto Compatibility (15% weight)
    const cryptoWeight = 0.15;
    let cryptoScore = 0.3;
    let cryptoFactors = 0;
    let cryptoSum = 0;
    
    // Favorite crypto match
    if (userProfile.favorite_crypto && otherProfile.favorite_crypto) {
      if (userProfile.favorite_crypto.toLowerCase() === otherProfile.favorite_crypto.toLowerCase()) {
        cryptoSum += 1.0;
      } else {
        cryptoSum += 0.3;
      }
      cryptoFactors++;
    }
    
    // Experience level compatibility
    if (userProfile.crypto_experience && otherProfile.crypto_experience) {
      const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
      const userLevel = levels.indexOf(userProfile.crypto_experience.toLowerCase());
      const otherLevel = levels.indexOf(otherProfile.crypto_experience.toLowerCase());
      
      if (userLevel !== -1 && otherLevel !== -1) {
        const levelDiff = Math.abs(userLevel - otherLevel);
        cryptoSum += levelDiff === 0 ? 1.0 : levelDiff === 1 ? 0.8 : levelDiff === 2 ? 0.5 : 0.3;
      }
      cryptoFactors++;
    }
    
    // Portfolio size compatibility
    if (userProfile.portfolio_size && otherProfile.portfolio_size) {
      const sizeOrder = ['< $1k', '$1k - $10k', '$10k - $100k', '$100k - $1M', '> $1M'];
      const userSize = sizeOrder.indexOf(userProfile.portfolio_size);
      const otherSize = sizeOrder.indexOf(otherProfile.portfolio_size);
      
      if (userSize !== -1 && otherSize !== -1) {
        const sizeDiff = Math.abs(userSize - otherSize);
        cryptoSum += sizeDiff === 0 ? 1.0 : sizeDiff === 1 ? 0.7 : 0.4;
      }
      cryptoFactors++;
    }
    
    if (cryptoFactors > 0) {
      cryptoScore = cryptoSum / cryptoFactors;
    }
    
    breakdown.cryptoCompatibility = cryptoScore;
    totalScore += cryptoScore * cryptoWeight;

    // 6. Relationship Type Match (10% weight)
    const relationshipWeight = 0.10;
    let relationshipScore = 0.5;
    
    if (userProfile.relationship_type && otherProfile.relationship_type) {
      if (userProfile.relationship_type === otherProfile.relationship_type) {
        relationshipScore = 1.0;
      } else {
        const compatibleTypes: Record<string, string[]> = {
          'serious relationship': ['serious relationship', 'open to anything'],
          'casual dating': ['casual dating', 'open to anything', 'friends first'],
          'friends first': ['friends first', 'casual dating', 'serious relationship'],
          'hookups': ['hookups', 'casual dating'],
          'open to anything': ['serious relationship', 'casual dating', 'friends first', 'open to anything']
        };
        
        const userType = userProfile.relationship_type.toLowerCase();
        const otherType = otherProfile.relationship_type.toLowerCase();
        
        if (compatibleTypes[userType]?.includes(otherType)) {
          relationshipScore = 0.7;
        } else {
          relationshipScore = 0.2;
        }
      }
    }
    
    breakdown.relationshipMatch = relationshipScore;
    totalScore += relationshipScore * relationshipWeight;

    return {
      profile: otherProfile,
      score: Math.round(totalScore * 100) / 100,
      breakdown
    };
  };

  // Apply discovery filters
  const applyFilters = (profiles: Profile[]): Profile[] => {
    return profiles.filter(profile => {
      // New This Week filter
      if (filters.newThisWeek) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const profileCreated = new Date(profile.created_at);
        if (profileCreated < weekAgo) return false;
      }

      // Age range filter
      if (filters.ageRange && profile.age) {
        if (profile.age < filters.ageRange.min || profile.age > filters.ageRange.max) {
          return false;
        }
      }

      return true;
    });
  };

  // Convert database profile to ProfileCard format
  const convertToProfileCard = (profile: Profile): EnhancedProfileCard => {
    return {
      id: profile.id,
      full_name: profile.full_name,
      age: profile.age,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests || [],
      looking_for: profile.looking_for,
      avatar_url: profile.avatar_url,
      isDemo: false,
      // Extended fields for detailed modal
      gender_identity: profile.gender_identity,
      sexual_orientation: profile.sexual_orientation,
      relationship_type: profile.relationship_type,
      looking_for_gender: profile.looking_for_gender,
      wallet_address: null,
      favorite_crypto: profile.favorite_crypto,
      crypto_experience: profile.crypto_experience,
      portfolio_size: profile.portfolio_size,
      trading_style: profile.trading_style,
      defi_protocols: profile.defi_protocols,
      nft_collections: profile.nft_collections,
      meme_coin_holdings: profile.meme_coin_holdings,
      biggest_crypto_win: profile.biggest_crypto_win,
      biggest_crypto_loss: profile.biggest_crypto_loss,
      crypto_motto: profile.crypto_motto,
      degen_score: profile.degen_score,
      username: profile.username,
      photo_urls: profile.photo_urls,
    };
  };

  const fetchMatchingProfiles = async () => {
    if (!user) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get current user's profile
      const { data: currentUserProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        setProfiles([]);
        setLoading(false);
        return;
      }

      setUserProfile(currentUserProfile);

      // If user doesn't have gender preferences set, show message
      if (!currentUserProfile.looking_for_gender || currentUserProfile.looking_for_gender.length === 0) {
        console.log('User needs to set gender preferences');
        setProfiles([]);
        setLoading(false);
        return;
      }

      // Fetch potential matches with pre-filtering
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .eq('profile_completed', true)
        .not('full_name', 'is', null)
        .not('looking_for_gender', 'is', null)
        .gte('age', 18); // Ensure only adults (18+) are shown

      // Pre-filter for users who are looking for current user's gender
      if (currentUserProfile.gender_identity) {
        query = query.contains('looking_for_gender', [currentUserProfile.gender_identity]);
      }

      const { data: candidateProfiles, error } = await query.limit(100);

      if (error) {
        console.error('Error fetching profiles:', error);
        setProfiles([]);
        setLoading(false);
        return;
      }

      if (!candidateProfiles || candidateProfiles.length === 0) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      // Apply strict mutual matching filter
      const mutualMatches = candidateProfiles.filter(profile => 
        isStrictMutualMatch(currentUserProfile, profile)
      );

      console.log(`Found ${mutualMatches.length} mutual matches out of ${candidateProfiles.length} candidates`);

      // Apply additional filters
      const filteredProfiles = applyFilters(mutualMatches);

      // Calculate compatibility scores and sort
      const scoredProfiles: MatchScore[] = filteredProfiles.map(profile => 
        calculateCompatibilityScore(currentUserProfile, profile)
      );

      // Filter by minimum compatibility score
      const highQualityMatches = scoredProfiles.filter(match => 
        match.score >= (filters.minCompatibilityScore || 0.5)
      );

      // Sort by score descending
      highQualityMatches.sort((a, b) => b.score - a.score);

      // Convert to ProfileCard format
      const finalProfiles = highQualityMatches.map(match => convertToProfileCard(match.profile));

      console.log(`Final matching profiles: ${finalProfiles.length}`);
      setProfiles(finalProfiles);
      setCurrentIndex(0);

    } catch (error) {
      console.error('Error in discovery matching:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchMatchingProfiles();
  }, [user, filters]);

  // Auto-update with realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Profile changes detected, refreshing matches...');
          fetchMatchingProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, filters]);

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const updateFilters = (newFilters: Partial<DiscoveryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
    userProfile,
    filters,
    updateFilters,
    refreshMatches: fetchMatchingProfiles
  };
};