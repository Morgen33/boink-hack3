import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  message_type: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    photo_urls: string[] | null;
  } | null;
}

export const useMessages = (conversationId: string | null, user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    if (!conversationId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          created_at,
          conversation_id,
          sender_id,
          recipient_id,
          content,
          read_at,
          message_type
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        throw messagesError;
      }

      // Fetch sender profiles separately
      const senderIds = [...new Set(messagesData?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, photo_urls')
        .in('id', senderIds);

      // Combine messages with sender info
      const messagesWithSenders: Message[] = (messagesData || []).map(message => ({
        ...message,
        sender: profiles?.find(p => p.id === message.sender_id) || null
      }));

      setMessages(messagesWithSenders);

      // Mark messages as read
      if (messagesWithSenders.length > 0) {
        await markMessagesAsRead();
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, recipientId: string): Promise<boolean> => {
    if (!conversationId || !user || !content.trim()) {
      return false;
    }

    try {
      setSending(true);
      setError(null);

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message);
      return false;
    } finally {
      setSending(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!conversationId || !user) return;

    try {
      await supabase.rpc('mark_messages_as_read', {
        conversation_uuid: conversationId,
        reader_id: user.id
      });
    } catch (err: any) {
      console.error('Error marking messages as read:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId, user]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          // Fetch the new message with sender info
          const fetchNewMessage = async () => {
            const { data: newMessage } = await supabase
              .from('messages')
              .select(`
                id,
                created_at,
                conversation_id,
                sender_id,
                recipient_id,
                content,
                read_at,
                message_type
              `)
              .eq('id', payload.new.id)
              .single();

            if (newMessage) {
              // Get sender profile
              const { data: senderProfile } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, photo_urls')
                .eq('id', newMessage.sender_id)
                .single();

              const messageWithSender: Message = {
                ...newMessage,
                sender: senderProfile || null
              };

              setMessages(prev => [...prev, messageWithSender]);
              
              // Mark as read if I'm not the sender
              if (newMessage.sender_id !== user?.id) {
                setTimeout(() => markMessagesAsRead(), 500);
              }
            }
          };

          fetchNewMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    fetchMessages,
    markMessagesAsRead
  };
};