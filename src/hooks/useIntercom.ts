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

    // Set up Intercom settings
    window.intercomSettings = {
      app_id: appId,
      hide_default_launcher: false,
    };

    // Check if Intercom is already loaded
    if (window.Intercom) {
      console.log('Intercom already loaded, booting...');
      window.Intercom('reattach_activator');
      window.Intercom('update', window.intercomSettings);
      return;
    }

    // Create Intercom function stub
    window.Intercom = function(...args: any[]) {
      window.Intercom.q.push(args);
    };
    window.Intercom.q = [];

    // Load Intercom script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;
    
    script.onload = () => {
      console.log('Intercom script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('Failed to load Intercom script');
    };

    // Add script to document head
    document.head.appendChild(script);

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