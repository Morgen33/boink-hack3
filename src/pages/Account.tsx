import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import { Heart, Users, CheckCircle, Circle, User, MapPin, Calendar, MessageCircle, Send, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import { useConversations } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';

interface ProfileStats {
  dating_profile_completed: boolean;
  networking_profile_completed: boolean;
  platform_intent: 'dating' | 'networking' | 'both' | null;
  full_name: string | null;
  location: string | null;
  age: number | null;
}

const Account = () => {
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [intentLoading, setIntentLoading] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { conversations, loading: conversationsLoading, getUnreadCount } = useConversations(user);

  useEffect(() => {
    // Wait for auth to finish loading before making decisions
    if (authLoading) {
      return;
    }

    if (!user) {
      console.log('❌ No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    console.log('👤 Fetching profile for user:', user.email);

    const fetchProfileStats = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dating_profile_completed, networking_profile_completed, platform_intent, full_name, location, age')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ Error fetching profile:', error);
          throw error;
        }
        
        console.log('📊 Profile data loaded:', data);
        setProfileStats(data);
      } catch (error: any) {
        console.error('❌ Error fetching profile stats:', error);
        toast({
          title: "Error",
          description: "Failed to load account information. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [user, authLoading, navigate, toast]);

  const calculateOverallProgress = () => {
    if (!profileStats) return 0;
    
    const intentRequiredProfiles = [];
    
    if (profileStats.platform_intent === 'dating') {
      intentRequiredProfiles.push(profileStats.dating_profile_completed);
    } else if (profileStats.platform_intent === 'networking') {
      intentRequiredProfiles.push(profileStats.networking_profile_completed);
    } else if (profileStats.platform_intent === 'both') {
      intentRequiredProfiles.push(profileStats.dating_profile_completed, profileStats.networking_profile_completed);
    }
    
    const completedCount = intentRequiredProfiles.filter(Boolean).length;
    return intentRequiredProfiles.length > 0 ? (completedCount / intentRequiredProfiles.length) * 100 : 0;
  };

  const isProfileComplete = () => {
    if (!profileStats) return false;
    
    if (profileStats.platform_intent === 'dating') {
      return profileStats.dating_profile_completed;
    } else if (profileStats.platform_intent === 'networking') {
      return profileStats.networking_profile_completed;
    } else if (profileStats.platform_intent === 'both') {
      return profileStats.dating_profile_completed && profileStats.networking_profile_completed;
    }
    
    return false;
  };
  
  const getProfilePhoto = (photoUrls: string[] | null, avatarUrl: string | null) => {
    if (photoUrls && photoUrls.length > 0) {
      return photoUrls[0];
    }
    return avatarUrl;
  };

  const handleIntentSelection = async (intent: 'dating' | 'networking' | 'both') => {
    if (!user || !isAgeVerified) return;
    
    setIntentLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ platform_intent: intent })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setProfileStats(prev => prev ? { ...prev, platform_intent: intent } : null);
      
      toast({
        title: "Great choice!",
        description: "Your platform intent has been set. Complete your profile to get started.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIntentLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading your account...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold text-muted-foreground">Setting up your profile...</h1>
            <p className="text-lg text-muted-foreground">
              It looks like your profile is still being created. This usually takes just a few seconds.
            </p>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has no platform intent yet, show selection inline
  const showPlatformIntentSelection = profileStats && !profileStats.platform_intent;

  return (
    <>
      <AgeVerificationModal 
        isOpen={showPlatformIntentSelection && !isAgeVerified} 
        onVerified={() => setIsAgeVerified(true)} 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Platform Intent Selection - Show first if not set */}
            {showPlatformIntentSelection && (
              <div className="space-y-6">
                {/* Age Verification Notice */}
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-3 text-center justify-center">
                    <Shield className="w-5 h-5 text-destructive" />
                    <span className="font-semibold text-destructive">18+ Only Platform</span>
                    <Shield className="w-5 h-5 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    This platform is restricted to adults only. Age verification is required by law.
                  </p>
                </div>
                
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-4">
                    Welcome to Boink
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    What brings you to our Web3 community?
                  </p>
                </div>

                <div className={`grid md:grid-cols-3 gap-6 transition-all duration-300 ${!isAgeVerified ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleIntentSelection('dating')}>
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Dating</CardTitle>
                      <CardDescription>
                        Find romantic connections in the Web3 space
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                        <li>• Match with crypto enthusiasts</li>
                        <li>• Share your DeFi adventures</li>
                        <li>• Find your NFT partner</li>
                        <li>• Build romantic connections</li>
                      </ul>
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90"
                        disabled={intentLoading || !isAgeVerified}
                      >
                        {intentLoading ? 'Setting...' : "I'm here for Dating"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleIntentSelection('networking')}>
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Networking</CardTitle>
                      <CardDescription>
                        Connect professionally in Web3
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                        <li>• Find co-founders & partners</li>
                        <li>• Connect with investors</li>
                        <li>• Hire Web3 talent</li>
                        <li>• Share expertise & learn</li>
                      </ul>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                        disabled={intentLoading || !isAgeVerified}
                      >
                        {intentLoading ? 'Setting...' : "I'm here for Networking"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleIntentSelection('both')}>
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Both</CardTitle>
                      <CardDescription>
                        Open to all connections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                        <li>• Dating & professional networking</li>
                        <li>• Appear in both discovery pools</li>
                        <li>• Maximum connection potential</li>
                        <li>• Complete flexibility</li>
                      </ul>
                      <Button 
                        className="w-full bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
                        disabled={intentLoading || !isAgeVerified}
                      >
                        {intentLoading ? 'Setting...' : 'I want Both'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Regular Account Content - Show after platform intent is set */}
            {!showPlatformIntentSelection && (
              <>
                {/* Account Header */}
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
                    Your Account
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Complete your profiles to unlock the full Boink experience
                  </p>
                </div>

                {/* Basic Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Your core profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {profileStats.full_name ? (
                          <span className="font-medium">{profileStats.full_name}</span>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/profile')}
                            className="text-xs"
                          >
                            Add Your Name
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{profileStats.location || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{profileStats.age ? `${profileStats.age} years old` : 'Not specified'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>


                {/* Unified Profile Completion */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-6 h-6 text-web3-orange" />
                        <CardTitle>Complete Your Profile</CardTitle>
                      </div>
                      {isProfileComplete() ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>
                      {profileStats.platform_intent === 'dating' && 'Set up your dating preferences, photos, and crypto interests'}
                      {profileStats.platform_intent === 'networking' && 'Build your professional Web3 networking profile'}
                      {profileStats.platform_intent === 'both' && 'Complete both your dating and professional profiles'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(calculateOverallProgress())}%</span>
                      </div>
                      <Progress value={calculateOverallProgress()} className="h-2" />
                    </div>
                    
                    {!isProfileComplete() && (
                      <div className="bg-gradient-to-r from-web3-yellow/10 to-web3-orange/10 p-4 rounded-lg border border-web3-orange/20">
                        <p className="text-sm text-muted-foreground mb-2">
                          Complete your profile to:
                        </p>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-web3-red rounded-full" />
                            Get better matches with AI-powered compatibility
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-web3-red rounded-full" />
                            Access daily curated matches
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-web3-red rounded-full" />
                            Connect with the Web3 community
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <Button
                        onClick={() => navigate('/profile/comprehensive')}
                        className="w-full bg-gradient-to-r from-web3-red to-web3-magenta hover:from-web3-red/90 hover:to-web3-magenta/90 text-white"
                      >
                        {isProfileComplete() ? 'Edit Profile' : 'Complete Profile'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Messages Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-web3-red" />
                      Messages
                    </CardTitle>
                    <CardDescription>
                      Your recent conversations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {conversationsLoading ? (
                      <div className="text-center py-4">Loading conversations...</div>
                    ) : conversations.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          No conversations yet. Start discovering to get matches!
                        </p>
                        <Button onClick={() => navigate('/discover')}>
                          <Heart className="w-4 h-4 mr-2" />
                          Start Discovering
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {conversations.slice(0, 3).map((conversation) => {
                          const unreadCount = getUnreadCount(conversation);
                          const otherUser = conversation.other_user;
                          
                          if (!otherUser) return null;

                          return (
                            <div 
                              key={conversation.id}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => navigate('/messages')}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage 
                                  src={getProfilePhoto(otherUser.photo_urls, otherUser.avatar_url) || undefined} 
                                />
                                <AvatarFallback>
                                  {otherUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium truncate">
                                    {otherUser.full_name}
                                  </h4>
                                  {unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.last_message_preview || 'Start a conversation...'}
                                </p>
                                
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                                </p>
                              </div>

                              <Send className="w-4 h-4 text-muted-foreground" />
                            </div>
                          );
                        })}
                        
                        {conversations.length > 3 && (
                          <Button variant="outline" className="w-full" onClick={() => navigate('/messages')}>
                            View All Messages ({conversations.length})
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common account management tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" onClick={() => navigate('/discover')}>
                        Start Discovering
                      </Button>
                      {(profileStats.dating_profile_completed || profileStats.networking_profile_completed) && (
                        <Button variant="outline" onClick={() => navigate('/daily-matches')}>
                          View Daily Matches
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;