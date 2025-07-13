import React, { createContext, useContext, useEffect } from 'react';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { SECURITY_HEADERS, CSP_CONFIG } from '@/utils/securityUtils';

interface SecurityContextType {
  validateInput: (input: string, fieldName: string) => any;
  checkRateLimit: (action: string, maxAttempts?: number) => boolean;
  validateFormCSRF: (token: string) => boolean;
  secureFormSubmit: (
    formData: Record<string, any>,
    submitFn: (data: Record<string, any>) => Promise<any>,
    options?: any
  ) => Promise<any>;
  checkContentSecurity: (content: string) => boolean;
  trackActivity: () => void;
  csrfToken: string | null;
  securityState: any;
  suspiciousActivity: boolean;
  clearSecurityAlerts: () => void;
  refreshCSRFToken: () => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const securityHook = useEnhancedSecurity();

  // Apply security headers via meta tags (best effort for client-side)
  useEffect(() => {
    // Set CSP via meta tag
    const cspString = Object.entries(CSP_CONFIG)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
    
    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      document.head.appendChild(cspMeta);
    }
    cspMeta.setAttribute('content', cspString);

    // Add other security meta tags
    const securityMetas = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
      { httpEquiv: 'X-Frame-Options', content: 'DENY' },
      { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' }
    ];

    securityMetas.forEach(({ name, httpEquiv, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[http-equiv="${httpEquiv}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.setAttribute('name', name);
        if (httpEquiv) meta.setAttribute('http-equiv', httpEquiv);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  }, []);

  // Track user activity on various events
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      securityHook.trackActivity();
    };

    // Throttle activity tracking to avoid excessive calls
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledHandler = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        activityHandler();
        throttleTimer = null;
      }, 30000); // Track activity every 30 seconds at most
    };

    events.forEach(event => {
      document.addEventListener(event, throttledHandler, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandler);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [securityHook]);

  return (
    <SecurityContext.Provider value={securityHook}>
      {children}
    </SecurityContext.Provider>
  );
};