import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AIMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
  context_metadata?: any;
  tokens_used?: number;
}

export interface AIConversation {
  id: string;
  title?: string;
  context_summary?: string;
  conversation_type: string;
  created_at: string;
  updated_at: string;
}

export const useAIChat = (conversationId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations for the user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    }
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (convId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Get conversation details
      const { data: conv } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', convId)
        .single();

      setCurrentConversation(conv);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    }
  }, [user]);

  // Send a message to AI
  const sendMessage = useCallback(async (
    content: string, 
    conversationType: string = 'general'
  ): Promise<string | null> => {
    if (!user || !content.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('ai-intelligent-chat', {
        body: {
          message: content.trim(),
          conversationId: currentConversation?.id,
          userId: user.id,
          conversationType
        }
      });

      if (response.error) throw response.error;

      const { response: aiResponse, conversationId: newConvId } = response.data;

      // If we got a new conversation ID, fetch it
      if (newConvId && (!currentConversation || currentConversation.id !== newConvId)) {
        await fetchMessages(newConvId);
        await fetchConversations();
      } else if (currentConversation) {
        // Refresh current conversation messages
        await fetchMessages(currentConversation.id);
      }

      return aiResponse;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, currentConversation, fetchMessages, fetchConversations]);

  // Create a new conversation
  const createConversation = useCallback(async (
    title: string,
    conversationType: string = 'general'
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title,
          conversation_type: conversationType
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      setCurrentConversation(data);
      setMessages([]);

      return data.id;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create conversation');
      return null;
    }
  }, [user, fetchConversations]);

  // Delete a conversation
  const deleteConversation = useCallback(async (convId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', convId)
        .eq('user_id', user.id);

      if (error) throw error;

      if (currentConversation?.id === convId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      await fetchConversations();
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation');
    }
  }, [user, currentConversation, fetchConversations]);

  // Set active conversation
  const setActiveConversation = useCallback(async (convId: string) => {
    await fetchMessages(convId);
  }, [fetchMessages]);

  // Get conversation statistics
  const getConversationStats = useCallback(() => {
    const totalMessages = messages.length;
    const userMessages = messages.filter(m => m.role === 'user').length;
    const aiMessages = messages.filter(m => m.role === 'assistant').length;
    const totalTokens = messages.reduce((sum, m) => sum + (m.tokens_used || 0), 0);

    return {
      totalMessages,
      userMessages,
      aiMessages,
      totalTokens,
      conversationCount: conversations.length
    };
  }, [messages, conversations]);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchConversations();
      if (conversationId) {
        fetchMessages(conversationId);
      }
    }
  }, [user, conversationId, fetchConversations, fetchMessages]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!currentConversation || !user) return;

    const channel = supabase
      .channel(`ai_messages_${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as AIMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation, user]);

  return {
    messages,
    conversations,
    currentConversation,
    loading,
    error,
    sendMessage,
    createConversation,
    deleteConversation,
    setActiveConversation,
    fetchConversations,
    getConversationStats,
    clearError: () => setError(null)
  };
};