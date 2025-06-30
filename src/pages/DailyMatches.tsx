
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Users } from 'lucide-react';

const DailyMatches = () => {
  const { user } = useAuth();
  const { profile, loading } = useProfileData();
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
          <div className="grid gap-6">
            {/* Coming Soon Card for now */}
            <Card className="border-2 border-dashed border-border">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Users className="w-6 h-6 text-web3-cyan" />
                  Daily Matches Coming Soon!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground">
                  Our AI matchmaking algorithm is working hard to find your perfect crypto companion! 
                  In the meantime, check out all available profiles in Discover.
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

                {/* Feature Preview */}
                <div className="mt-8 p-6 bg-gradient-to-r from-web3-red/10 to-web3-magenta/10 rounded-lg border border-web3-red/20">
                  <h3 className="font-semibold text-lg mb-3">What's Coming:</h3>
                  <ul className="text-left space-y-2 text-muted-foreground max-w-md mx-auto">
                    <li>• 🎯 AI-powered compatibility matching</li>
                    <li>• 💎 Crypto portfolio alignment scoring</li>
                    <li>• 🔥 Fresh matches delivered daily</li>
                    <li>• ⚡ Smart notification system</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMatches;
