import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileAnalysisRequest {
  userId: string;
  bio?: string;
  interests?: string[];
  cryptoExperience?: string;
  favoriteCrypto?: string;
  tradingStyle?: string;
  cryptoMotto?: string;
}

interface PersonalityTraits {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  risk_tolerance: number;
  communication_style: string;
  investment_philosophy: string;
}

const analyzeProfileWithAI = async (profile: ProfileAnalysisRequest) => {
  const openaiApiKey = Deno.env.get('OPEN_API');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Create comprehensive profile text for analysis
  const profileText = `
    Bio: ${profile.bio || 'No bio provided'}
    Interests: ${profile.interests?.join(', ') || 'None specified'}
    Crypto Experience: ${profile.cryptoExperience || 'Not specified'}
    Favorite Crypto: ${profile.favoriteCrypto || 'Not specified'}
    Trading Style: ${profile.tradingStyle || 'Not specified'}
    Crypto Motto: ${profile.cryptoMotto || 'None'}
  `.trim();

  // Analyze personality traits
  const personalityResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
          content: `You are a psychology expert analyzing dating profiles for compatibility matching. Based on the profile text, analyze personality traits and provide a JSON response with scores 0-1 for each trait.

Return ONLY a JSON object with this exact structure:
{
  "openness": 0.7,
  "conscientiousness": 0.6,
  "extraversion": 0.8,
  "agreeableness": 0.9,
  "neuroticism": 0.3,
  "risk_tolerance": 0.8,
  "communication_style": "casual" | "formal" | "playful" | "direct",
  "investment_philosophy": "conservative" | "moderate" | "aggressive" | "speculative",
  "crypto_philosophy": "A brief description of their crypto investment approach and beliefs"
}`
        },
        {
          role: 'user',
          content: profileText
        }
      ],
      temperature: 0.1,
    }),
  });

  const personalityData = await personalityResponse.json();
  const personalityTraits = JSON.parse(personalityData.choices[0].message.content);

  // Generate embeddings for bio and interests
  const embeddingPromises = [];
  
  if (profile.bio) {
    embeddingPromises.push(
      fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: profile.bio,
        }),
      })
    );
  }

  if (profile.interests && profile.interests.length > 0) {
    embeddingPromises.push(
      fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: profile.interests.join(', '),
        }),
      })
    );
  }

  const embeddingResponses = await Promise.all(embeddingPromises);
  const embeddings = await Promise.all(
    embeddingResponses.map(response => response.json())
  );

  return {
    personalityTraits,
    bioEmbedding: embeddings[0]?.data[0]?.embedding || null,
    interestsEmbedding: embeddings[1]?.data[0]?.embedding || null,
  };
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

    const { userId, bio, interests, cryptoExperience, favoriteCrypto, tradingStyle, cryptoMotto } = await req.json();

    // Verify user can only analyze their own profile
    if (userId !== user.id) {
      throw new Error('Unauthorized: Can only analyze your own profile');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log(`Analyzing profile for user: ${userId}`);

    // Switch to service role for database operations
    const supabaseAdmin = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Check if profile analysis already exists
    const { data: existingEmbedding } = await supabaseAdmin
      .from('profile_embeddings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Perform AI analysis
    const analysisResult = await analyzeProfileWithAI({
      userId,
      bio,
      interests,
      cryptoExperience,
      favoriteCrypto,
      tradingStyle,
      cryptoMotto,
    });

    // Store or update embeddings and personality data
    const embedData = {
      user_id: userId,
      bio_embedding: analysisResult.bioEmbedding,
      interests_embedding: analysisResult.interestsEmbedding,
      personality_traits: analysisResult.personalityTraits,
      crypto_philosophy: analysisResult.personalityTraits.crypto_philosophy,
      communication_style: analysisResult.personalityTraits.communication_style,
    };

    if (existingEmbedding) {
      const { error: updateError } = await supabaseAdmin
        .from('profile_embeddings')
        .update(embedData)
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('profile_embeddings')
        .insert(embedData);

      if (insertError) throw insertError;
    }

    console.log(`Profile analysis completed for user: ${userId}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Profile analysis completed',
      personalityTraits: analysisResult.personalityTraits,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in ai-profile-analysis function:', error);
    
    // Sanitize error message for client response  
    const sanitizedError = error.message?.includes('API') 
      ? 'AI analysis service temporarily unavailable'
      : error.message?.includes('permission') 
      ? 'Access denied'
      : 'Profile analysis error';
    
    return new Response(JSON.stringify({ error: sanitizedError }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});