
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, X, MapPin, Calendar, User, Loader2 } from 'lucide-react';
import Header from '@/components/Header';

interface ProfileCard {
  id: string;
  full_name: string | null;
  age: number | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  avatar_url: string | null;
  isDemo?: boolean;
}

// Demo crypto Twitter profiles
const demoProfiles: ProfileCard[] = [
  {
    id: 'demo-1',
    full_name: 'Alex DeFi',
    age: 28,
    bio: '🌾 Yield farming since 2020 | LP tokens are my love language | Building the future of finance one protocol at a time | Currently 47% APY on my portfolio',
    location: 'San Francisco, CA',
    interests: ['DeFi', 'Yield Farming', 'Liquidity Mining', 'DAOs', 'Web3'],
    looking_for: 'Looking for someone who understands that "rugged" isn\'t just a carpet texture',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-2',
    full_name: 'Luna NFTqueen',
    age: 26,
    bio: '🎨 Digital artist | Minted 10k collection | Floor price 0.3 ETH | BAYC holder | Creating the metaverse one pixel at a time | She/Her',
    location: 'Los Angeles, CA',
    interests: ['NFTs', 'Digital Art', 'Metaverse', 'OpenSea', 'Solana'],
    looking_for: 'Seeking someone who appreciates fine art (and by fine art I mean JPEGs)',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-3',
    full_name: 'Bitcoin Brad',
    age: 32,
    bio: '₿ Bitcoin maximalist | HODL since 2013 | "Have fun staying poor" - me, probably | Stack sats, not shitcoins | Orange pill evangelist | 21M cap forever',
    location: 'Austin, TX',
    interests: ['Bitcoin', 'HODLing', 'Austrian Economics', 'Self Custody', 'Lightning Network'],
    looking_for: 'Looking for someone who knows 21 million is the only number that matters',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-4',
    full_name: 'Vitalik Vibe',
    age: 29,
    bio: '🔷 Ethereum dev | Building dApps that your grandma will use | Solidity is my second language | EIP-1559 changed my life | Currently working on Layer 2 scaling',
    location: 'Toronto, ON',
    interests: ['Ethereum', 'Smart Contracts', 'dApps', 'Layer 2', 'Solidity'],
    looking_for: 'Seeking someone who gets excited about gas optimizations',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-5',
    full_name: 'Crypto Sophia',
    age: 27,
    bio: '📈 Day trader | TA wizard | "Buy the dip" is my motto | 100x leverage enthusiast | Lost everything twice, made it back three times | Risk management is overrated',
    location: 'Miami, FL',
    interests: ['Trading', 'Technical Analysis', 'Futures', 'Leverage', 'Market Psychology'],
    looking_for: 'Looking for someone who won\'t judge my 3AM chart watching sessions',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-6',
    full_name: 'DAO Danny',
    age: 31,
    bio: '🏛️ Web3 entrepreneur | Founded 3 DAOs | Governance token collector | "Decentralization or death" | Currently disrupting disruption | Seed round incoming',
    location: 'New York, NY',
    interests: ['DAOs', 'Governance', 'Web3', 'Startups', 'Token Economics'],
    looking_for: 'Seeking co-founder material (in life and business)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-7',
    full_name: 'Meme Queen Maya',
    age: 25,
    bio: '🐕 Doge to the moon | Shiba army general | If it has a dog logo, I\'m in | Portfolio is 90% meme coins and I\'m proud | Diamond hands, smooth brain',
    location: 'Portland, OR',
    interests: ['Meme Coins', 'Dogecoin', 'Shiba Inu', 'Community', 'HODL'],
    looking_for: 'Looking for someone who takes memes seriously (but not too seriously)',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-8',
    full_name: 'Research Ryan',
    age: 33,
    bio: '🎓 Blockchain researcher | PhD in Cryptography | Published 50+ papers | "Not your keys, not your crypto" | Quantum resistance advocate | Privacy maximalist',
    location: 'Cambridge, MA',
    interests: ['Blockchain Research', 'Cryptography', 'Privacy Coins', 'Academic Papers', 'Zero Knowledge'],
    looking_for: 'Seeking someone who appreciates the beauty of cryptographic proofs',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-9',
    full_name: 'Influencer Ivy',
    age: 24,
    bio: '📱 Crypto content creator | 100K followers | "GM" every morning | Sponsored by 12 protocols | Making crypto accessible to normies | Always shilling something',
    location: 'Dubai, UAE',
    interests: ['Content Creation', 'Social Media', 'Influencer Marketing', 'Crypto Education', 'Personal Branding'],
    looking_for: 'Looking for someone who won\'t get jealous of my DMs (they\'re mostly about airdrops)',
    avatar_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-10',
    full_name: 'Staking Steve',
    age: 30,
    bio: '⚡ Validator node operator | Running 15 different chains | 12% annual rewards | "Proof of Stake > Proof of Work" | Slash conditions give me nightmares',
    location: 'London, UK',
    interests: ['Staking', 'Validators', 'Proof of Stake', 'Node Operations', 'Passive Income'],
    looking_for: 'Seeking someone who understands that uptime is everything',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    isDemo: true
  }
];

