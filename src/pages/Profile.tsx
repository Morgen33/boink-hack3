
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import ProfileWizard from '@/components/profile/ProfileWizard';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  date_of_birth: string | null;
  profile_completed: boolean | null;
  // Dating preference fields
  gender_identity: string | null;
  sexual_orientation: string | null;
  looking_for_gender: string[] | null;
  relationship_type: string | null;
  // Crypto fields
  wallet_address: string | null;
  favorite_crypto: string | null;
  crypto_experience: string | null;
  portfolio_size: string | null;
  trading_style: string | null;
  defi_protocols: string[] | null;
  nft_collections: string[] | null;
  degen_score: number | null;
  meme_coin_holdings: string[] | null;
  biggest_crypto_win: string | null;
  biggest_crypto_loss: string | null;
  crypto_motto: string | null;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileJustCompleted, setProfileJustCompleted] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Create a profile object with all required fields
        const profileData: Profile = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
          age: data.age,
          location: data.location,
          interests: data.interests,
          looking_for: data.looking_for,
          date_of_birth: data.date_of_birth,
          profile_completed: data.profile_completed,
          // Dating preferences
          gender_identity: data.gender_identity,
          sexual_orientation: data.sexual_orientation,
          looking_for_gender: data.looking_for_gender,
          relationship_type: data.relationship_type,
          // Crypto fields
          wallet_address: data.wallet_address || null,
          favorite_crypto: data.favorite_crypto || null,
          crypto_experience: data.crypto_experience || null,
          portfolio_size: data.portfolio_size || null,
          trading_style: data.trading_style || null,
          defi_protocols: data.defi_protocols || null,
          nft_collections: data.nft_collections || null,
          degen_score: data.degen_score || null,
          meme_coin_holdings: data.meme_coin_holdings || null,
          biggest_crypto_win: data.biggest_crypto_win || null,
          biggest_crypto_loss: data.biggest_crypto_loss || null,
          crypto_motto: data.crypto_motto || null,
        };

        setProfile(profileData);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleProfileComplete = async (formData: any) => {
    if (!user) return;

    try {
      const updateData = {
        full_name: formData.full_name || null,
        username: formData.username || null,
        bio: formData.bio || null,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location || null,
        interests: formData.interests ? formData.interests.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
        looking_for: formData.looking_for || null,
        date_of_birth: formData.date_of_birth || null,
        // Dating preferences
        gender_identity: formData.gender_identity || null,
        sexual_orientation: formData.sexual_orientation || null,
        looking_for_gender: formData.looking_for_gender.length > 0 ? formData.looking_for_gender : null,
        relationship_type: formData.relationship_type || null,
        // Crypto fields
        wallet_address: formData.wallet_address || null,
        favorite_crypto: formData.favorite_crypto || null,
        crypto_experience: formData.crypto_experience || null,
        portfolio_size: formData.portfolio_size || null,
        trading_style: formData.trading_style || null,
        defi_protocols: formData.defi_protocols ? formData.defi_protocols.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
        nft_collections: formData.nft_collections ? formData.nft_collections.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
        meme_coin_holdings: formData.meme_coin_holdings ? formData.meme_coin_holdings.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
        biggest_crypto_win: formData.biggest_crypto_win || null,
        biggest_crypto_loss: formData.biggest_crypto_loss || null,
        crypto_motto: formData.crypto_motto || null,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "Your degen profile is now live! Time to find your crypto tribe! 🚀",
      });

      // Update local profile data and show completion message
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      setProfileJustCompleted(true);
      
      // Navigate to discover page after a brief delay
      setTimeout(() => {
        navigate('/discover');
      }, 2000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  // Convert Profile to ProfileFormData format for the wizard
  const convertProfileToFormData = (profile: Profile) => {
    return {
      full_name: profile.full_name || '',
      username: profile.username || '',
      age: profile.age ? profile.age.toString() : '', // Convert number to string
      date_of_birth: profile.date_of_birth || '',
      location: profile.location || '',
      avatar_url: profile.avatar_url || '',
      bio: profile.bio || '',
      interests: profile.interests ? profile.interests.join(', ') : '',
      looking_for: profile.looking_for || '',
      gender_identity: profile.gender_identity || '',
      sexual_orientation: profile.sexual_orientation || '',
      looking_for_gender: profile.looking_for_gender || [],
      relationship_type: profile.relationship_type || '',
      wallet_address: profile.wallet_address || '',
      favorite_crypto: profile.favorite_crypto || '',
      crypto_experience: profile.crypto_experience || '',
      portfolio_size: profile.portfolio_size || '',
      trading_style: profile.trading_style || '',
      defi_protocols: profile.defi_protocols ? profile.defi_protocols.join(', ') : '',
      nft_collections: profile.nft_collections ? profile.nft_collections.join(', ') : '',
      meme_coin_holdings: profile.meme_coin_holdings ? profile.meme_coin_holdings.join(', ') : '',
      biggest_crypto_win: profile.biggest_crypto_win || '',
      biggest_crypto_loss: profile.biggest_crypto_loss || '',
      crypto_motto: profile.crypto_motto || '',
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show completion message
  if (profileJustCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center max-w-md p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-4">
              Profile Complete! 🎉
            </h1>
            <p className="text-muted-foreground mb-6">
              Your degen profile is now live and ready to attract fellow crypto enthusiasts!
              Redirecting you to discover amazing people...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm">Taking you to Discover...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show profile wizard for incomplete profiles or editing
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <ProfileWizard
          user={user}
          initialData={profile ? convertProfileToFormData(profile) : undefined}
          onComplete={handleProfileComplete}
        />
      </div>
    </div>
  );
};

export default Profile;
