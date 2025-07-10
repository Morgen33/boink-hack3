import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Zap, Shield } from 'lucide-react';
import AgeVerificationModal from '@/components/AgeVerificationModal';

interface PlatformIntentStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const PlatformIntentStep = ({ data, onUpdate }: PlatformIntentStepProps) => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const handleIntentSelection = (intent: 'dating' | 'networking' | 'both') => {
    if (!isAgeVerified) return;
    onUpdate({ platform_intent: intent });
  };

  return (
    <>
      <AgeVerificationModal 
        isOpen={!isAgeVerified} 
        onVerified={() => setIsAgeVerified(true)} 
      />
      
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Welcome to Boink
          </h2>
          <p className="text-muted-foreground">
            What brings you to our Web3 community?
          </p>
        </div>

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

        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-300 ${!isAgeVerified ? 'opacity-50 pointer-events-none' : ''}`}>
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${data.platform_intent === 'dating' ? 'ring-2 ring-pink-500' : ''}`}
            onClick={() => handleIntentSelection('dating')}
          >
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
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${data.platform_intent === 'networking' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleIntentSelection('networking')}
          >
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
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${data.platform_intent === 'both' ? 'ring-2 ring-web3-red' : ''}`}
            onClick={() => handleIntentSelection('both')}
          >
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
            </CardContent>
          </Card>
        </div>

        {data.platform_intent && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg">
              <Shield className="w-4 h-4" />
              <span className="font-medium">
                {data.platform_intent === 'dating' && "Ready for Dating!"}
                {data.platform_intent === 'networking' && "Ready for Networking!"}
                {data.platform_intent === 'both' && "Ready for Everything!"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlatformIntentStep;