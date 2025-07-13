import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModerationRequest {
  imageBase64: string;
  context: 'profile_photos' | 'meme_images';
}

interface ModerationResponse {
  approved: boolean;
  reason: string;
  confidence: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPEN_API') || Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { imageBase64, context }: ModerationRequest = await req.json();

    if (!imageBase64 || !context) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: imageBase64 and context' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create context-specific prompts
    let systemPrompt = '';
    let analysisPrompt = '';

    if (context === 'profile_photos') {
      systemPrompt = `You are an AI image moderator for a dating/networking platform. Your job is to verify that profile photos contain real people and are appropriate.

APPROVE if the image shows:
- A real person (selfie, portrait, or casual photo)
- Clear human face(s)
- Appropriate, non-explicit content

REJECT if the image shows:
- Memes, cartoons, or animated characters
- No people (landscapes, objects, etc.)
- Inappropriate or explicit content
- Multiple unrelated people (like group photos with strangers)
- Celebrities or public figures
- Screenshots or heavily filtered/distorted images

Respond with JSON: {"approved": boolean, "reason": string, "confidence": number}`;

      analysisPrompt = 'Analyze this image to determine if it\'s suitable as a profile photo. Is this a real person in an appropriate photo?';
    } else {
      systemPrompt = `You are an AI image moderator for a meme section of a crypto dating/networking platform. Your job is to verify that uploaded images are memes or funny content, NOT personal photos.

APPROVE if the image shows:
- Memes (crypto memes, wojaks, pepe, etc.)
- Funny images or reaction GIFs
- Screenshots of funny tweets or posts
- Crypto-related humor or jokes
- General internet humor/memes

REJECT if the image shows:
- Personal photos or selfies
- Real people in casual/personal photos
- Inappropriate or explicit content
- Offensive or hateful content
- Non-meme content (regular photos, landscapes, etc.)

Respond with JSON: {"approved": boolean, "reason": string, "confidence": number}`;

      analysisPrompt = 'Analyze this image to determine if it\'s a meme or funny content suitable for a meme section. Make sure it\'s NOT a personal photo of someone.';
    }

    console.log(`Analyzing image for context: ${context}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI moderation response:', aiResponse);

    try {
      const moderationResult: ModerationResponse = JSON.parse(aiResponse);
      
      // Ensure the response has the expected structure
      if (typeof moderationResult.approved !== 'boolean') {
        throw new Error('Invalid AI response format');
      }

      console.log(`Moderation result for ${context}:`, moderationResult);

      return new Response(
        JSON.stringify(moderationResult),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Raw response:', aiResponse);
      
      // Fallback: try to determine approval based on keywords in response
      const lowercaseResponse = aiResponse.toLowerCase();
      const approved = lowercaseResponse.includes('approve') || lowercaseResponse.includes('suitable');
      
      return new Response(
        JSON.stringify({
          approved,
          reason: approved ? 'Image appears appropriate' : 'Image may not meet guidelines',
          confidence: 0.5
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('Error in ai-image-moderation function:', error);
    return new Response(
      JSON.stringify({ 
        approved: false, 
        reason: 'Moderation service temporarily unavailable',
        confidence: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});