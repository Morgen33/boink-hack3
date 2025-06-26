
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface SocialMediaConnection {
  id: string;
  platform: string;
  username: string;
  profile_url: string | null;
  verified: boolean | null;
  connected_at: string;
}

export const useSocialMediaConnections = (user: User | null) => {
  const [connections, setConnections] = useState<SocialMediaConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConnections = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_media_connections')
        .select('*')
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error: any) {
      console.error('Error fetching social connections:', error);
      toast({
        title: "Error",
        description: "Failed to load social media connections.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addConnection = async (platform: string, username: string, profileUrl?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('social_media_connections')
        .insert({
          user_id: user.id,
          platform,
          username,
          profile_url: profileUrl || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${platform} account connected successfully!`,
      });

      fetchConnections();
      return true;
    } catch (error: any) {
      console.error('Error adding connection:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to connect ${platform} account.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const removeConnection = async (id: string, platform: string) => {
    try {
      const { error } = await supabase
        .from('social_media_connections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${platform} account disconnected successfully!`,
      });

      fetchConnections();
    } catch (error: any) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: `Failed to disconnect ${platform} account.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  return {
    connections,
    loading,
    addConnection,
    removeConnection,
    refetch: fetchConnections
  };
};
