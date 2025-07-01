
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
    let genderScore = 0.7; // Default to reasonable compatibility
    
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
      genderScore = 0.7;
    }
    
    breakdown.genderMatch = genderScore;
    totalScore += genderScore * genderWeight;

    // 2. Age Compatibility (15% weight)
    const ageWeight = 0.15;
    let ageScore = 0.7; // Default reasonable score
    
    if (userProfile.age && otherProfile.age) {
      const ageDiff = Math.abs(userProfile.age - otherProfile.age);
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
    }
    
    breakdown.ageCompatibility = ageScore;
    totalScore += ageScore * ageWeight;

    // 3. Location Score (10% weight)
    const locationWeight = 0.10;
    let locationScore = 0.5; // Default neutral score
    
    if (userProfile.location && otherProfile.location) {
      const userLoc = userProfile.location.toLowerCase();
      const otherLoc = otherProfile.location.toLowerCase();
      
      if (userLoc === otherLoc) {
        locationScore = 1.0;
      } else if (userLoc.includes(otherLoc.split(',')[0]) || otherLoc.includes(userLoc.split(',')[0])) {
        locationScore = 0.8;
      } else if (userLoc.split(',').pop()?.trim() === otherLoc.split(',').pop()?.trim()) {
        locationScore = 0.6;
      } else {
        locationScore = 0.3;
      }
    }
    
    breakdown.locationScore = locationScore;
    totalScore += locationScore * locationWeight;

    // 4. Interest Matching (20% weight)
    const interestWeight = 0.20;
    let interestScore = 0.5; // Default neutral score
    
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
    }
    
    breakdown.interestMatch = interestScore;
    totalScore += interestScore * interestWeight;

    // 5. Crypto Compatibility (20% weight)
    const cryptoWeight = 0.20;
    let cryptoScore = 0.5; // Default neutral score
    let cryptoFactors = 0;
    
    if (userProfile.favorite_crypto && otherProfile.favorite_crypto) {
      if (userProfile.favorite_crypto.toLowerCase() === otherProfile.favorite_crypto.toLowerCase()) {
        cryptoScore += 0.3;
      }
      cryptoFactors++;
    }
    
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
    
    if (userProfile.portfolio_size && otherProfile.portfolio_size) {
      if (userProfile.portfolio_size === otherProfile.portfolio_size) {
        cryptoScore += 0.2;
      }
      cryptoFactors++;
    }
    
    if (userProfile.trading_style && otherProfile.trading_style) {
      if (userProfile.trading_style.toLowerCase() === otherProfile.trading_style.toLowerCase()) {
        cryptoScore += 0.2;
      }
      cryptoFactors++;
    }
    
    if (cryptoFactors > 0) {
      cryptoScore = cryptoScore / cryptoFactors;
    }
    
    breakdown.cryptoCompatibility = cryptoScore;
    totalScore += cryptoScore * cryptoWeight;

    // 6. Relationship Type Match (10% weight)
    const relationshipWeight = 0.10;
    let relationshipScore = 0.7; // Default good compatibility
    
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
          relationshipScore = 0.4;
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

  // Convert database profile to ProfileCard format
  const convertToProfileCard = (profile: Profile): ProfileCard => {
    return {
      id: profile.id,
      full_name: profile.full_name,
      age: profile.age,
      bio: profile.bio,
      location: profile.location,
      interests: profile.interests || [],
      looking_for: profile.looking_for,
      avatar_url: profile.avatar_url,
      isDemo: false
    };
  };

  useEffect(() => {
    const initializeProfiles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      console.log('Initializing enhanced matching profiles...');

      try {
        // Get the current user's profile
        const { data: currentUserProfile, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user profile:', userError);
        } else {
          console.log('User profile loaded:', currentUserProfile);
          setUserProfile(currentUserProfile);
        }

        // Fetch real profiles with more lenient criteria
        const { data: realProfiles, error } = await supabase
          .from('profiles')
          .select(`
            id, full_name, age, bio, location, interests, looking_for, avatar_url, 
            gender_identity, sexual_orientation, looking_for_gender, relationship_type,
            favorite_crypto, crypto_experience, portfolio_size, trading_style,
            defi_protocols, nft_collections, meme_coin_holdings
          `)
          .neq('id', user.id)
          .not('full_name', 'is', null); // Only require full_name to be set

        if (error) {
          console.error('Supabase query error:', error);
        } else if (realProfiles && realProfiles.length > 0) {
          console.log('Real profiles fetched:', realProfiles.length);
          console.log('Sample profile:', realProfiles[0]);
          
          // Convert real profiles to ProfileCard format
          const convertedProfiles = realProfiles.map(convertToProfileCard);
          
          if (currentUserProfile) {
            // Calculate compatibility scores for profiles with enough data
            const scoredProfiles: MatchScore[] = realProfiles.map(profile => 
              calculateCompatibilityScore(currentUserProfile, profile)
            );

            // Sort by compatibility score (highest first) but be more lenient with minimum score
            scoredProfiles.sort((a, b) => b.score - a.score);
            
            // Much lower minimum compatibility threshold to show more profiles
            const compatibleProfiles = scoredProfiles.filter(match => match.score > 0.1);

            console.log('Compatible matches found:', compatibleProfiles.length);
            console.log('Top matches:', compatibleProfiles.slice(0, 3).map(m => ({
              name: m.profile.full_name,
              score: m.score,
              breakdown: m.breakdown
            })));

            // Convert back to ProfileCard format and prioritize real profiles
            const matchedProfiles = compatibleProfiles.map(match => convertToProfileCard(match.profile));
            
            // Put real profiles first, then demo profiles
            const allProfiles = [...matchedProfiles, ...demoProfiles];
            
            setProfiles(allProfiles);
          } else {
            // If no user profile for matching, show all real profiles first
            const allProfiles = [...convertedProfiles, ...demoProfiles];
            setProfiles(allProfiles);
          }
        } else {
          console.log('No real profiles found - showing only demo profiles');
          setProfiles([...demoProfiles]);
        }
      } catch (error: any) {
        console.error('Error in enhanced matching:', error);
        // Fallback to demo profiles
        setProfiles([...demoProfiles]);
      } finally {
        setLoading(false);
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
