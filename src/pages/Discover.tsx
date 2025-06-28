
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMatchingProfiles } from '@/hooks/useMatchingProfiles';
import ProfileCard from '@/components/ProfileCard';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    currentProfile, 
    hasMoreProfiles, 
    nextProfile, 
    loading,
    userProfile 
  } = useMatchingProfiles(user);

  const handleLike = () => {
    console.log('Liked profile:', currentProfile?.id);
    // TODO: Implement like functionality (save to database)
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
              Discover 💎
            </h1>
            <p className="text-muted-foreground mt-2">
              Find your crypto tribe
            </p>
            {userProfile && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing matches based on your preferences
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : currentProfile ? (
            <div className="space-y-4">
              <ProfileCard
                profile={currentProfile}
                onLike={handleLike}
                onPass={handlePass}
              />
              
              {!hasMoreProfiles && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">No more profiles</h3>
                    <p className="text-sm text-muted-foreground">
                      Check back later for more crypto enthusiasts!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No profiles available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your profile to start seeing matches!
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
