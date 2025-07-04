import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCard as ProfileCardType } from '@/data/demoProfiles';

export const useUserLikes = () => {
  const { user } = useAuth();
  const [likedProfiles, setLikedProfiles] = useState<ProfileCardType[]>([]);
  const [mutualMatches, setMutualMatches] = useState<ProfileCardType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserLikes = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch all likes by the current user
      const { data: likes, error: likesError } = await supabase
        .from('user_likes')
        .select(`
          *,
          profiles!user_likes_liked_profile_id_fkey(
            id, full_name, age, location, bio, interests, looking_for, avatar_url,
            gender_identity, sexual_orientation, relationship_type, looking_for_gender,
            wallet_address, favorite_crypto, crypto_experience, portfolio_size, 
            trading_style, defi_protocols, nft_collections, meme_coin_holdings,
            biggest_crypto_win, biggest_crypto_loss, crypto_motto, degen_score,
            username, photo_urls
          )
        `)
        .eq('user_id', user.id);

      if (likesError) throw likesError;

      // Separate mutual matches from regular likes
      const mutual: ProfileCardType[] = [];
      const regular: ProfileCardType[] = [];

      likes?.forEach(like => {
        if (like.profiles) {
          const profile = {
            id: like.profiles.id,
            full_name: like.profiles.full_name,
            age: like.profiles.age,
            location: like.profiles.location,
            bio: like.profiles.bio,
            interests: like.profiles.interests,
            looking_for: like.profiles.looking_for,
            avatar_url: like.profiles.avatar_url,
            isDemo: false,
            // Extended fields
            gender_identity: like.profiles.gender_identity,
            sexual_orientation: like.profiles.sexual_orientation,
            relationship_type: like.profiles.relationship_type,
            looking_for_gender: like.profiles.looking_for_gender,
            wallet_address: like.profiles.wallet_address,
            favorite_crypto: like.profiles.favorite_crypto,
            crypto_experience: like.profiles.crypto_experience,
            portfolio_size: like.profiles.portfolio_size,
            trading_style: like.profiles.trading_style,
            defi_protocols: like.profiles.defi_protocols,
            nft_collections: like.profiles.nft_collections,
            meme_coin_holdings: like.profiles.meme_coin_holdings,
            biggest_crypto_win: like.profiles.biggest_crypto_win,
            biggest_crypto_loss: like.profiles.biggest_crypto_loss,
            crypto_motto: like.profiles.crypto_motto,
            degen_score: like.profiles.degen_score,
            username: like.profiles.username,
            photo_urls: like.profiles.photo_urls,
          };

          if (like.is_mutual_match) {
            mutual.push(profile);
          } else {
            regular.push(profile);
          }
        }
      });

      setMutualMatches(mutual);
      setLikedProfiles(regular);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const likeProfile = async (profileId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_likes')
        .insert({
          user_id: user.id,
          liked_profile_id: profileId
        });

      if (error) throw error;

      // Refresh the likes to get updated mutual match status
      await fetchUserLikes();
    } catch (error) {
      console.error('Error liking profile:', error);
    }
  };

  useEffect(() => {
    fetchUserLikes();
  }, [user]);

  return {
    likedProfiles,
    mutualMatches,
    loading,
    likeProfile,
    refetch: fetchUserLikes
  };
};