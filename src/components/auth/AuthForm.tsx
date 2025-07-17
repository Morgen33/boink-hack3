import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateAge, isUserAdult, getAgeVerificationError, MINIMUM_AGE } from '@/utils/ageVerification';
import { AgeVerification } from './AgeVerification';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { sanitizeInput } from '@/utils/securityUtils';

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const AuthForm = ({ isLogin, onToggleMode, loading, setLoading }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const { toast } = useToast();
  const { validateInput, checkRateLimit, secureFormSubmit, csrfToken } = useEnhancedSecurity();

  // STRICT age check - must be exactly 18+ or signup is blocked
  const calculatedAge = dateOfBirth ? calculateAge(dateOfBirth) : 0;
  const isUserOldEnough = dateOfBirth ? isUserAdult(dateOfBirth) && calculatedAge >= MINIMUM_AGE : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const action = isLogin ? 'login' : 'signup';
    if (!checkRateLimit(action, 5)) {
      return;
    }

    const formData = {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      location: location.trim(),
      dateOfBirth,
      csrf_token: csrfToken
    };

    await secureFormSubmit(
      formData,
      async (data) => {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
          if (error) throw error;
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
        } else {
          // STRICT age validation before signup
          if (!data.dateOfBirth) {
            throw new Error('Date of birth is required for registration');
          }
          
          const validatedAge = calculateAge(data.dateOfBirth);
          
          // Multiple validation layers
          if (!isUserAdult(data.dateOfBirth) || validatedAge < MINIMUM_AGE || validatedAge <= 0) {
            throw new Error(`REGISTRATION BLOCKED: ${getAgeVerificationError()}`);
          }

          const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              emailRedirectTo: `${window.location.origin}/account`,
              data: {
                full_name: sanitizeInput(data.fullName),
                location: sanitizeInput(data.location),
                date_of_birth: data.dateOfBirth,
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
      },
      {
        requireCSRF: true,
        rateLimit: { action, maxAttempts: 5 },
        validateFields: isLogin ? ['email'] : ['email', 'fullName', 'location']
      }
    ).catch((error: any) => {
      console.error('Email auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </>
      )}
      
      {!isLogin && (
        <AgeVerification
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          loading={loading}
          calculatedAge={calculatedAge}
          isUserOldEnough={isUserOldEnough}
        />
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
        disabled={loading || (!isLogin && (!isUserOldEnough || !fullName.trim() || !location.trim()))}
      >
        {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-muted-foreground hover:text-foreground"
          disabled={loading}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </form>
  );
};