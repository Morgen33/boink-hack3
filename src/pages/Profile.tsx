
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Calendar, MapPin, Heart, Loader2, Wallet, Bitcoin, Coins, Zap } from 'lucide-react';
import Header from '@/components/Header';
import SocialMediaConnections from '@/components/SocialMediaConnections';
import DegenQuestionnaire from '@/components/DegenQuestionnaire';
import NFTShowcase from '@/components/NFTShowcase';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  date_of_birth: string | null;
  profile_completed: boolean | null;
  // New crypto fields
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
  const [saving, setSaving] = useState(false);
  const [showDegenQuestionnaire, setShowDegenQuestionnaire] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    age: '',
    location: '',
    interests: '',
    looking_for: '',
    date_of_birth: '',
    // New crypto fields
    wallet_address: '',
    favorite_crypto: '',
    crypto_experience: '',
    portfolio_size: '',
    trading_style: '',
    defi_protocols: '',
    nft_collections: '',
    meme_coin_holdings: '',
    biggest_crypto_win: '',
    biggest_crypto_loss: '',
    crypto_motto: '',
  });

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

        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          age: data.age?.toString() || '',
          location: data.location || '',
          interests: data.interests?.join(', ') || '',
          looking_for: data.looking_for || '',
          date_of_birth: data.date_of_birth || '',
        });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        full_name: formData.full_name || null,
        bio: formData.bio || null,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location || null,
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()).filter(Boolean) : null,
        looking_for: formData.looking_for || null,
        date_of_birth: formData.date_of_birth || null,
        // New crypto fields
        wallet_address: formData.wallet_address || null,
        favorite_crypto: formData.favorite_crypto || null,
        crypto_experience: formData.crypto_experience || null,
        portfolio_size: formData.portfolio_size || null,
        trading_style: formData.trading_style || null,
        defi_protocols: formData.defi_protocols ? formData.defi_protocols.split(',').map(i => i.trim()).filter(Boolean) : null,
        nft_collections: formData.nft_collections ? formData.nft_collections.split(',').map(i => i.trim()).filter(Boolean) : null,
        meme_coin_holdings: formData.meme_coin_holdings ? formData.meme_coin_holdings.split(',').map(i => i.trim()).filter(Boolean) : null,
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
        title: "Success",
        description: "Your degen profile has been updated! 🚀",
      });

      // Refresh profile data
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Degen Profile 🚀
          </h1>
          <p className="text-muted-foreground mt-2">
            Show off your crypto credentials and connect with fellow degens
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Overview
              </CardTitle>
              <CardDescription>
                Your degen status and profile completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{profile?.full_name || 'Anonymous Degen'}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={profile?.profile_completed ? "default" : "secondary"}>
                      {profile?.profile_completed ? 'Complete' : 'Incomplete'}
                    </Badge>
                    {profile?.degen_score && (
                      <Badge variant="outline" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        Degen Score: {profile.degen_score}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crypto Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5" />
                Crypto Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-web3-red">
                    {profile?.nft_collections?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">NFT Collections</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-web3-magenta">
                    {profile?.meme_coin_holdings?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Meme Coins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {profile?.defi_protocols?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">DeFi Protocols</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {profile?.crypto_experience || 'Newbie'}
                  </div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Degen Questionnaire Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Degen Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Extra Degen Questions</p>
                  <p className="text-sm text-muted-foreground">Show your true degen nature</p>
                </div>
                <Switch
                  checked={showDegenQuestionnaire}
                  onCheckedChange={setShowDegenQuestionnaire}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NFT Showcase */}
        <div className="mt-6">
          <NFTShowcase user={user} />
        </div>

        {/* Social Media Connections */}
        <div className="mt-6">
          <SocialMediaConnections user={user} />
        </div>

        {/* Main Profile Form */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Crypto Profile</CardTitle>
            <CardDescription>
              Complete your crypto profile to find your degen tribe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Info
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Your age"
                    min="18"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself... Are you a diamond hands HODLer or a paper hands trader? 💎🙌"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Crypto Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Crypto Profile
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="wallet_address">Wallet Address</Label>
                  <Input
                    id="wallet_address"
                    value={formData.wallet_address}
                    onChange={(e) => handleInputChange('wallet_address', e.target.value)}
                    placeholder="Your main wallet address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favorite_crypto">Favorite Crypto</Label>
                  <Input
                    id="favorite_crypto"
                    value={formData.favorite_crypto}
                    onChange={(e) => handleInputChange('favorite_crypto', e.target.value)}
                    placeholder="BTC, ETH, SOL, DOGE..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crypto_experience">Crypto Experience</Label>
                  <Input
                    id="crypto_experience"
                    value={formData.crypto_experience}
                    onChange={(e) => handleInputChange('crypto_experience', e.target.value)}
                    placeholder="Newbie, Veteran, OG, Degen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_size">Portfolio Size</Label>
                  <Input
                    id="portfolio_size"
                    value={formData.portfolio_size}
                    onChange={(e) => handleInputChange('portfolio_size', e.target.value)}
                    placeholder="Shrimp, Crab, Fish, Whale 🐋"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trading_style">Trading Style</Label>
                <Input
                  id="trading_style"
                  value={formData.trading_style}
                  onChange={(e) => handleInputChange('trading_style', e.target.value)}
                  placeholder="HODL, Day Trading, Swing Trading, Ape into everything"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defi_protocols">DeFi Protocols</Label>
                <Input
                  id="defi_protocols"
                  value={formData.defi_protocols}
                  onChange={(e) => handleInputChange('defi_protocols', e.target.value)}
                  placeholder="Uniswap, Compound, Aave, PancakeSwap (separate with commas)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nft_collections">NFT Collections</Label>
                <Input
                  id="nft_collections"
                  value={formData.nft_collections}
                  onChange={(e) => handleInputChange('nft_collections', e.target.value)}
                  placeholder="BAYC, CryptoPunks, Azuki, Okay Bears (separate with commas)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meme_coin_holdings">Meme Coin Holdings</Label>
                <Input
                  id="meme_coin_holdings"
                  value={formData.meme_coin_holdings}
                  onChange={(e) => handleInputChange('meme_coin_holdings', e.target.value)}
                  placeholder="DOGE, SHIB, PEPE, WIF, BONK (separate with commas)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crypto_motto">Crypto Motto</Label>
                <Input
                  id="crypto_motto"
                  value={formData.crypto_motto}
                  onChange={(e) => handleInputChange('crypto_motto', e.target.value)}
                  placeholder="Diamond hands forever, WAGMI, To the moon! 🚀"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Other Interests</Label>
              <Input
                id="interests"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="Gaming, Music, Art, Memes, Yield Farming (separate with commas)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="looking_for">What are you looking for?</Label>
              <Input
                id="looking_for"
                value={formData.looking_for}
                onChange={(e) => handleInputChange('looking_for', e.target.value)}
                placeholder="Crypto friends, Trading buddies, NFT collectors, Meme lords"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Degen Profile 🚀'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Degen Questionnaire */}
        {showDegenQuestionnaire && (
          <DegenQuestionnaire user={user} />
        )}
      </div>
    </div>
  );
};

export default Profile;
