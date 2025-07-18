import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';

interface IntercomUser {
  user_id?: string;
  name?: string;
  email?: string;
  created_at?: number;
}

export const useIntercom = (appId: string, user?: IntercomUser) => {
  useEffect(() => {
    try {
      console.log('Initializing Intercom with app ID:', appId);
      
      const intercomConfig: any = {
        app_id: appId,
      };

      // Add user data if available
      if (user) {
        if (user.user_id) intercomConfig.user_id = user.user_id;
        if (user.name) intercomConfig.name = user.name;
        if (user.email) intercomConfig.email = user.email;
        if (user.created_at) intercomConfig.created_at = user.created_at;
      }

      console.log('Intercom config:', intercomConfig);
      Intercom(intercomConfig);
      console.log('Intercom initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Intercom:', error);
    }
  }, [appId, user]);

  const showIntercom = () => {
    console.log('showIntercom called');
    try {
      Intercom({ app_id: appId });
      console.log('Intercom show called');
    } catch (error) {
      console.error('Failed to show Intercom:', error);
    }
  };

  const hideIntercom = () => {
    try {
      // Hide is handled by the widget itself
      console.log('Hide Intercom called');
    } catch (error) {
      console.error('Failed to hide Intercom:', error);
    }
  };

  return { showIntercom, hideIntercom };
};