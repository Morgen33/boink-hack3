
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
  favorite_crypto: string | null;
  crypto_experience: string | null;
  portfolio_size: string | null;
  trading_style: string | null;
  defi_protocols: string[] | null;
  nft_collections: string[] | null;
  meme_coin_holdings: string[] | null;
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

export const useEnhancedMatching = (user: User | null) => {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // Calculate compatibility score between two profiles
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

    // 1. Gender Preference Matching (25% weight)
    const genderWeight = 0.25;
    let genderScore = 0;
    
    // Check if user wants other's gender
    const userWantsOther = !userProfile.looking_for_gender || 
      userProfile.looking_for_gender.length === 0 || 
      (otherProfile.gender_identity && userProfile.looking_for_gender.includes(otherProfile.gender_identity));
    
    // Check if other wants user's gender
    const otherWantsUser = !otherProfile.looking_for_gender || 
      otherProfile.looking_for_gender.length === 0 || 
      (userProfile.gender_identity && otherProfile.looking_for_gender.includes(userProfile.gender_identity));
    
    if (userWantsOther && otherWantsUser) {
      genderScore = 1.0;
    } else if (userWantsOther || otherWantsUser) {
      genderScore = 0.5;
    }
    
    breakdown.genderMatch = genderScore;
    totalScore += genderScore * genderWeight;

    // 2. Age Compatibility (15% weight)
    const ageWeight = 0.15;
    let ageScore = 0;
    
    if (userProfile.age && otherProfile.age) {
      const ageDiff = Math.abs(userProfile.age - otherProfile.age);
      // Perfect score for 0-2 years difference, decreasing linearly
      if (ageDiff <= 2) {
        ageScore = 1.0;
      } else if (ageDiff <= 5) {
        ageScore = 0.8;
      } else if (ageDiff <= 10) {
        ageScore = 0.6;
      } else if (ageDiff <= 15) {
        ageScore = 0.4;
      } else {
        ageScore = 0.2;
      }
    } else {
      ageScore = 0.5; // Neutral if age not provided
    }
    
    breakdown.ageCompatibility = ageScore;
    totalScore += ageScore * ageWeight;

    // 3. Location Score (10% weight)
    const locationWeight = 0.10;
    let locationScore = 0;
    
    if (userProfile.location && otherProfile.location) {
      const userLoc = userProfile.location.toLowerCase();
      const otherLoc = otherProfile.location.toLowerCase();
      
      if (userLoc === otherLoc) {
        locationScore = 1.0; // Same city/location
      } else if (userLoc.includes(otherLoc.split(',')[0]) || otherLoc.includes(userLoc.split(',')[0])) {
        locationScore = 0.8; // Same city, different area
      } else if (userLoc.split(',').pop()?.trim() === otherLoc.split(',').pop()?.trim()) {
        locationScore = 0.6; // Same country/state
      } else {
        locationScore = 0.3; // Different locations
      }
    } else {
      locationScore = 0.5; // Neutral if location not provided
    }
    
    breakdown.locationScore = locationScore;
    totalScore += locationScore * locationWeight;

    // 4. Interest Matching (20% weight)
    const interestWeight = 0.20;
    let interestScore = 0;
    
    if (userProfile.interests && otherProfile.interests && 
        userProfile.interests.length > 0 && otherProfile.interests.length > 0) {
      const userInterests = userProfile.interests.map(i => i.toLowerCase());
      const otherInterests = otherProfile.interests.map(i => i.toLowerCase());
      
      const commonInterests = userInterests.filter(interest => 
        otherInterests.some(otherInt => 
          otherInt.includes(interest) || interest.includes(otherInt)
        )
      );
      
      const totalInterests = Math.max(userInterests.length, otherInterests.length);
      interestScore = commonInterests.length / totalInterests;
    } else {
      interestScore = 0.5; // Neutral if interests not provided
    }
    
    breakdown.interestMatch = interestScore;
    totalScore += interestScore * interestWeight;

    // 5. Crypto Compatibility (20% weight)
    const cryptoWeight = 0.20;
    let cryptoScore = 0;
    let cryptoFactors = 0;
    
    // Favorite crypto match
    if (userProfile.favorite_crypto && otherProfile.favorite_crypto) {
      if (userProfile.favorite_crypto.toLowerCase() === otherProfile.favorite_crypto.toLowerCase()) {
        cryptoScore += 0.3;
      }
      cryptoFactors++;
    }
    
    // Experience level compatibility
    if (userProfile.crypto_experience && otherProfile.crypto_experience) {
      const experienceLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
      const userLevel = experienceLevels.indexOf(userProfile.crypto_experience.toLowerCase());
      const otherLevel = experienceLevels.indexOf(otherProfile.crypto_experience.toLowerCase());
      
      if (userLevel !== -1 && otherLevel !== -1) {
        const levelDiff = Math.abs(userLevel - otherLevel);
        cryptoScore += levelDiff === 0 ? 0.3 : levelDiff === 1 ? 0.2 : 0.1;
      }
      cryptoFactors++;
    }
    
    // Portfolio size compatibility
    if (userProfile.portfolio_size && otherProfile.portfolio_size) {
      if (userProfile.portfolio_size === otherProfile.portfolio_size) {
        cryptoScore += 0.2;
      }
      cryptoFactors++;
    }
    
    // Trading style match
    if (userProfile.trading_style && otherProfile.trading_style) {
      if (userProfile.trading_style.toLowerCase() === otherProfile.trading_style.toLowerCase()) {
        cryptoScore += 0.2;
      }
      cryptoFactors++;
    }
    
    // DeFi protocols overlap
    if (userProfile.defi_protocols && otherProfile.defi_protocols) {
      const userProtocols = userProfile.defi_protocols.map(p => p.toLowerCase());
      const otherProtocols = otherProfile.defi_protocols.map(p => p.toLowerCase());
      const commonProtocols = userProtocols.filter(p => otherProtocols.includes(p));
      
      if (commonProtocols.length > 0) {
        cryptoScore += Math.min(commonProtocols.length / Math.max(userProtocols.length, otherProtocols.length), 0.3);
      }
      cryptoFactors++;
    }
    
    if (cryptoFactors > 0) {
      cryptoScore = cryptoScore / cryptoFactors;
    } else {
      cryptoScore = 0.5; // Neutral if no crypto info
    }
    
    breakdown.cryptoCompatibility = cryptoScore;
    totalScore += cryptoScore * cryptoWeight;

    // 6. Relationship Type Match (10% weight)
    const relationshipWeight = 0.10;
    let relationshipScore = 0;
    
    if (userProfile.relationship_type && otherProfile.relationship_type) {
      if (userProfile.relationship_type === otherProfile.relationship_type) {
        relationshipScore = 1.0;
      } else {
        // Some compatibility between different relationship types
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
          relationshipScore = 0.3;
        }
      }
    } else {
      relationshipScore = 0.5; // Neutral if not specified
    }
    
    breakdown.relationshipMatch = relationshipScore;
    totalScore += relationshipScore * relationshipWeight;

    return {
      profile: otherProfile,
      score: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
      breakdown
    };
  };

  useEffect(() => {
    const initializeProfiles = async () => {
      if (!user) return;

      console.log('Initializing enhanced matching profiles...');

      try {
        // Get the current user's profile and preferences
        const { data: currentUserProfile, error: userError } = await supabase
          .from('profiles')
          .select('*')
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

        // Fetch real profiles
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id, full_name, age, bio, location, interests, looking_for, avatar_url, 
            gender_identity, sexual_orientation, looking_for_gender, relationship_type,
            favorite_crypto, crypto_experience, portfolio_size, trading_style,
            defi_protocols, nft_collections, meme_coin_holdings
          `)
          .neq('id', user.id)
          .eq('profile_completed', true)
          .limit(50); // Get more profiles for better matching

        if (error) {
          console.error('Supabase query error:', error);
        } else if (data && data.length > 0 && currentUserProfile) {
          console.log('Real profiles fetched:', data.length);
          
          // Calculate compatibility scores for all profiles
          const scoredProfiles: MatchScore[] = data.map(profile => 
            calculateCompatibilityScore(currentUserProfile, profile)
          );

          // Sort by compatibility score (highest first)
          scoredProfiles.sort((a, b) => b.score - a.score);

          // Filter for minimum compatibility (e.g., score > 0.3)
          const compatibleProfiles = scoredProfiles.filter(match => match.score > 0.3);

          console.log('Compatible matches found:', compatibleProfiles.length);
          console.log('Top matches:', compatibleProfiles.slice(0, 5).map(m => ({
            name: m.profile.full_name,
            score: m.score,
            breakdown: m.breakdown
          })));

          // Convert back to ProfileCard format and combine with demos
          const matchedProfiles = compatibleProfiles.map(match => match.profile);
          const allProfiles = [...demoProfiles, ...matchedProfiles];
          
          setProfiles(allProfiles);
        }
      } catch (error: any) {
        console.error('Error in enhanced matching:', error);
        // Demo profiles are already set
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
