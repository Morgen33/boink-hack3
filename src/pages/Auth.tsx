
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { MINIMUM_AGE } from '@/utils/ageVerification';
import { AuthForm } from '@/components/auth/AuthForm';
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
            Welcome to Boink
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : `Create your account (${MINIMUM_AGE}+ only)`}
          </CardDescription>
          {!isLogin && (
            <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                🔞 This platform is restricted to users 18 and over
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleSignIn loading={loading} setLoading={setLoading} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <AuthForm 
            isLogin={isLogin} 
            onToggleMode={() => setIsLogin(!isLogin)}
            loading={loading}
            setLoading={setLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
