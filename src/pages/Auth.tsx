
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateAge, isUserAdult, getAgeVerificationError, MINIMUM_AGE } from '@/utils/ageVerification';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // STRICT age check - must be exactly 18+ or signup is blocked
  const calculatedAge = dateOfBirth ? calculateAge(dateOfBirth) : 0;
  const isUserOldEnough = dateOfBirth ? isUserAdult(dateOfBirth) && calculatedAge >= MINIMUM_AGE : true;

  // Check URL parameters for auth errors
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('Auth error from URL:', error, errorDescription);
      toast({
        title: "Authentication Error",
        description: errorDescription || error,
        variant: "destructive",
      });
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        navigate('/');
      } else {
        // STRICT age validation before signup
        if (!dateOfBirth) {
          throw new Error('Date of birth is required for registration');
        }
        
        const validatedAge = calculateAge(dateOfBirth);
        
        // Multiple validation layers
        if (!isUserAdult(dateOfBirth) || validatedAge < MINIMUM_AGE || validatedAge <= 0) {
          throw new Error(`REGISTRATION BLOCKED: ${getAgeVerificationError()}`);
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              date_of_birth: dateOfBirth,
              age: validatedAge.toString()
            }
          }
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign in...');
      console.log('Current origin:', window.location.origin);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Google auth error:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google Sign-in Error",
        description: error.message || "Failed to sign in with Google. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                🔞 This platform is restricted to users {MINIMUM_AGE} years and older
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  disabled={loading}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - MINIMUM_AGE)).toISOString().split('T')[0]}
                />
                 {dateOfBirth && !isUserOldEnough && (
                  <div className="space-y-1">
                    <p className="text-sm text-red-600 flex items-center gap-1 font-semibold">
                      🚫 REGISTRATION BLOCKED: Must be {MINIMUM_AGE}+ years old
                    </p>
                    <p className="text-xs text-red-500">
                      Current age: {calculatedAge} years. This platform is strictly for adults only.
                    </p>
                  </div>
                )}
                {dateOfBirth && isUserOldEnough && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    ✅ Age verified ({calculatedAge} years old)
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90"
              disabled={loading || (!isLogin && !isUserOldEnough)}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
