import { useEffect } from 'react';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export const useIntercom = (appId: string) => {
  useEffect(() => {
    console.log('Initializing Intercom with App ID:', appId);

    // Check if already loaded
    if (window.Intercom) {
      console.log('Intercom already exists, updating...');
      window.Intercom('update', { app_id: appId });
      return;
    }

    // Set up global settings
    window.intercomSettings = {
      app_id: appId,
    };

    // Initialize Intercom function
    const intercomFunction = function(...args: any[]) {
      if (intercomFunction.c) {
        intercomFunction.c(args);
      } else {
        intercomFunction.q.push(args);
      }
    };
    intercomFunction.q = [];
    intercomFunction.c = null;
    window.Intercom = intercomFunction;

    // Load the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;
    
    script.onload = () => {
      console.log('Intercom script loaded successfully');
      window.Intercom('boot', window.intercomSettings);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Intercom script:', error);
    };

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);

    // Cleanup function
    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [appId]);

  const showIntercom = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
  };

  const hideIntercom = () => {
    if (window.Intercom) {
      window.Intercom('hide');
    }
  };

  return { showIntercom, hideIntercom };
};