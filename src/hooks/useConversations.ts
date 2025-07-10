import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useUserBlocks } from './useUserBlocks';

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
  conversation_context: 'dating' | 'networking' | 'mixed';
  created_from_intent: 'dating' | 'networking' | 'both';
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    photo_urls: string[] | null;
    platform_intent: 'dating' | 'networking' | 'both' | null;
    bio: string | null;
    professional_bio: string | null;
    job_title: string | null;
    company_name: string | null;
    interests: string[] | null;
    expertise_areas: string[] | null;
  } | null;
}

export type ConversationFilter = 'all' | 'dating' | 'networking' | 'mixed';

export const getConversationContextInfo = (conversation: Conversation) => {
  const { conversation_context } = conversation;
  
  switch (conversation_context) {
    case 'dating':
      return {
        label: 'Dating',
        color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
        icon: '💕'
      };
    case 'networking':
      return {
        label: 'Networking',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        icon: '🤝'
      };
    case 'mixed':
      return {
        label: 'Mixed',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        icon: '🌟'
      };
    default:
      return {
        label: 'Mixed',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        icon: '💭'
      };
  }
};

export const getContextSpecificInfo = (conversation: Conversation) => {
  const { other_user, conversation_context } = conversation;
  if (!other_user) return null;

  switch (conversation_context) {
    case 'dating':
      return {
        primaryInfo: other_user.bio || 'No bio available',
        secondaryInfo: other_user.interests?.slice(0, 3).join(', ') || 'No interests listed',
        placeholder: "Hey! I saw your profile and would love to get to know you better 😊"
      };
    case 'networking':
      return {
        primaryInfo: other_user.professional_bio || other_user.bio || 'No bio available',
        secondaryInfo: `${other_user.job_title || 'Professional'}${other_user.company_name ? ` at ${other_user.company_name}` : ''}`,
        placeholder: "Hi! I'd love to connect and discuss potential collaboration opportunities."
      };
    case 'mixed':
      return {
        primaryInfo: other_user.bio || other_user.professional_bio || 'No bio available',
        secondaryInfo: `${other_user.job_title || 'Professional'}${other_user.interests?.length ? ` • Interests: ${other_user.interests.slice(0, 2).join(', ')}` : ''}`,
        placeholder: "Hi there! Looking forward to connecting with you."
      };
    default:
      return {
        primaryInfo: other_user.bio || 'No bio available',
        secondaryInfo: '',
        placeholder: "Hi! How are you doing?"
      };
  }
};

export const useConversations = (user: User | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const { isUserBlocked } = useUserBlocks();

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch conversations with enhanced other user profile data
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey(
            id, full_name, avatar_url, photo_urls, platform_intent, 
            bio, professional_bio, job_title, company_name, interests, expertise_areas
          ),
          user2:profiles!conversations_user2_id_fkey(
            id, full_name, avatar_url, photo_urls, platform_intent,
            bio, professional_bio, job_title, company_name, interests, expertise_areas
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) {
        throw conversationsError;
      }

      // Transform data to include the other user's info and filter blocked users
      const transformedConversations: Conversation[] = (conversationsData || []).map((conv: any) => {
        const otherUser = conv.user1_id === user.id ? conv.user2 : conv.user1;
        return {
          ...conv,
          other_user: otherUser
        };
      }).filter(conv => !isUserBlocked(conv.other_user?.id || ''));

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

  // Filter conversations based on current filter
  const filteredConversations = conversations.filter(conv => {
    if (filter === 'all') return true;
    return conv.conversation_context === filter;
  });

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    loading,
    error,
    filter,
    setFilter,
    fetchConversations,
    createConversation,
    getUnreadCount
  };
};