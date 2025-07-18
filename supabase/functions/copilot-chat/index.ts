
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const openAIApiKey = Deno.env.get('OPEN_API');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
    // Initialize Supabase client for context
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get user profile for context
    let userContext = '';
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile) {
        userContext = `User Profile Context:
- Name: ${profile.full_name || 'Not set'}
- Age: ${profile.age || 'Not set'}
- Bio: ${profile.bio || 'Not set'}
- Crypto Experience: ${profile.crypto_experience || 'Not set'}
- Favorite Crypto: ${profile.favorite_crypto || 'Not set'}
- Platform Intent: ${profile.platform_intent || 'Not set'}
- Profile Completed: ${profile.profile_completed ? 'Yes' : 'No'}
- Location: ${profile.location || 'Not set'}
- Interests: ${profile.interests?.join(', ') || 'Not set'}`;
      }
    }

    const systemPrompt = `You are BOINK AI, an intelligent assistant for a crypto dating and networking platform. You help users with:

1. **Crypto Dating Advice**: Help users understand crypto compatibility, suggest conversation starters about DeFi, NFTs, trading styles, and crypto philosophy.

2. **Profile Optimization**: Guide users to complete their profiles, suggest improvements, and explain how different fields affect matching.

3. **Platform Navigation**: Help users understand features like daily matches, discovery, messaging, and networking.

4. **Crypto Knowledge**: Answer questions about cryptocurrencies, DeFi protocols, NFTs, trading strategies, and market trends.

5. **Relationship Guidance**: Provide dating advice specifically for crypto enthusiasts, including how to discuss finances, investment philosophies, and shared crypto goals.

Key Platform Features to Reference:
- Daily AI-powered matches based on crypto compatibility
- Discovery for browsing profiles
- Networking for professional crypto connections
- Games like "This or That" for crypto preferences
- Profile completion affects match quality
- Both dating and networking modes available

Personality: Be friendly, knowledgeable about crypto, supportive, and slightly playful. Use crypto terminology naturally but explain complex concepts. Be encouraging about both dating and professional networking in the crypto space.

${userContext}

Always be helpful and try to guide users to complete their profiles and engage with matches if their profile seems incomplete.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      message: data.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in copilot-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat request',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