const Discover = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch real user profiles and combine with demo profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;

      console.log('Starting to fetch profiles...');
      console.log('Demo profiles available:', demoProfiles.length);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, age, bio, location, interests, looking_for, avatar_url')
          .neq('id', user.id) // Exclude current user
          .eq('profile_completed', true) // Only show completed profiles
          .limit(10);

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        console.log('Real profiles fetched:', data?.length || 0);

        // Combine real profiles with demo profiles
        const realProfiles = data || [];
        const allProfiles = [...demoProfiles, ...realProfiles];
        
        console.log('Total profiles (demo + real):', allProfiles.length);
        
        // Shuffle the profiles to mix demo and real profiles
        const shuffledProfiles = allProfiles.sort(() => Math.random() - 0.5);
        
        console.log('Shuffled profiles:', shuffledProfiles.length);
        console.log('First profile:', shuffledProfiles[0]);
        
        setProfiles(shuffledProfiles);
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        // If there's an error, just show demo profiles
        console.log('Fallback: Using only demo profiles');
        setProfiles(demoProfiles);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, toast]);

  const handleLike = () => {
    const profileName = currentProfile?.full_name || 'this person';
    const isDemo = currentProfile?.isDemo;
    
    toast({
      title: "Liked!",
      description: `You liked ${profileName}${isDemo ? ' (Demo Profile)' : ''}`,
    });
    nextProfile();
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "No more profiles",
        description: "Check back later for more matches!",
      });
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (authLoading || loading) {
    console.log('Loading state - authLoading:', authLoading, 'loading:', loading);
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
    console.log('No user found, should redirect to auth');
    return null;
  }

  const currentProfile = profiles[currentIndex];
  console.log('Current profile:', currentProfile);
  console.log('Current index:', currentIndex);
  console.log('Total profiles:', profiles.length);

  if (!currentProfile) {
    console.log('No current profile available');
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto p-6 pt-24">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto text-web3-red mb-4" />
            <h1 className="text-2xl font-bold mb-2">No more profiles to show</h1>
            <p className="text-muted-foreground mb-6">
              Check back later for more potential matches!
            </p>
            <Button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
            >
              Edit Your Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto p-6 pt-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Discover
          </h1>
          <p className="text-muted-foreground mt-2">
            Find your perfect match
          </p>
        </div>

        <Card className="relative overflow-hidden">
          {currentProfile.isDemo && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                Demo Profile
              </Badge>
            </div>
          )}
          
          <div className="relative">
            <div className="h-96 bg-gradient-to-br from-web3-red/10 to-web3-magenta/10 flex items-center justify-center">
              {currentProfile.avatar_url ? (
                <img
                  src={currentProfile.avatar_url}
                  alt={currentProfile.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-24 h-24 text-muted-foreground" />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h2 className="text-2xl font-bold text-white">
                {currentProfile.full_name || 'Anonymous'}
                {currentProfile.age && (
                  <span className="text-lg font-normal">, {currentProfile.age}</span>
                )}
              </h2>
              {currentProfile.location && (
                <p className="text-white/80 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {currentProfile.location}
                </p>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            {currentProfile.bio && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{currentProfile.bio}</p>
              </div>
            )}

            {currentProfile.looking_for && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Looking for</h3>
                <p className="text-muted-foreground">{currentProfile.looking_for}</p>
              </div>
            )}

            {currentProfile.interests && currentProfile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handlePass}
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 border-2 hover:bg-red-50 hover:border-red-200"
              >
                <X className="w-6 h-6 text-red-500" />
              </Button>
              <Button
                onClick={handleLike}
                size="lg"
                className="rounded-full w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
              >
                <Heart className="w-6 h-6 text-white" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          Profile {currentIndex + 1} of {profiles.length}
        </div>
      </div>
    </div>
  );
};

export default Discover;
