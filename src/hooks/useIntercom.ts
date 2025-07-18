import { useEffect } from 'react';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export const useIntercom = (appId: string) => {
  useEffect(() => {
    // Set up Intercom settings
    window.intercomSettings = {
      app_id: appId,
      hide_default_launcher: false,
    };

    // Load Intercom script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://widget.intercom.io/widget/' + appId;

    // Add script to head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Initialize Intercom when script loads
    script.onload = () => {
      if (window.Intercom) {
        window.Intercom('boot', window.intercomSettings);
      }
    };

    // Fallback initialization
    const initializeIntercom = () => {
      if (window.Intercom) {
        window.Intercom('boot', window.intercomSettings);
      } else {
        setTimeout(initializeIntercom, 100);
      }
    };

    setTimeout(initializeIntercom, 1000);

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