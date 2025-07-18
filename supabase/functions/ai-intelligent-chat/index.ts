import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationContext {
  userProfile?: any;
  recentMessages: any[];
  contextSummary?: string;
  relevantEmbeddings: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, userId, conversationType = 'general' } = await req.json();

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single();
      conversation = data;
    }

    if (!conversation) {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + '...',
          conversation_type: conversationType,
          context_summary: `User started conversation about: ${message.substring(0, 100)}`
        })
        .select()
        .single();
      
      if (error) throw error;
      conversation = data;
    }

    // Build conversation context
    const context = await buildConversationContext(supabase, conversation.id, userId);

    // Store user message
    await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
        context_metadata: { timestamp: new Date().toISOString() }
      });

    // Generate AI response with context
    const aiResponse = await generateContextAwareResponse(message, context, conversationType);

    // Store AI response
    const { data: aiMessage } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: aiResponse.content,
        context_metadata: aiResponse.metadata,
        tokens_used: aiResponse.tokensUsed
      })
      .select()
      .single();

    // Update conversation summary
    if (context.recentMessages.length > 5) {
      const summary = await generateConversationSummary(context.recentMessages);
      await supabase
        .from('ai_conversations')
        .update({ context_summary: summary })
        .eq('id', conversation.id);
    }

    // Create context embeddings for important messages
    if (aiResponse.isImportant) {
      await createContextEmbedding(supabase, conversation.id, aiMessage.id, aiResponse.content);
    }

    return new Response(
      JSON.stringify({
        response: aiResponse.content,
        conversationId: conversation.id,
        messageId: aiMessage.id,
        context: {
          tokensUsed: aiResponse.tokensUsed,
          relevantContext: context.relevantEmbeddings.length,
          conversationType: conversationType
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function buildConversationContext(
  supabase: any, 
  conversationId: string, 
  userId: string
): Promise<ConversationContext> {
  // Get user profile for context
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Get recent messages
  const { data: recentMessages } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get conversation summary
  const { data: conversation } = await supabase
    .from('ai_conversations')
    .select('context_summary')
    .eq('id', conversationId)
    .single();

  // Get relevant context embeddings
  const { data: relevantEmbeddings } = await supabase
    .from('ai_context_embeddings')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('relevance_score', { ascending: false })
    .limit(5);

  return {
    userProfile,
    recentMessages: recentMessages || [],
    contextSummary: conversation?.context_summary,
    relevantEmbeddings: relevantEmbeddings || []
  };
}

async function generateContextAwareResponse(
  message: string, 
  context: ConversationContext, 
  conversationType: string
) {
  const systemPrompt = buildSystemPrompt(context, conversationType);
  const conversationHistory = buildConversationHistory(context.recentMessages);

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
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return {
    content,
    tokensUsed: data.usage?.total_tokens || 0,
    isImportant: content.length > 200 || content.includes('important') || content.includes('remember'),
    metadata: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      contextUsed: context.relevantEmbeddings.length > 0,
      userProfileUsed: !!context.userProfile
    }
  };
}

function buildSystemPrompt(context: ConversationContext, conversationType: string): string {
  let basePrompt = `You are an intelligent AI assistant with advanced context awareness and memory. You remember previous conversations and can provide personalized responses.`;

  if (context.userProfile) {
    const profile = context.userProfile;
    basePrompt += `\n\nUser Profile Context:
- Name: ${profile.full_name || 'Not provided'}
- Location: ${profile.location || 'Not provided'}
- Interests: ${profile.interests?.join(', ') || 'Not provided'}
- Bio: ${profile.bio || 'Not provided'}`;

    if (profile.crypto_experience) {
      basePrompt += `\n- Crypto Experience: ${profile.crypto_experience}`;
    }
    if (profile.platform_intent) {
      basePrompt += `\n- Platform Intent: ${profile.platform_intent}`;
    }
  }

  if (context.contextSummary) {
    basePrompt += `\n\nConversation Summary: ${context.contextSummary}`;
  }

  if (context.relevantEmbeddings.length > 0) {
    basePrompt += `\n\nRelevant Previous Context:`;
    context.relevantEmbeddings.forEach((embedding, index) => {
      basePrompt += `\n${index + 1}. ${embedding.content_summary}`;
    });
  }

  // Conversation type specific prompts
  switch (conversationType) {
    case 'dating':
      basePrompt += `\n\nThis is a dating-related conversation. Be supportive, understanding, and provide relationship advice when appropriate.`;
      break;
    case 'networking':
      basePrompt += `\n\nThis is a professional networking conversation. Focus on career advice, business insights, and professional development.`;
      break;
    case 'crypto':
      basePrompt += `\n\nThis is a crypto-related conversation. Provide insights about cryptocurrency, blockchain technology, and market analysis.`;
      break;
    default:
      basePrompt += `\n\nThis is a general conversation. Be helpful, informative, and engaging.`;
  }

  basePrompt += `\n\nAlways refer to previous context when relevant and maintain conversation continuity. Be personalized based on the user's profile and history.`;

  return basePrompt;
}

function buildConversationHistory(recentMessages: any[]): any[] {
  return recentMessages
    .reverse()
    .slice(0, 8) // Keep last 8 messages for context
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
}

async function generateConversationSummary(messages: any[]): Promise<string> {
  const conversationText = messages
    .slice(0, 10)
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Summarize this conversation in 2-3 sentences, focusing on key topics and context that would be useful for future conversations.'
        },
        { role: 'user', content: conversationText }
      ],
      temperature: 0.3,
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function createContextEmbedding(
  supabase: any,
  conversationId: string,
  messageId: string,
  content: string
) {
  // Create a simple embedding based on content keywords
  const tags = extractKeywords(content);
  const summary = content.substring(0, 200) + (content.length > 200 ? '...' : '');

  await supabase
    .from('ai_context_embeddings')
    .insert({
      conversation_id: conversationId,
      message_id: messageId,
      content_summary: summary,
      context_tags: tags,
      relevance_score: calculateRelevanceScore(content)
    });
}

function extractKeywords(text: string): string[] {
  const keywords = text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'would', 'there', 'could'].includes(word))
    .slice(0, 10);
  
  return [...new Set(keywords)];
}

function calculateRelevanceScore(content: string): number {
  let score = 1.0;
  
  // Boost score for longer, more detailed responses
  if (content.length > 300) score += 0.2;
  
  // Boost score for important keywords
  const importantKeywords = ['important', 'remember', 'key', 'crucial', 'significant'];
  const hasImportantKeywords = importantKeywords.some(keyword => 
    content.toLowerCase().includes(keyword)
  );
  if (hasImportantKeywords) score += 0.3;
  
  return Math.min(score, 2.0);
}