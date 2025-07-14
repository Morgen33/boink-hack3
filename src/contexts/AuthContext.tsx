import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isNewUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
  clearNewUserFlag: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const checkProfileCompletion = async (userId: string) => {
    try {
      console.log('🔍 Checking profile completion for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('profile_completed, platform_intent')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error checking profile completion:', error);
        return { completed: false, error: true, needsPlatformIntent: false };
      }

      const hasPlatformIntent = profile?.platform_intent !== null;
      const isCompleted = profile?.profile_completed === true;
      
      console.log('📊 Profile completion status:', {
        userId,
        profile_completed: isCompleted,
        platform_intent: profile?.platform_intent,
        hasPlatformIntent
      });

      return { 
        completed: isCompleted, 
        error: false, 
        needsPlatformIntent: !hasPlatformIntent 
      };
    } catch (error) {
      console.error('❌ Error in checkProfileCompletion:', error);
      return { completed: false, error: true, needsPlatformIntent: false };
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Simplified auth state handler for mobile compatibility
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        try {
          console.log('🔄 Auth state changed:', event, session?.user?.email);
          
          if (!mounted) return;
          
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Simple new user detection without complex async operations
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ User signed in');
            setIsNewUser(true); // Default to new user, will be updated later
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setIsNewUser(false);
          }
        } catch (error) {
          console.error('❌ Auth state change error:', error);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    // Simple initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      try {
        if (error) {
          console.error('❌ Session error:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('🚀 Initial session check:', session?.user?.email || 'No user');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          setIsNewUser(true); // Will be updated by profile check later
        }
      } catch (error) {
        console.error('❌ Initial session check error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }).catch(error => {
      console.error('❌ Get session promise error:', error);
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleTwitterConnection = async (user: User) => {
    try {
      const twitterUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username;
      const twitterProfileUrl = `https://twitter.com/${twitterUsername}`;

      if (twitterUsername) {
        const { data: existingConnection } = await supabase
          .from('social_media_connections')
          .select('id')
          .eq('user_id', user.id)
          .eq('platform', 'twitter')
          .single();

        if (!existingConnection) {
          await supabase
            .from('social_media_connections')
            .insert({
              user_id: user.id,
              platform: 'twitter',
              username: twitterUsername,
              profile_url: twitterProfileUrl,
              oauth_provider: 'twitter',
              oauth_provider_id: user.user_metadata?.provider_id,
              verified: true,
            });
        }
      }
    } catch (error) {
      console.error('Error handling Twitter connection:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Force a page reload after OAuth for mobile compatibility
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithTwitter = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${window.location.origin}/profile`
      }
    });
    if (error) {
      console.error('Error signing in with Twitter:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const clearNewUserFlag = () => {
    console.log('🔄 Manually clearing new user flag');
    setIsNewUser(false);
  };

  const value = {
    user,
    session,
    loading,
    isNewUser,
    signInWithGoogle,
    signInWithTwitter,
    signOut,
    clearNewUserFlag,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
