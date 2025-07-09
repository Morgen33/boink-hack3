import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompatibilityRequest {
  userId: string;
  targetUserId: string;
}

const calculateVectorSimilarity = (vector1: number[], vector2: number[]): number => {
  if (!vector1 || !vector2 || vector1.length !== vector2.length) {
    return 0;
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    norm1 += vector1[i] * vector1[i];
    norm2 += vector2[i] * vector2[i];
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

const calculatePersonalityCompatibility = (traits1: any, traits2: any): number => {
  if (!traits1 || !traits2) return 0.5;

  // Calculate compatibility based on complementary and similar traits
  const opennessDiff = Math.abs(traits1.openness - traits2.openness);
  const conscientiousnessMatch = 1 - Math.abs(traits1.conscientiousness - traits2.conscientiousness);
  const extraversionBalance = Math.abs(traits1.extraversion - traits2.extraversion) < 0.3 ? 0.9 : 0.6;
  const agreeableness = (traits1.agreeableness + traits2.agreeableness) / 2;
  const stabilityMatch = 1 - Math.abs(traits1.neuroticism - traits2.neuroticism);
  const riskAlignment = 1 - Math.abs(traits1.risk_tolerance - traits2.risk_tolerance);

  return (
    (1 - opennessDiff) * 0.15 +
    conscientiousnessMatch * 0.20 +
    extraversionBalance * 0.15 +
    agreeableness * 0.15 +
    stabilityMatch * 0.15 +
    riskAlignment * 0.20
  );
};

const generateCompatibilityInsights = async (user1: any, user2: any, scores: any) => {
  const openaiApiKey = Deno.env.get('OPEN_API');
  if (!openaiApiKey) {
    return {
      explanation: "High compatibility based on shared interests and values.",
      conversationStarters: ["What got you into crypto?", "Tell me about your investment strategy"],
      sharedInterests: [],
      personalityHighlights: "Great personality match",
      cryptoCommonGround: "Similar crypto philosophies"
    };
  }

  const prompt = `
Based on these two dating profiles, generate compatibility insights:

Profile 1:
- Bio: ${user1.bio || 'No bio'}
- Interests: ${user1.interests?.join(', ') || 'None'}
- Crypto Philosophy: ${user1.crypto_philosophy || 'Unknown'}
- Communication Style: ${user1.communication_style || 'Unknown'}
- Personality Traits: ${JSON.stringify(user1.personality_traits || {})}

Profile 2:
- Bio: ${user2.bio || 'No bio'}
- Interests: ${user2.interests?.join(', ') || 'None'}
- Crypto Philosophy: ${user2.crypto_philosophy || 'Unknown'}
- Communication Style: ${user2.communication_style || 'Unknown'}
- Personality Traits: ${JSON.stringify(user2.personality_traits || {})}

Compatibility Scores:
- Overall: ${(scores.overall * 100).toFixed(0)}%
- Personality Match: ${(scores.personality * 100).toFixed(0)}%
- Crypto Alignment: ${(scores.crypto * 100).toFixed(0)}%

Return ONLY a JSON object with this structure:
{
  "explanation": "A warm, engaging 2-3 sentence explanation of why they're compatible",
  "conversationStarters": ["3-4 specific conversation starters based on their profiles"],
  "sharedInterests": ["list of shared interests found"],
  "personalityHighlights": "Brief highlight of personality compatibility",
  "cryptoCommonGround": "What they have in common crypto-wise"
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a dating compatibility expert. Generate warm, positive insights that help people connect. Be specific and personal based on their profiles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      explanation: "You share common interests and complementary personalities that could lead to great conversations.",
      conversationStarters: ["What's your favorite crypto project right now?", "How did you get started in crypto?"],
      sharedInterests: [],
      personalityHighlights: "Compatible personalities",
      cryptoCommonGround: "Shared crypto interests"
    };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Verify user JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const { userId, targetUserId } = await req.json();

    // Verify user can only analyze their own compatibility
    if (userId !== user.id) {
      throw new Error('Unauthorized: Can only analyze your own compatibility');
    }

    if (!userId || !targetUserId) {
      throw new Error('Both userId and targetUserId are required');
    }

    console.log(`Calculating AI compatibility between ${userId} and ${targetUserId}`);

    // Switch to service role for database operations
    const supabaseAdmin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Get embeddings and profiles for both users
    const { data: userEmbedding } = await supabaseAdmin
      .from('profile_embeddings')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: targetEmbedding } = await supabaseAdmin
      .from('profile_embeddings')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: targetProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (!userProfile || !targetProfile) {
      throw new Error('User profiles not found');
    }

    // Calculate various compatibility scores
    let bioSimilarity = 0.5;
    let interestsSimilarity = 0.5;
    let personalityMatch = 0.5;
    let communicationCompatibility = 0.7;
    let cryptoAlignment = 0.6;

    // Vector similarity for bio and interests
    if (userEmbedding?.bio_embedding && targetEmbedding?.bio_embedding) {
      bioSimilarity = calculateVectorSimilarity(
        userEmbedding.bio_embedding,
        targetEmbedding.bio_embedding
      );
    }

    if (userEmbedding?.interests_embedding && targetEmbedding?.interests_embedding) {
      interestsSimilarity = calculateVectorSimilarity(
        userEmbedding.interests_embedding,
        targetEmbedding.interests_embedding
      );
    }

    // Personality compatibility
    if (userEmbedding?.personality_traits && targetEmbedding?.personality_traits) {
      personalityMatch = calculatePersonalityCompatibility(
        userEmbedding.personality_traits,
        targetEmbedding.personality_traits
      );
    }

    // Communication style compatibility
    if (userEmbedding?.communication_style && targetEmbedding?.communication_style) {
      const styles = [userEmbedding.communication_style, targetEmbedding.communication_style];
      if (styles[0] === styles[1]) {
        communicationCompatibility = 0.9;
      } else if (
        (styles.includes('casual') && styles.includes('playful')) ||
        (styles.includes('formal') && styles.includes('direct'))
      ) {
        communicationCompatibility = 0.8;
      }
    }

    // Crypto alignment
    if (userProfile.favorite_crypto && targetProfile.favorite_crypto) {
      if (userProfile.favorite_crypto.toLowerCase() === targetProfile.favorite_crypto.toLowerCase()) {
        cryptoAlignment = 0.9;
      } else {
        cryptoAlignment = 0.6;
      }
    }

    // Calculate overall AI compatibility score
    const overallScore = (
      bioSimilarity * 0.25 +
      interestsSimilarity * 0.20 +
      personalityMatch * 0.25 +
      communicationCompatibility * 0.15 +
      cryptoAlignment * 0.15
    );

    // Generate insights
    const insights = await generateCompatibilityInsights(
      { ...userProfile, ...userEmbedding },
      { ...targetProfile, ...targetEmbedding },
      {
        overall: overallScore,
        personality: personalityMatch,
        crypto: cryptoAlignment
      }
    );

    // Store compatibility scores
    const compatibilityData = {
      user_id: userId,
      target_user_id: targetUserId,
      compatibility_score: Math.round(overallScore * 100) / 100,
      personality_match: Math.round(personalityMatch * 100) / 100,
      communication_compatibility: Math.round(communicationCompatibility * 100) / 100,
      crypto_alignment: Math.round(cryptoAlignment * 100) / 100,
      shared_values_score: Math.round(((bioSimilarity + interestsSimilarity) / 2) * 100) / 100,
    };

    const { error: compatibilityError } = await supabaseAdmin
      .from('ai_compatibility_scores')
      .upsert(compatibilityData, { onConflict: 'user_id,target_user_id' });

    if (compatibilityError) {
      console.error('Error storing compatibility scores:', compatibilityError);
    }

    // Store insights
    const insightsData = {
      user_id: userId,
      target_user_id: targetUserId,
      compatibility_explanation: insights.explanation,
      conversation_starters: insights.conversationStarters,
      shared_interests: insights.sharedInterests,
      personality_highlights: insights.personalityHighlights,
      crypto_common_ground: insights.cryptoCommonGround,
      ai_confidence: Math.round(overallScore * 100) / 100,
    };

    const { error: insightsError } = await supabaseAdmin
      .from('match_insights')
      .upsert(insightsData, { onConflict: 'user_id,target_user_id' });

    if (insightsError) {
      console.error('Error storing insights:', insightsError);
    }

    console.log(`AI compatibility calculated: ${(overallScore * 100).toFixed(1)}%`);

    return new Response(JSON.stringify({
      success: true,
      compatibilityScore: overallScore,
      breakdown: {
        bioSimilarity,
        interestsSimilarity,
        personalityMatch,
        communicationCompatibility,
        cryptoAlignment,
      },
      insights,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in ai-enhanced-matching function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});