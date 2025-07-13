/**
 * Security utilities for edge functions
 * These are designed to be used in Supabase edge functions for server-side security
 */

export interface SecurityConfig {
  enableRateLimit: boolean;
  enableCSRFProtection: boolean;
  enableInputValidation: boolean;
  maxRequestSize: number;
  allowedOrigins: string[];
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableRateLimit: true,
  enableCSRFProtection: true,
  enableInputValidation: true,
  maxRequestSize: 1024 * 1024, // 1MB
  allowedOrigins: ['https://yourdomain.com', 'http://localhost:3000']
};

/**
 * Sanitize error messages for edge functions
 */
export const sanitizeErrorForClient = (error: any): { message: string; code?: string } => {
  // Never expose internal details or stack traces
  if (typeof error === 'string') {
    return { message: 'An error occurred. Please try again.' };
  }

  // For known error types, provide safe messages
  const safeMessages: Record<string, string> = {
    'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait before trying again.',
    'INVALID_INPUT': 'Invalid input provided.',
    'UNAUTHORIZED': 'Authentication required.',
    'FORBIDDEN': 'Access denied.',
    'NOT_FOUND': 'Resource not found.',
    'VALIDATION_ERROR': 'Validation failed.',
    'FILE_TOO_LARGE': 'File size exceeds limit.',
    'INVALID_FILE_TYPE': 'Invalid file type.',
    'CSRF_TOKEN_INVALID': 'Invalid request token.',
    'SESSION_EXPIRED': 'Session has expired.'
  };

  const errorCode = error?.code || error?.name || 'UNKNOWN_ERROR';
  const safeMessage = safeMessages[errorCode] || 'An unexpected error occurred.';

  return {
    message: safeMessage,
    code: errorCode
  };
};

/**
 * Validate request origin for CORS
 */
export const validateOrigin = (request: Request, allowedOrigins: string[]): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  
  return allowedOrigins.some(allowed => 
    origin === allowed || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') ||
    origin.includes('.vercel.app') ||
    origin.includes('.netlify.app')
  );
};

/**
 * Enhanced CORS headers with security
 */
export const getSecurityHeaders = (allowedOrigin?: string) => ({
  'Access-Control-Allow-Origin': allowedOrigin || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
});

/**
 * Validate request size
 */
export const validateRequestSize = (request: Request, maxSize: number): boolean => {
  const contentLength = request.headers.get('content-length');
  if (!contentLength) return true; // Let it proceed, will be caught later if too large
  
  return parseInt(contentLength, 10) <= maxSize;
};

/**
 * Extract and validate CSRF token
 */
export const validateCSRFToken = (request: Request): boolean => {
  const csrfToken = request.headers.get('x-csrf-token');
  const cookieHeader = request.headers.get('cookie');
  
  if (!csrfToken || !cookieHeader) return false;
  
  // Extract CSRF token from cookies (if stored there)
  const cookieCSRF = cookieHeader
    .split(';')
    .find(c => c.trim().startsWith('csrf_token='))
    ?.split('=')[1];
    
  return csrfToken === cookieCSRF;
};

/**
 * Rate limiting for edge functions
 */
export class EdgeRateLimit {
  private static instance: EdgeRateLimit;
  private requests: Map<string, number[]> = new Map();

  static getInstance(): EdgeRateLimit {
    if (!EdgeRateLimit.instance) {
      EdgeRateLimit.instance = new EdgeRateLimit();
    }
    return EdgeRateLimit.instance;
  }

  check(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Comprehensive request validation wrapper for edge functions
 */
export const createSecureHandler = (
  handler: (request: Request) => Promise<Response>,
  config: Partial<SecurityConfig> = {}
) => {
  const securityConfig = { ...DEFAULT_SECURITY_CONFIG, ...config };
  
  return async (request: Request): Promise<Response> => {
    try {
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { 
          headers: getSecurityHeaders() 
        });
      }

      // Validate origin
      if (securityConfig.allowedOrigins.length > 0) {
        if (!validateOrigin(request, securityConfig.allowedOrigins)) {
          return new Response(
            JSON.stringify({ error: 'Origin not allowed' }), 
            { 
              status: 403,
              headers: getSecurityHeaders()
            }
          );
        }
      }

      // Validate request size
      if (!validateRequestSize(request, securityConfig.maxRequestSize)) {
        return new Response(
          JSON.stringify({ error: 'Request too large' }), 
          { 
            status: 413,
            headers: getSecurityHeaders()
          }
        );
      }

      // Rate limiting
      if (securityConfig.enableRateLimit) {
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimit = EdgeRateLimit.getInstance();
        
        if (!rateLimit.check(clientIP)) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded' }), 
            { 
              status: 429,
              headers: getSecurityHeaders()
            }
          );
        }
      }

      // CSRF validation for non-GET requests
      if (securityConfig.enableCSRFProtection && request.method !== 'GET') {
        if (!validateCSRFToken(request)) {
          return new Response(
            JSON.stringify({ error: 'Invalid CSRF token' }), 
            { 
              status: 403,
              headers: getSecurityHeaders()
            }
          );
        }
      }

      // Call the actual handler
      const response = await handler(request);
      
      // Add security headers to response
      const secureHeaders = getSecurityHeaders();
      Object.entries(secureHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;

    } catch (error) {
      console.error('Security handler error:', error);
      
      const sanitizedError = sanitizeErrorForClient(error);
      
      return new Response(
        JSON.stringify({ error: sanitizedError.message }), 
        { 
          status: 500,
          headers: getSecurityHeaders()
        }
      );
    }
  };
};