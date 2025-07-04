
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscoveryMatching } from '@/hooks/useDiscoveryMatching';
import { useUserLikes } from '@/hooks/useUserLikes';
import ProfileCard from '@/components/ProfileCard';
import DetailedProfileModal from '@/components/DetailedProfileModal';
import DiscoveryFilters from '@/components/DiscoveryFilters';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Discover = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const { likeProfile } = useUserLikes();
  const { 
    currentProfile, 
    hasMoreProfiles, 
    nextProfile, 
    loading,
    userProfile,
    profiles,
    filters,
    updateFilters
  } = useDiscoveryMatching(user);

  const handleLike = async () => {
    if (currentProfile) {
      await likeProfile(currentProfile.id);
      console.log('Liked profile:', currentProfile.id);
    }
    nextProfile();
  };

  const handlePass = () => {
    console.log('Passed on profile:', currentProfile?.id);
    nextProfile();
  };

  // Debug info
  console.log('Discover page - Total profiles:', profiles.length);
  console.log('Current profile index:', profiles.findIndex(p => p.id === currentProfile?.id));

  if (authLoading) {
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
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Sign in to Discover</h1>
            <p className="text-muted-foreground mb-6">
              Create an account to start discovering fellow crypto enthusiasts and degens!
            </p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
                Discover 💎
              </h1>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Smart crypto compatibility matching
            </p>
            {userProfile && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing matches based on age, location, interests, and crypto preferences
              </p>
            )}
            {/* Discovery Filters */}
            <DiscoveryFilters
              filters={filters}
              onFiltersChange={updateFilters}
              totalProfiles={profiles.length}
              userLocation={userProfile?.location}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            {!userProfile?.looking_for_gender || userProfile.looking_for_gender.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Set your gender preferences</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete your dating preferences to see mutual matches who are also looking for someone like you.
                  </p>
                  <Button onClick={() => navigate('/profile')}>
                    Update Preferences
                  </Button>
                </CardContent>
              </Card>
            ) : currentProfile ? (
            <div className="space-y-4">
              <ProfileCard
                profile={currentProfile}
                onLike={handleLike}
                onPass={handlePass}
                onClick={() => setSelectedProfile(currentProfile)}
              />
              
              {selectedProfile && (
                <DetailedProfileModal
                  profile={selectedProfile}
                  isOpen={!!selectedProfile}
                  onClose={() => setSelectedProfile(null)}
                  onLike={handleLike}
                  onPass={handlePass}
                />
              )}
              
              {!hasMoreProfiles && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">You've seen all available profiles!</h3>
                    <p className="text-sm text-muted-foreground">
                      Check back later for more matches or encourage friends to join Boink!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Complete your profile for smart matching</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fill out your crypto interests, location, and preferences to see AI-powered matches!
                </p>
                <Button onClick={() => navigate('/profile')}>
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
