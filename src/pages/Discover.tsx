
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
}

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

  // Fetch other users' profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, age, bio, location, interests, looking_for, avatar_url')
          .neq('id', user.id) // Exclude current user
          .eq('profile_completed', true) // Only show completed profiles
          .limit(10);

        if (error) throw error;

        setProfiles(data || []);
      } catch (error: any) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Failed to load profiles.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, toast]);

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: `You liked ${currentProfile?.full_name || 'this person'}`,
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

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
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
