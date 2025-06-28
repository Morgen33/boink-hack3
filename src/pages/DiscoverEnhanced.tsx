
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedMatching } from '@/hooks/useEnhancedMatching';
import ProfileCard from '@/components/ProfileCard';
import MatchScore from '@/components/MatchScore';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DiscoverEnhanced = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showMatchScore, setShowMatchScore] = useState(false);
  const { 
    currentProfile, 
    hasMoreProfiles, 
    nextProfile, 
    loading,
    userProfile 
  } = useEnhancedMatching(user);

  // Mock compatibility score for demo (in real app, this would come from the matching hook)
  const mockScore = {
    score: 0.78,
    breakdown: {
      genderMatch: 1.0,
      ageCompatibility: 0.8,
      locationScore: 0.6,
      interestMatch: 0.85,
      cryptoCompatibility: 0.72,
      relationshipMatch: 0.9,
    }
  };

  const handleLike = () => {
    console.log('Liked profile:', currentProfile?.id);
    nextProfile();
  };

  const handlePass = () => {
    console.log('Passed on profile:', currentProfile?.id);
    nextProfile();
  };

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
              Smart Discover ✨
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered crypto compatibility matching
            </p>
            {userProfile && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing matches based on your complete profile
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : currentProfile ? (
            <div className="space-y-4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="compatibility">Match Score</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4">
                  <ProfileCard
                    profile={currentProfile}
                    onLike={handleLike}
                    onPass={handlePass}
                  />
                </TabsContent>
                
                <TabsContent value="compatibility" className="space-y-4">
                  <MatchScore 
                    score={mockScore.score} 
                    breakdown={mockScore.breakdown} 
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={handlePass}
                    >
                      Pass
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-web3-red to-web3-magenta" 
                      onClick={handleLike}
                    >
                      Like
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {!hasMoreProfiles && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">No more compatible profiles</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check back later for more crypto matches, or update your preferences!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/profile?edit=true')}
                      className="gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Update Preferences
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Complete your profile for better matches</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fill out your crypto interests, location, and preferences to see compatible matches!
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

export default DiscoverEnhanced;
