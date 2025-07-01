
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

  const checkProfileCompletion = async (userId: string): Promise<{ isCompleted: boolean; hasError: boolean }> => {
    try {
      console.log('🔍 Checking profile completion for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('profile_completed')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error checking profile completion:', error);
        // If it's a "not found" error, profile doesn't exist yet (new user)
        if (error.code === 'PGRST116') {
          console.log('📋 Profile not found - this is a new user');
          return { isCompleted: false, hasError: false };
        }
        // For other errors, we can't determine status reliably
        console.warn('⚠️ Cannot determine profile status due to error - being conservative');
        return { isCompleted: false, hasError: true };
      }

      const isCompleted = profile?.profile_completed === true;
      console.log('📊 Profile completion status:', {
        userId,
        profile_completed: isCompleted,
        raw_value: profile?.profile_completed
      });

      return { isCompleted, hasError: false };
    } catch (error) {
      console.error('❌ Error in checkProfileCompletion:', error);
      return { isCompleted: false, hasError: true };
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
              const { isCompleted, hasError } = await checkProfileCompletion(session.user.id);
              
              // CRITICAL: Only set isNewUser if we're CERTAIN about the profile status
              if (hasError) {
                console.log('⚠️ Could not determine profile status - keeping current isNewUser state');
                // Don't change isNewUser if we can't determine the status
              } else if (isCompleted) {
                console.log('✅ Profile is completed - clearing new user flag from auth context');
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
              // Don't automatically set isNewUser = true on error - be conservative
              console.log('⚠️ Error occurred - not changing isNewUser flag');
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
            const { isCompleted, hasError } = await checkProfileCompletion(session.user.id);
            
            // Same defensive logic for initial session
            if (hasError) {
              console.log('⚠️ Initial profile check had error - keeping current isNewUser state');
            } else {
              setIsNewUser(!isCompleted);
              console.log('📊 Initial profile check - isNewUser:', !isCompleted);
            }
          } catch (error) {
            console.error('❌ Error in initial profile check:', error);
            console.log('⚠️ Error in initial check - not setting isNewUser flag');
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
    console.log('🔄 Manually clearing new user flag (was:', isNewUser, ')');
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
