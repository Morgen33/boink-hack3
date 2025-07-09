import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PlatformIntent = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleIntentSelection = async (intent: 'dating' | 'networking' | 'both') => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ platform_intent: intent })
        .eq('id', user.id);

      if (error) throw error;

      // Navigate based on intent
      if (intent === 'dating') {
        navigate('/profile/setup/dating');
      } else if (intent === 'networking') {
        navigate('/profile/setup/networking');
      } else {
        navigate('/profile/setup/combined');
      }
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-4">
            Welcome to Boink
          </h1>
          <p className="text-xl text-muted-foreground">
            What brings you to our Web3 community?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                I want Both
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformIntent;