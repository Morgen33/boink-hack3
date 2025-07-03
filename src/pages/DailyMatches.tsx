
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useDailyMatches } from '@/hooks/useDailyMatches';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Users, Clock, Target } from 'lucide-react';

const DailyMatches = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfileData();
  const { matches, loading: matchesLoading, error, currentMatch, hasMoreMatches, nextMatch, markAsLiked } = useDailyMatches(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    
    if (!loading && profile && !profile.profile_completed) {
      navigate('/profile');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-border border-t-web3-red"></div>
        </div>
      </div>
    );
  }

  if (!user || !profile?.profile_completed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-web3-red" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
                Your Daily Matches
              </h1>
              <Sparkles className="w-8 h-8 text-web3-magenta" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've curated these special matches just for you based on your crypto vibes and preferences! 🚀
            </p>
          </div>

          {/* Daily Matches Content */}
          {matchesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-border border-t-web3-red"></div>
            </div>
          ) : error ? (
            <Card className="border-destructive/50">
              <CardContent className="text-center py-8">
                <p className="text-destructive mb-4">Error loading daily matches: {error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : matches.length === 0 ? (
            <Card className="border-2 border-dashed border-border">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Clock className="w-6 h-6 text-web3-cyan" />
                  No Fresh Matches Today
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground">
                  Your daily matches are being prepared! Check back tomorrow or explore more profiles in Discover.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/discover')}
                    className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Explore All Profiles
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/profile?edit=true')}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Optimize My Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Match Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    <Target className="w-4 h-4 mr-1" />
                    {matches.length} Daily Match{matches.length !== 1 ? 'es' : ''}
                  </Badge>
                  {currentMatch && (
                    <Badge variant="secondary" className="text-sm">
                      <Heart className="w-4 h-4 mr-1" />
                      {Math.round(currentMatch.compatibility_score * 100)}% Compatible
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {matches.length - (hasMoreMatches ? 0 : 1)} remaining
                </div>
              </div>

              {/* Current Match */}
              {currentMatch && (
                <div className="max-w-md mx-auto">
                  <ProfileCard
                    profile={currentMatch.profile}
                    onLike={() => {
                      markAsLiked(currentMatch.id, true);
                      if (hasMoreMatches) {
                        nextMatch();
                      }
                    }}
                    onPass={() => {
                      markAsLiked(currentMatch.id, false);
                      if (hasMoreMatches) {
                        nextMatch();
                      }
                    }}
                  />
                  
                  {/* Compatibility Breakdown */}
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Compatibility Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {currentMatch.match_breakdown && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Gender Preferences</span>
                            <Badge variant="outline">
                              {Math.round(currentMatch.match_breakdown.genderMatch * 100)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Age Compatibility</span>
                            <Badge variant="outline">
                              {Math.round(currentMatch.match_breakdown.ageCompatibility * 100)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Location Score</span>
                            <Badge variant="outline">
                              {Math.round(currentMatch.match_breakdown.locationScore * 100)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Shared Interests</span>
                            <Badge variant="outline">
                              {Math.round(currentMatch.match_breakdown.interestMatch * 100)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Crypto Compatibility</span>
                            <Badge variant="outline">
                              {Math.round(currentMatch.match_breakdown.cryptoCompatibility * 100)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Relationship Goals</span>
                            <Badge variant="outline">
                              {Math.round(currentMatch.match_breakdown.relationshipMatch * 100)}%
                            </Badge>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* All matches exhausted */}
              {!hasMoreMatches && !currentMatch && (
                <Card className="text-center">
                  <CardContent className="py-8">
                    <Heart className="w-12 h-12 text-web3-red mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">That's All for Today!</h3>
                    <p className="text-muted-foreground mb-4">
                      Come back tomorrow for fresh matches, or explore more profiles in Discover.
                    </p>
                    <Button 
                      onClick={() => navigate('/discover')}
                      className="bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Continue Exploring
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyMatches;
