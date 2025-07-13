import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityMonitoring } from './useSecurityMonitoring';
import { 
  generateCSRFToken, 
  storeCSRFToken, 
  getCSRFToken,
  validateCSRFToken,
  updateLastActivity,
  getLastActivity,
  isSessionExpired,
  clientRateLimit,
  validateAndSanitizeInput,
  detectXSS,
  detectSQLInjection
} from '@/utils/securityUtils';
import { useToast } from '@/hooks/use-toast';

interface SecurityState {
  csrfToken: string | null;
  sessionValid: boolean;
  lastActivity: number;
  securityAlerts: string[];
  isSecureContext: boolean;
}

export const useEnhancedSecurity = () => {
  const { user } = useAuth();
  const { logSecurityEvent, suspiciousActivity } = useSecurityMonitoring();
  const { toast } = useToast();

  const [securityState, setSecurityState] = useState<SecurityState>({
    csrfToken: null,
    sessionValid: true,
    lastActivity: Date.now(),
    securityAlerts: [],
    isSecureContext: window.isSecureContext
  });

  // Initialize CSRF token on mount
  useEffect(() => {
    const initializeCSRF = () => {
      let token = getCSRFToken();
      if (!token) {
        token = generateCSRFToken();
        storeCSRFToken(token);
      }
      setSecurityState(prev => ({ ...prev, csrfToken: token }));
    };

    initializeCSRF();
  }, []);

  // Monitor session activity
  useEffect(() => {
    const checkSession = () => {
      const lastActivity = getLastActivity();
      const expired = isSessionExpired(lastActivity);
      
      if (expired && user) {
        setSecurityState(prev => ({ 
          ...prev, 
          sessionValid: false,
          securityAlerts: [...prev.securityAlerts, 'Session expired due to inactivity']
        }));
        
        toast({
          title: "Session Expired",
          description: "Please log in again for security reasons.",
          variant: "destructive"
        });

        logSecurityEvent('session_expired');
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, logSecurityEvent, toast]);

  // Track user activity
  const trackActivity = useCallback(() => {
    updateLastActivity();
    setSecurityState(prev => ({ 
      ...prev, 
      lastActivity: Date.now(),
      sessionValid: true 
    }));
  }, []);

  // Validate input with security checks
  const validateInput = useCallback((input: string, fieldName: string) => {
    const validation = validateAndSanitizeInput(input, fieldName);
    
    if (!validation.valid) {
      setSecurityState(prev => ({
        ...prev,
        securityAlerts: [...prev.securityAlerts, ...validation.errors]
      }));
      
      // Log security event for suspicious input
      logSecurityEvent(`suspicious_input_${fieldName}`);
      
      toast({
        title: "Security Alert",
        description: "Potentially malicious input detected and blocked.",
        variant: "destructive"
      });
    }
    
    return validation;
  }, [logSecurityEvent, toast]);

  // Rate limit actions
  const checkRateLimit = useCallback((action: string, maxAttempts = 5) => {
    const allowed = clientRateLimit.check(`${user?.id || 'anonymous'}_${action}`, maxAttempts);
    
    if (!allowed) {
      logSecurityEvent(`rate_limit_exceeded_${action}`);
      
      toast({
        title: "Rate Limit Exceeded",
        description: "Too many attempts. Please wait before trying again.",
        variant: "destructive"
      });
    }
    
    return allowed;
  }, [user?.id, logSecurityEvent, toast]);

  // Validate CSRF token for forms
  const validateFormCSRF = useCallback((token: string) => {
    const isValid = validateCSRFToken(token);
    
    if (!isValid) {
      logSecurityEvent('csrf_validation_failed');
      
      toast({
        title: "Security Error",
        description: "Invalid request token. Please refresh and try again.",
        variant: "destructive"
      });
    }
    
    return isValid;
  }, [logSecurityEvent, toast]);

  // Secure form submission wrapper
  const secureFormSubmit = useCallback(async (
    formData: Record<string, any>,
    submitFn: (data: Record<string, any>) => Promise<any>,
    options: {
      requireCSRF?: boolean;
      rateLimit?: { action: string; maxAttempts?: number };
      validateFields?: string[];
    } = {}
  ) => {
    try {
      // Track activity
      trackActivity();

      // Check rate limiting
      if (options.rateLimit) {
        const { action, maxAttempts = 5 } = options.rateLimit;
        if (!checkRateLimit(action, maxAttempts)) {
          throw new Error('Rate limit exceeded');
        }
      }

      // Validate CSRF token if required
      if (options.requireCSRF) {
        const token = formData.csrf_token || securityState.csrfToken;
        if (!validateFormCSRF(token)) {
          throw new Error('CSRF validation failed');
        }
      }

      // Validate and sanitize specified fields
      const sanitizedData = { ...formData };
      if (options.validateFields) {
        for (const field of options.validateFields) {
          if (sanitizedData[field]) {
            const validation = validateInput(sanitizedData[field], field);
            if (!validation.valid) {
              throw new Error(`Invalid input in field: ${field}`);
            }
            sanitizedData[field] = validation.sanitized;
          }
        }
      }

      // Submit the form
      return await submitFn(sanitizedData);

    } catch (error: any) {
      // Log security events for failed submissions
      logSecurityEvent('form_submission_failed');
      throw error;
    }
  }, [
    trackActivity, 
    checkRateLimit, 
    securityState.csrfToken, 
    validateFormCSRF, 
    validateInput, 
    logSecurityEvent
  ]);

  // Check for security threats in content
  const checkContentSecurity = useCallback((content: string) => {
    const threats = [];
    
    if (detectXSS(content)) {
      threats.push('XSS attempt detected');
    }
    
    if (detectSQLInjection(content)) {
      threats.push('SQL injection attempt detected');
    }
    
    if (threats.length > 0) {
      logSecurityEvent('content_security_violation');
      setSecurityState(prev => ({
        ...prev,
        securityAlerts: [...prev.securityAlerts, ...threats]
      }));
    }
    
    return threats.length === 0;
  }, [logSecurityEvent]);

  // Clear security alerts
  const clearSecurityAlerts = useCallback(() => {
    setSecurityState(prev => ({ ...prev, securityAlerts: [] }));
  }, []);

  // Get new CSRF token
  const refreshCSRFToken = useCallback(() => {
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
    setSecurityState(prev => ({ ...prev, csrfToken: newToken }));
    return newToken;
  }, []);

  return {
    // Security state
    securityState,
    suspiciousActivity,
    
    // Security functions
    validateInput,
    checkRateLimit,
    validateFormCSRF,
    secureFormSubmit,
    checkContentSecurity,
    trackActivity,
    clearSecurityAlerts,
    refreshCSRFToken,
    
    // CSRF token for forms
    csrfToken: securityState.csrfToken
  };
};