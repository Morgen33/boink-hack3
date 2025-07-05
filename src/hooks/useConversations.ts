import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  last_message_preview: string | null;
  user1_unread_count: number;
  user2_unread_count: number;
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    photo_urls: string[] | null;
  } | null;
}

export const useConversations = (user: User | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch conversations with other user profile data
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey(id, full_name, avatar_url, photo_urls),
          user2:profiles!conversations_user2_id_fkey(id, full_name, avatar_url, photo_urls)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) {
        throw conversationsError;
      }

      // Transform data to include the other user's info
      const transformedConversations: Conversation[] = (conversationsData || []).map((conv: any) => {
        const otherUser = conv.user1_id === user.id ? conv.user2 : conv.user1;
        return {
          ...conv,
          other_user: otherUser
        };
      });

      setConversations(transformedConversations);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUnreadCount = (conversation: Conversation): number => {
    if (!user) return 0;
    return conversation.user1_id === user.id 
      ? conversation.user1_unread_count 
      : conversation.user2_unread_count;
  };

  const createConversation = async (otherUserId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        user1: user.id,
        user2: otherUserId
      });

      if (error) {
        throw error;
      }

      // Refresh conversations
      await fetchConversations();
      
      return data;
    } catch (err: any) {
      console.error('Error creating conversation:', err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Real-time subscription for conversations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user1_id=eq.${user.id},user2_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    getUnreadCount
  };
};