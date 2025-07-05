import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIMatchingHook {
  analyzeProfile: (profileData: any) => Promise<void>;
  calculateCompatibility: (userId: string, targetUserId: string) => Promise<any>;
  getMatchInsights: (userId: string, targetUserId: string) => Promise<any>;
  loading: boolean;
}

export const useAIMatching = (): AIMatchingHook => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeProfile = async (profileData: any) => {
    try {
      setLoading(true);
      console.log('Starting AI profile analysis...');

      const { data, error } = await supabase.functions.invoke('ai-profile-analysis', {
        body: profileData
      });

      if (error) throw error;

      console.log('Profile analysis completed:', data);
      
      toast({
        title: "AI Analysis Complete",
        description: "Your profile has been analyzed for better matching!",
      });

    } catch (error: any) {
      console.error('Error analyzing profile:', error);
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibility = async (userId: string, targetUserId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('ai-enhanced-matching', {
        body: { userId, targetUserId }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error calculating compatibility:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMatchInsights = async (userId: string, targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('match_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('target_user_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching match insights:', error);
      return null;
    }
  };

  return {
    analyzeProfile,
    calculateCompatibility,
    getMatchInsights,
    loading
  };
};