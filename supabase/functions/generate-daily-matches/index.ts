import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Calculate compatibility score (same algorithm as useEnhancedMatching)
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
  let genderScore = 0.7;
  
  const userWantsOther = !userProfile.looking_for_gender || 
    userProfile.looking_for_gender.length === 0 || 
    (otherProfile.gender_identity && userProfile.looking_for_gender.includes(otherProfile.gender_identity));
  
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
  let ageScore = 0.7;
  
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
  let locationScore = 0.5;
  
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
  let interestScore = 0.5;
  
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
  let cryptoScore = 0.5;
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
  let relationshipScore = 0.7;
  
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting daily match generation...');

    // Get all users with completed profiles
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_completed', true)
      .not('full_name', 'is', null);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    if (!users || users.length === 0) {
      console.log('No users found with completed profiles');
      return new Response(JSON.stringify({ message: 'No users to generate matches for' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating matches for ${users.length} users`);
    let totalMatches = 0;

    // Generate matches for each user
    for (const user of users) {
      console.log(`Generating matches for user ${user.id}`);

      // Clean up expired matches for this user
      await supabase
        .from('daily_matches')
        .delete()
        .eq('user_id', user.id)
        .lt('expires_at', new Date().toISOString());

      // Check if user already has fresh matches (within last 24 hours)
      const { data: existingMatches } = await supabase
        .from('daily_matches')
        .select('id')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (existingMatches && existingMatches.length > 0) {
        console.log(`User ${user.id} already has fresh matches, skipping`);
        continue;
      }

      // Get profiles user has already been shown (last 30 days)
      const { data: shownProfiles } = await supabase
        .from('match_history')
        .select('shown_profile_id')
        .eq('user_id', user.id)
        .gt('shown_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const shownProfileIds = shownProfiles?.map(p => p.shown_profile_id) || [];

      // Get potential matches (exclude self and previously shown profiles)
      const { data: potentialMatches, error: matchesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .eq('profile_completed', true)
        .not('full_name', 'is', null)
        .not('id', 'in', `(${shownProfileIds.map(id => `'${id}'`).join(',') || "''"})`)
        .limit(50);

      if (matchesError) {
        console.error(`Error fetching potential matches for user ${user.id}:`, matchesError);
        continue;
      }

      if (!potentialMatches || potentialMatches.length === 0) {
        console.log(`No new potential matches for user ${user.id}`);
        continue;
      }

      // Calculate compatibility scores
      const scoredMatches: MatchScore[] = potentialMatches.map(match => 
        calculateCompatibilityScore(user, match)
      );

      // Sort by score and take top 3
      scoredMatches.sort((a, b) => b.score - a.score);
      const topMatches = scoredMatches.slice(0, 3);

      if (topMatches.length === 0) {
        console.log(`No high-quality matches found for user ${user.id}`);
        continue;
      }

      // Store daily matches
      const matchesToInsert = topMatches.map(match => ({
        user_id: user.id,
        matched_profile_id: match.profile.id,
        compatibility_score: match.score,
        match_breakdown: match.breakdown,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));

      const { error: insertError } = await supabase
        .from('daily_matches')
        .insert(matchesToInsert);

      if (insertError) {
        console.error(`Error inserting matches for user ${user.id}:`, insertError);
        continue;
      }

      // Update match history
      const historyToInsert = topMatches.map(match => ({
        user_id: user.id,
        shown_profile_id: match.profile.id
      }));

      await supabase
        .from('match_history')
        .insert(historyToInsert);

      totalMatches += topMatches.length;
      console.log(`Generated ${topMatches.length} matches for user ${user.id}`);
    }

    // Clean up old data
    await supabase.rpc('cleanup_expired_matches');

    console.log(`Daily match generation complete. Generated ${totalMatches} total matches.`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Generated ${totalMatches} daily matches`,
      usersProcessed: users.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-daily-matches function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});