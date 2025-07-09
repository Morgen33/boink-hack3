import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { Heart, Users, CheckCircle, Circle, User, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfileStats = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('dating_profile_completed, networking_profile_completed, platform_intent, full_name, location, age')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfileStats(data);
      } catch (error: any) {
        console.error('Error fetching profile stats:', error);
        toast({
          title: "Error",
          description: "Failed to load account information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [user, navigate, toast]);

  const calculateDatingProgress = () => {
    if (!profileStats) return 0;
    return profileStats.dating_profile_completed ? 100 : 0;
  };

  const calculateNetworkingProgress = () => {
    if (!profileStats) return 0;
    return profileStats.networking_profile_completed ? 100 : 0;
  };

  const showDatingCard = profileStats?.platform_intent === 'dating' || profileStats?.platform_intent === 'both';
  const showNetworkingCard = profileStats?.platform_intent === 'networking' || profileStats?.platform_intent === 'both';

  if (loading) {
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Failed to load account information.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
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
                Your core profile information (set during signup)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{profileStats.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{profileStats.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{profileStats.age} years old</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Intent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Platform Intent
              </CardTitle>
              <CardDescription>
                What you're here for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {profileStats.platform_intent === 'dating' && 'Dating'}
                {profileStats.platform_intent === 'networking' && 'Professional Networking'}
                {profileStats.platform_intent === 'both' && 'Dating & Networking'}
              </Badge>
            </CardContent>
          </Card>

          {/* Profile Completion Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {showDatingCard && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-6 h-6 text-pink-500" />
                      <CardTitle>Dating Profile</CardTitle>
                    </div>
                    {profileStats.dating_profile_completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription>
                    Set up your dating preferences, photos, and crypto interests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{calculateDatingProgress()}%</span>
                    </div>
                    <Progress value={calculateDatingProgress()} className="h-2" />
                  </div>
                  <Button
                    onClick={() => navigate('/profile/setup/dating')}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90"
                  >
                    {profileStats.dating_profile_completed ? 'Edit Dating Profile' : 'Complete Dating Profile'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {showNetworkingCard && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-6 h-6 text-blue-500" />
                      <CardTitle>Professional Profile</CardTitle>
                    </div>
                    {profileStats.networking_profile_completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription>
                    Build your professional Web3 networking profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{calculateNetworkingProgress()}%</span>
                    </div>
                    <Progress value={calculateNetworkingProgress()} className="h-2" />
                  </div>
                  <Button
                    onClick={() => navigate('/profile/setup/networking')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    {profileStats.networking_profile_completed ? 'Edit Professional Profile' : 'Complete Professional Profile'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

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
                <Button variant="outline" onClick={() => navigate('/platform-intent')}>
                  Change Platform Intent
                </Button>
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
        </div>
      </div>
    </div>
  );
};

export default Account;