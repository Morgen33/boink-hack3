import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Zap, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AgeVerificationModal from '@/components/AgeVerificationModal';

const PlatformIntent = () => {
  const [loading, setLoading] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  
  // Add diagnostic logging
  console.log('🔍 PlatformIntent component mounting');
  
  let user, navigate, toast;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    navigate = useNavigate();
    toast = useToast().toast;
    
    console.log('✅ Auth context loaded, user:', user?.email || 'No user');
    console.log('✅ Navigate and toast loaded successfully');
  } catch (error) {
    console.error('❌ Critical error loading hooks:', error);
    return (
      <div style={{ background: 'white', color: 'black', padding: '20px', minHeight: '100vh' }}>
        <h1>Authentication Error</h1>
        <p>There was a problem loading the authentication system.</p>
        <p>Error: {error?.toString()}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px', margin: '10px', background: 'blue', color: 'white' }}>
          Reload Page
        </button>
      </div>
    );
  }

  const handleIntentSelection = async (intent: 'dating' | 'networking' | 'both') => {
    if (!user || !isAgeVerified) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ platform_intent: intent })
        .eq('id', user.id);

      if (error) throw error;

      // Navigate to account dashboard
      navigate('/account');
      
      toast({
        title: "Great choice!",
        description: "Let's set up your profile.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Emergency fallback if no user
  if (!user) {
    console.log('❌ No user found in PlatformIntent');
    return (
      <div style={{ background: 'white', color: 'black', padding: '20px', minHeight: '100vh' }}>
        <h1>Loading user authentication...</h1>
        <p>If this persists, please refresh the page.</p>
        <button onClick={() => window.location.href = '/auth'} style={{ padding: '10px', margin: '10px', background: 'blue', color: 'white' }}>
          Go to Sign In
        </button>
        <button onClick={() => window.location.reload()} style={{ padding: '10px', margin: '10px', background: 'green', color: 'white' }}>
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <>
      <AgeVerificationModal 
        isOpen={!isAgeVerified} 
        onVerified={() => setIsAgeVerified(true)} 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center p-4"
           style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(255, 255, 255, 1) 50%, rgba(236, 72, 153, 0.1) 100%)', minHeight: '100vh' }}>
        <div className="max-w-4xl w-full">
          {/* Age Verification Notice */}
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
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
                  disabled={loading || !isAgeVerified}
                >
                  I'm here for Dating
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
                  disabled={loading || !isAgeVerified}
                >
                  I'm here for Networking
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
                  disabled={loading || !isAgeVerified}
                >
                  I want Both
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlatformIntent;