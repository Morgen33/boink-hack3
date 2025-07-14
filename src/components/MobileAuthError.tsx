import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, User, AlertCircle } from 'lucide-react';

const MobileAuthError = () => {
  const handleContinue = () => {
    window.location.href = '/account';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Something went wrong
          </CardTitle>
          <CardDescription>
            There was an issue loading the page. Let's get you back on track.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-web3-red to-web3-magenta hover:from-web3-red/90 hover:to-web3-magenta/90 text-white"
            size="lg"
          >
            <User className="w-4 h-4 mr-2" />
            Continue to Account
          </Button>
          
          <Button
            onClick={handleReload}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Reload Page
          </Button>
          
          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="text-sm"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAuthError;