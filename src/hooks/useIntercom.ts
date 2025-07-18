
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

interface IntercomUserData {
  user_id?: string;
  name?: string;
  email?: string;
  created_at?: number;
}

export const useIntercom = (appId: string, userData?: IntercomUserData) => {
  const scriptLoaded = useRef(false);
  const initAttempted = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttempted.current) {
      console.log('Intercom initialization already attempted');
      return;
    }
    initAttempted.current = true;

    console.log('🚀 Starting Intercom initialization with App ID:', appId);
    
    // Validate App ID
    if (!appId || typeof appId !== 'string') {
      console.error('❌ Invalid Intercom App ID provided:', appId);
      return;
    }

    // Set up Intercom settings with user data
    const baseSettings = {
      app_id: appId,
      hide_default_launcher: false,
      alignment: 'right',
      horizontal_padding: 20,
      vertical_padding: 20,
    };

    // Merge with user data if provided
    window.intercomSettings = userData ? { ...baseSettings, ...userData } : baseSettings;
    console.log('📋 Intercom settings configured:', window.intercomSettings);

    // Check if Intercom already exists
    if (window.Intercom) {
      console.log('✅ Intercom already exists, updating settings...');
      try {
        window.Intercom('update', window.intercomSettings);
        window.Intercom('show');
        console.log('✅ Intercom updated and shown');
      } catch (error) {
        console.error('❌ Error updating existing Intercom:', error);
      }
      return;
    }

    // Create Intercom stub function using official method
    const intercomStub = function() {
      intercomStub.c(arguments);
    };
    intercomStub.q = [];
    intercomStub.c = function(args: any) {
      intercomStub.q.push(args);
    };
    window.Intercom = intercomStub;
    console.log('🔧 Intercom stub function created');

    // Create and load script using official snippet method
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://widget.intercom.io/widget/${appId}`;
    script.id = 'intercom-script';
    
    // Enhanced error handling
    script.onload = () => {
      console.log('✅ Intercom script loaded successfully');
      scriptLoaded.current = true;
      
      // Boot Intercom
      try {
        console.log('🚀 Booting Intercom...');
        window.Intercom('boot', window.intercomSettings);
        
        // Additional verification
        setTimeout(() => {
          const launcher = document.querySelector('.intercom-launcher');
          const frame = document.querySelector('#intercom-frame');
          
          if (launcher || frame) {
            console.log('✅ Intercom widget elements found in DOM');
          } else {
            console.warn('⚠️ Intercom widget elements not found in DOM after boot');
            // Try alternative boot method
            window.Intercom('show');
          }
        }, 2000);
        
      } catch (error) {
        console.error('❌ Error booting Intercom:', error);
      }
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Intercom script:', error);
      console.error('❌ Script URL was:', script.src);
      console.error('❌ This could be due to:');
      console.error('  - Network connectivity issues');
      console.error('  - Incorrect App ID');
      console.error('  - Ad blockers blocking the script');
      console.error('  - CORS policy restrictions');
    };

    // Append script to head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
      console.log('📜 Intercom script added to DOM');
    } else {
      document.head.appendChild(script);
      console.log('📜 Intercom script added to head');
    }

    // Set up a timeout to check if Intercom loaded
    const loadTimeout = setTimeout(() => {
      if (!scriptLoaded.current) {
        console.error('❌ Intercom script failed to load within 10 seconds');
        console.error('❌ Possible issues:');
        console.error('  - Check your internet connection');
        console.error('  - Verify the App ID is correct');
        console.error('  - Check if an ad blocker is interfering');
        console.error('  - Verify domain is whitelisted in Intercom settings');
      }
    }, 10000);

    // Cleanup function
    return () => {
      clearTimeout(loadTimeout);
      const existingScript = document.getElementById('intercom-script');
      if (existingScript) {
        existingScript.remove();
      }
      if (window.Intercom) {
        try {
          window.Intercom('shutdown');
          console.log('🔄 Intercom shutdown completed');
        } catch (error) {
          console.error('❌ Error during Intercom shutdown:', error);
        }
      }
    };
  }, [appId, userData?.user_id, userData?.name, userData?.email, userData?.created_at]);

  // Update Intercom when user data changes
  useEffect(() => {
    if (window.Intercom && userData) {
      console.log('🔄 Updating Intercom with new user data:', userData);
      try {
        window.Intercom('update', userData);
      } catch (error) {
        console.error('❌ Error updating Intercom user data:', error);
      }
    }
  }, [userData?.user_id, userData?.name, userData?.email, userData?.created_at]);

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
