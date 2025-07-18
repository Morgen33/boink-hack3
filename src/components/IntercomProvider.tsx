
import { useEffect } from 'react';
import { useProfileData } from '@/hooks/useProfileData';

declare global {
  interface Window {
    Intercom: any;
  }
}

export const IntercomProvider = () => {
  const { user, profile, loading } = useProfileData();

  useEffect(() => {
    // Only initialize Intercom if user is authenticated
    if (!user || loading) return;

    // Load Intercom script if not already loaded
    if (!window.Intercom) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://widget.intercom.io/widget/ob1wk7lg';
      
      script.onload = () => {
        initializeIntercom();
      };
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else {
      // If Intercom is already loaded, just update with new user data
      updateIntercom();
    }

    return () => {
      // Cleanup when component unmounts or user changes
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [user, profile, loading]);

  const initializeIntercom = () => {
    if (!user) return;

    const userData = {
      app_id: 'ob1wk7lg',
      user_id: user.id,
      name: profile?.full_name || '',
      email: user.email || '',
      created_at: user.created_at ? Math.floor(new Date(user.created_at).getTime() / 1000) : undefined,
    };

    window.Intercom('boot', userData);
  };

  const updateIntercom = () => {
    if (!user || !window.Intercom) return;

    const userData = {
      user_id: user.id,
      name: profile?.full_name || '',
      email: user.email || '',
      created_at: user.created_at ? Math.floor(new Date(user.created_at).getTime() / 1000) : undefined,
    };

    window.Intercom('update', userData);
  };

  // This component doesn't render anything visible
  return null;
};
