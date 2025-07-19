
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export const useSpotifyIntegration = (user: User | null) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const connectToSpotify = async () => {
    if (!user) return;

    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('spotify-integration', {
        body: { action: 'getAuthUrl' }
      });

      if (error) throw error;

      // Redirect to Spotify authorization
      window.location.href = data.authUrl;
    } catch (error: any) {
      console.error('Error connecting to Spotify:', error);
      toast({
        title: "Error",
        description: "Failed to connect to Spotify. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSpotifyCallback = async (code: string, state: string) => {
    if (!user || state !== user.id) return false;

    try {
      const { error } = await supabase.functions.invoke('spotify-integration', {
        body: { action: 'handleCallback', code, state }
      });

      if (error) throw error;

      toast({
        title: "Success! 🎵",
        description: "Your Spotify account has been connected successfully!",
      });

      return true;
    } catch (error: any) {
      console.error('Error handling Spotify callback:', error);
      toast({
        title: "Error",
        description: "Failed to complete Spotify connection.",
        variant: "destructive",
      });
      return false;
    }
  };

  const refreshSpotifyData = async () => {
    if (!user) return;

    setIsRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('spotify-integration', {
        body: { action: 'refreshData' }
      });

      if (error) throw error;

      toast({
        title: "Updated! 🎵",
        description: "Your Spotify music data has been refreshed.",
      });
    } catch (error: any) {
      console.error('Error refreshing Spotify data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh Spotify data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    connectToSpotify,
    handleSpotifyCallback,
    refreshSpotifyData,
    isConnecting,
    isRefreshing
  };
};
