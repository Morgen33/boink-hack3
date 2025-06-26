
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { useDiscoverProfiles } from '@/hooks/useDiscoverProfiles';

const Discover = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    profiles,
    loading,
    currentIndex,
    currentProfile,
    hasMoreProfiles,
    nextProfile
  } = useDiscoverProfiles(user);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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

  const handleNextProfile = () => {
    if (hasMoreProfiles) {
      nextProfile();
    } else {
      toast({
        title: "No more profiles",
        description: "Check back later for more matches!",
      });
    }
  };

  if (authLoading) {
    console.log('Auth loading...');
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
    console.log('No user found, redirecting to auth');
    return null;
  }

  console.log('Current profile:', currentProfile);
  console.log('Current index:', currentIndex);
  console.log('Total profiles:', profiles.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

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

        <ProfileCard 
          profile={currentProfile}
          onLike={handleLike}
          onPass={handlePass}
        />

        <div className="text-center mt-4 text-sm text-muted-foreground">
          Profile {currentIndex + 1} of {profiles.length}
        </div>
      </div>
    </div>
  );
};

export default Discover;
