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
        .select('profile_completed')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error checking profile completion:', error);
        return false;
      }

      const isCompleted = profile?.profile_completed === true;
      console.log('📊 Profile completion status:', {
        userId,
        profile_completed: isCompleted,
        raw_value: profile?.profile_completed
      });

      return isCompleted;
    } catch (error) {
      console.error('❌ Error in checkProfileCompletion:', error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in, checking profile status...');
          
          // Use setTimeout to avoid potential deadlocks with Supabase
          setTimeout(async () => {
            try {
              const isProfileCompleted = await checkProfileCompletion(session.user.id);
              
              // Set isNewUser based on profile completion status
              if (isProfileCompleted) {
                console.log('✅ Profile is completed - clearing new user flag');
                setIsNewUser(false);
              } else {
                console.log('⚠️ Profile is not completed - setting new user flag');
                setIsNewUser(true);
              }

              // Handle Twitter OAuth connection after successful authentication
              const provider = session.user.app_metadata?.provider;
              if (provider === 'twitter') {
                handleTwitterConnection(session.user);
              }
            } catch (error) {
              console.error('❌ Error checking profile after sign in:', error);
              // Default to new user if we can't check profile
              setIsNewUser(true);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out - clearing new user flag');
          setIsNewUser(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🚀 Initial session check:', session?.user?.email || 'No user');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Check profile completion for initial session
      if (session?.user) {
        setTimeout(async () => {
          try {
            const isProfileCompleted = await checkProfileCompletion(session.user.id);
            setIsNewUser(!isProfileCompleted);
            console.log('📊 Initial profile check - isNewUser:', !isProfileCompleted);
          } catch (error) {
            console.error('❌ Error in initial profile check:', error);
            setIsNewUser(true);
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTwitterConnection = async (user: User) => {
    try {
      // Extract Twitter username from user metadata
      const twitterUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username;
      const twitterProfileUrl = `https://twitter.com/${twitterUsername}`;

      if (twitterUsername) {
        // Check if Twitter connection already exists
        const { data: existingConnection } = await supabase
          .from('social_media_connections')
          .select('id')
          .eq('user_id', user.id)
          .eq('platform', 'twitter')
          .single();

        if (!existingConnection) {
          // Add Twitter connection to social_media_connections table
          await supabase
            .from('social_media_connections')
            .insert({
              user_id: user.id,
              platform: 'twitter',
              username: twitterUsername,
              profile_url: twitterProfileUrl,
              oauth_provider: 'twitter',
              oauth_provider_id: user.user_metadata?.provider_id,
              verified: true, // OAuth connections are considered verified
            });
        }
      }
    } catch (error) {
      console.error('Error handling Twitter connection:', error);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) {
      console.error('Error signing in with Google:', error);
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
