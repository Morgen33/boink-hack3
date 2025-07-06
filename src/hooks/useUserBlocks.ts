import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BlockedUser {
  id: string;
  blocked_id: string;
  reason: string | null;
  created_at: string;
  profile: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export const useUserBlocks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockedUserIds, setBlockedUserIds] = useState<Set<string>>(new Set());

  const fetchBlockedUsers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_blocks')
        .select(`
          id,
          blocked_id,
          reason,
          created_at
        `)
        .eq('blocker_id', user.id);

      if (error) throw error;

      // Fetch profile data separately
      const blockedIds = data?.map(block => block.blocked_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', blockedIds);

      const blockedUsersData = (data || []).map(block => ({
        ...block,
        profile: profiles?.find(p => p.id === block.blocked_id) || null
      }));

      setBlockedUsers(blockedUsersData);
      setBlockedUserIds(new Set(blockedUsersData.map(block => block.blocked_id)));
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const blockUser = async (userId: string, reason?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: user.id,
          blocked_id: userId,
          reason: reason || null
        });

      if (error) throw error;

      toast({
        title: "User blocked",
        description: "User has been blocked successfully.",
      });

      await fetchBlockedUsers();
      return true;
    } catch (error: any) {
      console.error('Error blocking user:', error);
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', userId);

      if (error) throw error;

      toast({
        title: "User unblocked",
        description: "User has been unblocked successfully.",
      });

      await fetchBlockedUsers();
      return true;
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const isUserBlocked = (userId: string): boolean => {
    return blockedUserIds.has(userId);
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, [user]);

  return {
    blockedUsers,
    loading,
    blockUser,
    unblockUser,
    isUserBlocked,
    refetch: fetchBlockedUsers
  };
};