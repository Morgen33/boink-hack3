import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, ChevronRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CombinedProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'dating' | 'networking' | null>(null);

  const handleProfileTypeSelection = (type: 'dating' | 'networking') => {
    setSelectedType(type);
    
    if (type === 'dating') {
      navigate('/profile/setup/dating');
    } else {
      navigate('/profile/setup/networking');
    }
    
    toast({
      title: "Profile Setup Started",
      description: `Let's set up your ${type} profile first. You can complete the other one anytime.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent mb-4">
            Set Up Your Profiles
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            You chose to use both Dating and Professional Networking
          </p>
          <p className="text-muted-foreground">
            Choose which profile to set up first. You can complete the other one anytime later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Dating Profile Setup */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleProfileTypeSelection('dating')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Dating Profile</CardTitle>
              <CardDescription>
                Connect romantically with other Web3 enthusiasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Personal photos & bio</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Dating preferences & interests</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Crypto personality & lifestyle</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Smart matching algorithm</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 flex items-center gap-2"
                disabled={selectedType !== null}
              >
                Set Up Dating Profile
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Professional Networking Setup */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleProfileTypeSelection('networking')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Professional Profile</CardTitle>
              <CardDescription>
                Network professionally in the Web3 ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional background & expertise</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Networking goals & preferences</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Industry connections & opportunities</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional portfolio showcase</span>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 flex items-center gap-2"
                disabled={selectedType !== null}
              >
                Set Up Professional Profile
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Don't worry - you can set up the other profile anytime from your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default CombinedProfileSetup;