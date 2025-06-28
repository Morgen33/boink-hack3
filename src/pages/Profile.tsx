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
import { User, Calendar, MapPin, Heart, Loader2, Wallet, Bitcoin, Coins, Zap, CheckCircle, Edit } from 'lucide-react';
import Header from '@/components/Header';
import SocialMediaConnections from '@/components/SocialMediaConnections';
import DegenQuestionnaire from '@/components/DegenQuestionnaire';
import NFTShowcase from '@/components/NFTShowcase';
import GenderPreferences from '@/components/profile/GenderPreferences';

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
  const [saving, setSaving] = useState(false);
  const [showDegenQuestionnaire, setShowDegenQuestionnaire] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileJustCompleted, setProfileJustCompleted] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    age: '',
    location: '',
    interests: '',
    looking_for: '',
    date_of_birth: '',
    // Dating preferences
    gender_identity: '',
    sexual_orientation: '',
    looking_for_gender: [] as string[],
    relationship_type: '',
    // Crypto fields
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

        // Create a profile object with all required fields
        const profileData: Profile = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
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
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          age: data.age?.toString() || '',
          location: data.location || '',
          interests: data.interests?.join(', ') || '',
          looking_for: data.looking_for || '',
          date_of_birth: data.date_of_birth || '',
          // Dating preferences
          gender_identity: data.gender_identity || '',
          sexual_orientation: data.sexual_orientation || '',
          looking_for_gender: data.looking_for_gender || [],
          relationship_type: data.relationship_type || '',
          // Crypto fields
          wallet_address: data.wallet_address || '',
          favorite_crypto: data.favorite_crypto || '',
          crypto_experience: data.crypto_experience || '',
          portfolio_size: data.portfolio_size || '',
          trading_style: data.trading_style || '',
          defi_protocols: data.defi_protocols?.join(', ') || '',
          nft_collections: data.nft_collections?.join(', ') || '',
          meme_coin_holdings: data.meme_coin_holdings?.join(', ') || '',
          biggest_crypto_win: data.biggest_crypto_win || '',
          biggest_crypto_loss: data.biggest_crypto_loss || '',
          crypto_motto: data.crypto_motto || '',
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

  const handleInputChange = (field: string, value: string | string[]) => {
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
        title: "Success! 🎉",
        description: "Your degen profile has been saved! Time to find your crypto tribe! 🚀",
      });

      // Update local profile data
      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      setIsEditing(false);
      setProfileJustCompleted(true);
      
      // Auto-hide the completion message after 5 seconds
      setTimeout(() => setProfileJustCompleted(false), 5000);
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

  // Show completed profile view if profile is completed and not editing
  if (profile?.profile_completed && !isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto p-6 pt-24">
          {profileJustCompleted && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Profile Complete! 🎉</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your degen profile is now live and ready to attract fellow crypto enthusiasts!
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
                {profile.full_name || 'Anonymous Degen'} 🚀
              </h1>
              <p className="text-muted-foreground mt-2">
                Degen Profile Complete
              </p>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                    {profile.age && <p className="text-muted-foreground">Age: {profile.age}</p>}
                    {profile.location && (
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>
                
                {profile.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                {profile.looking_for && (
                  <div>
                    <h4 className="font-semibold mb-2">Looking For</h4>
                    <p className="text-muted-foreground">{profile.looking_for}</p>
                  </div>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dating Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Dating Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.gender_identity && (
                  <div>
                    <h4 className="font-semibold mb-1">Gender Identity</h4>
                    <Badge variant="outline">{profile.gender_identity}</Badge>
                  </div>
                )}

                {profile.sexual_orientation && (
                  <div>
                    <h4 className="font-semibold mb-1">Sexual Orientation</h4>
                    <Badge variant="outline">{profile.sexual_orientation}</Badge>
                  </div>
                )}

                {profile.looking_for_gender && profile.looking_for_gender.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Looking For</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.looking_for_gender.map((gender, index) => (
                        <Badge key={index} variant="secondary">
                          {gender}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.relationship_type && (
                  <div>
                    <h4 className="font-semibold mb-1">Relationship Type</h4>
                    <p className="text-muted-foreground">{profile.relationship_type}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional sections */}
          {(profile.nft_collections && profile.nft_collections.length > 0) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>NFT Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.nft_collections.map((collection, index) => (
                    <Badge key={index} variant="outline">
                      {collection}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(profile.defi_protocols && profile.defi_protocols.length > 0) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>DeFi Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.defi_protocols.map((protocol, index) => (
                    <Badge key={index} variant="outline">
                      {protocol}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show editing form
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

        {/* Dating Preferences Section */}
        <div className="mt-6">
          <GenderPreferences
            genderIdentity={formData.gender_identity}
            sexualOrientation={formData.sexual_orientation}
            lookingForGender={formData.looking_for_gender}
            relationshipType={formData.relationship_type}
            onGenderIdentityChange={(value) => handleInputChange('gender_identity', value)}
            onSexualOrientationChange={(value) => handleInputChange('sexual_orientation', value)}
            onLookingForGenderChange={(values) => handleInputChange('looking_for_gender', values)}
            onRelationshipTypeChange={(value) => handleInputChange('relationship_type', value)}
          />
        </div>

        {/* Main Profile Form */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Basic Profile</CardTitle>
            <CardDescription>
              Complete your basic info and crypto profile
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
