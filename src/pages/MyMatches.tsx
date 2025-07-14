import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserLikes } from '@/hooks/useUserLikes';
import ProfileCard from '@/components/ProfileCard';
import MessageButton from '@/components/MessageButton';

import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MyMatches = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { likedProfiles, mutualMatches, loading } = useUserLikes();

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
            <h1 className="text-3xl font-bold mb-4">Sign in to View Matches</h1>
            <p className="text-muted-foreground mb-6">
              Create an account to start liking profiles and see your matches!
            </p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleViewProfile = (profile: any) => {
    navigate(`/profile/${profile.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-4">
              My Matches 💕
            </h1>
            <p className="text-muted-foreground">
              Track your likes and discover mutual connections
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="mutual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="mutual" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Mutual Matches ({mutualMatches.length})
                </TabsTrigger>
                <TabsTrigger value="liked" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Profiles I Liked ({likedProfiles.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mutual">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Mutual Matches ✨</h2>
                    <p className="text-muted-foreground">
                      These amazing people liked you back! Time to make a move 🚀
                    </p>
                  </div>
                  
                  {mutualMatches.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">No mutual matches yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Keep liking profiles in Discover - your perfect match might be just around the corner!
                        </p>
                        <Button onClick={() => navigate('/discover')}>
                          Continue Discovering
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mutualMatches.map((profile) => (
                        <div key={profile.id} className="relative">
                          <div className="absolute top-4 left-4 z-10">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              💕 Mutual Match!
                            </div>
                          </div>
                          <ProfileCard
                            profile={profile}
                            onLike={() => {}}
                            onPass={() => {}}
                            onClick={() => handleViewProfile(profile)}
                          />
                          <div className="mt-3">
                            <MessageButton 
                              targetUserId={profile.id}
                              variant="outline"
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="liked">
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Profiles I Liked ❤️</h2>
                    <p className="text-muted-foreground">
                      These are the profiles you've shown interest in
                    </p>
                  </div>
                  
                  {likedProfiles.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg mb-2">No likes yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start exploring profiles and heart the ones you're interested in!
                        </p>
                        <Button onClick={() => navigate('/discover')}>
                          Start Discovering
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {likedProfiles.map((profile) => (
                        <div key={profile.id}>
                          <ProfileCard
                            profile={profile}
                            onLike={() => {}}
                            onPass={() => {}}
                            onClick={() => handleViewProfile(profile)}
                          />
                          <div className="mt-3">
                            <MessageButton 
                              targetUserId={profile.id}
                              variant="outline"
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMatches;