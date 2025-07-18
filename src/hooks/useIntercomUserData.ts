import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export const useIntercomUserData = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (window.Intercom && user) {
      // Update Intercom with user data
      window.Intercom('update', {
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        created_at: Math.floor(new Date(user.created_at).getTime() / 1000) // Unix timestamp in seconds
      });
    }
  }, [user]);
};