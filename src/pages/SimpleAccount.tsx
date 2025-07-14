import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, User } from 'lucide-react';

const SimpleAccount = () => {
  const { user, loading } = useSimpleAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-web3-red"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
              Welcome to Boink!
            </CardTitle>
            <CardDescription>
              You're successfully signed in. Complete your profile to start matching!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <User className="w-8 h-8" />
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Signed in via {user.app_metadata?.provider || 'email'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/profile/setup')} 
                className="w-full"
                size="lg"
              >
                Complete Your Profile
              </Button>
              
              <Button 
                onClick={() => navigate('/platform-intent')} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                Set Platform Intent
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                variant="ghost" 
                className="w-full"
                size="lg"
              >
                Continue to App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleAccount;