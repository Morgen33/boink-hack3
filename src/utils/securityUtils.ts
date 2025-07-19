/**
 * Enhanced Security utilities for input validation, sanitization, and protection
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  name: /^[a-zA-Z\s\-']{1,50}$/,
  location: /^[a-zA-Z0-9\s,.\-']{1,100}$/,
  url: /^https?:\/\/.+/,
  walletAddress: /^[a-zA-Z0-9]{25,}$/,
  // Enhanced patterns for stricter validation
  sqlInjection: /(\b(union|select|insert|update|delete|drop|create|alter|exec|script)\b)|(\-\-)|(\|\|)|(\/\*)|(\*\/)|(<script>)|(<\/script>)/i,
  xssPatterns: /<script[^>]*>.*?<\/script>|javascript:|on\w+\s*=|<iframe|<object|<embed/i,
  htmlTags: /<[^>]*>/g,
  pathTraversal: /\.\.\//g,
  fileName: /^[a-zA-Z0-9._\s-]+$/
};

// Enhanced file upload validation
export const FILE_VALIDATION = {
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 6,
  // File content validation
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  forbiddenExtensions: ['.exe', '.bat', '.cmd', '.scr', '.pif', '.js', '.vbs', '.jar', '.php', '.asp'],
  maxFileName: 255
};

/**
 * Enhanced XSS protection and input sanitization
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;')
    .replace(/`/g, '&#96;')
    .trim();
};

/**
 * Detect and prevent XSS attempts
 */
export const detectXSS = (input: string): boolean => {
  if (!input) return false;
  return VALIDATION_PATTERNS.xssPatterns.test(input);
};

/**
 * Detect SQL injection attempts
 */
export const detectSQLInjection = (input: string): boolean => {
  if (!input) return false;
  return VALIDATION_PATTERNS.sqlInjection.test(input);
};

/**
 * Comprehensive input validation with security checks
 */
export const validateAndSanitizeInput = (input: string, field: string): { 
  valid: boolean; 
  sanitized: string; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (!input) {
    return { valid: true, sanitized: '', errors };
  }

  // Check for XSS attempts
  if (detectXSS(input)) {
    errors.push(`Potential XSS detected in ${field}`);
  }

  // Check for SQL injection attempts
  if (detectSQLInjection(input)) {
    errors.push(`Potential SQL injection detected in ${field}`);
  }

  // Check for path traversal attempts
  if (VALIDATION_PATTERNS.pathTraversal.test(input)) {
    errors.push(`Path traversal attempt detected in ${field}`);
  }

  const sanitized = sanitizeInput(input);
  
  return {
    valid: errors.length === 0,
    sanitized,
    errors
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.email.test(email);
};

/**
 * Enhanced file upload validation with security checks
 */
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file type against allowed types
  if (!FILE_VALIDATION.allowedImageTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' };
  }

  // Check file size
  if (file.size > FILE_VALIDATION.maxFileSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
  }

  // Check for empty files
  if (file.size === 0) {
    return { valid: false, error: 'File is empty or corrupted.' };
  }

  // Validate file name
  if (file.name.length > FILE_VALIDATION.maxFileName) {
    return { valid: false, error: 'Filename too long. Maximum 255 characters allowed.' };
  }

  // Check for forbidden extensions
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (FILE_VALIDATION.forbiddenExtensions.includes(fileExtension)) {
    return { valid: false, error: 'File type not allowed for security reasons.' };
  }

  // We'll sanitize the filename instead of rejecting it
  // This makes the upload process more user-friendly

  // Check for double extensions (e.g., image.jpg.exe)
  const nameParts = file.name.split('.');
  if (nameParts.length > 3) {
    return { valid: false, error: 'Multiple file extensions not allowed for security reasons.' };
  }

  return { valid: true };
};

/**
 * Validate file content by reading magic numbers
 */
export const validateFileContent = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve({ valid: false, error: 'Could not read file content.' });
        return;
      }

      const uint8Array = new Uint8Array(buffer.slice(0, 4));
      const hex = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('');

      // Check magic numbers for common image formats
      const imageSignatures = {
        'ffd8ff': 'jpeg',
        '89504e47': 'png',
        '52494646': 'webp' // RIFF header (WebP starts with RIFF)
      };

      const isValidImage = Object.keys(imageSignatures).some(signature => 
        hex.startsWith(signature)
      );

      if (!isValidImage) {
        resolve({ valid: false, error: 'File content does not match expected image format.' });
        return;
      }

      resolve({ valid: true });
    };

    reader.onerror = () => {
      resolve({ valid: false, error: 'Error reading file content.' });
    };

    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return VALIDATION_PATTERNS.url.test(url);
  } catch {
    return false;
  }
};

/**
 * Rate limiting for client-side actions
 */
class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();
  
  check(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const clientRateLimit = new ClientRateLimit();

/**
 * Validate profile data
 */
export const validateProfileData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.full_name && !VALIDATION_PATTERNS.name.test(data.full_name)) {
    errors.push('Invalid name format');
  }
  
  if (data.location && !VALIDATION_PATTERNS.location.test(data.location)) {
    errors.push('Invalid location format');
  }
  
  if (data.age && (data.age < 18 || data.age > 100)) {
    errors.push('Age must be between 18 and 100');
  }
  
  if (data.bio && data.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }
  
  if (data.linkedin_url && data.linkedin_url && !isValidUrl(data.linkedin_url)) {
    errors.push('Invalid LinkedIn URL');
  }
  
  if (data.website_url && data.website_url && !isValidUrl(data.website_url)) {
    errors.push('Invalid website URL');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * CSRF Token Generation and Validation
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const storeCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

export const validateCSRFToken = (providedToken: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === providedToken;
};

/**
 * Session Security Management
 */
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  idleTimeout: 30 * 60 * 1000, // 30 minutes
  maxConcurrentSessions: 3
};

export const isSessionExpired = (lastActivity: number): boolean => {
  return Date.now() - lastActivity > SESSION_CONFIG.idleTimeout;
};

export const updateLastActivity = (): void => {
  localStorage.setItem('lastActivity', Date.now().toString());
};

export const getLastActivity = (): number => {
  const stored = localStorage.getItem('lastActivity');
  return stored ? parseInt(stored, 10) : Date.now();
};

/**
 * Enhanced security headers and CSP configuration
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://*.supabase.co', 'https://api.ipify.org'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

/**
 * Error sanitization for edge functions
 */
export const sanitizeError = (error: any): { message: string; code?: string } => {
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
    'INVALID_FILE_TYPE': 'Invalid file type.'
  };

  const errorCode = error?.code || error?.name || 'UNKNOWN_ERROR';
  const safeMessage = safeMessages[errorCode] || 'An unexpected error occurred.';

  return {
    message: safeMessage,
    code: errorCode
  };
};

/**
 * Sanitize filename for upload
 */
export const sanitizeFileName = (fileName: string): string => {
  // Get file extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  
  // Sanitize the name part - keep only safe characters
  const sanitizedName = name
    .replace(/[^a-zA-Z0-9._\s-]/g, '') // Remove unsafe characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[._-]+/g, '_') // Replace multiple consecutive separators with single underscore
    .replace(/^[._-]+|[._-]+$/g, '') // Remove leading/trailing separators
    .substring(0, 100); // Limit length
  
  // Ensure we have a valid name
  const finalName = sanitizedName || 'upload';
  
  return finalName + extension;
};

/**
 * IP and request validation
 */
export const validateOrigin = (origin: string, allowedOrigins: string[]): boolean => {
  return allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1');
};

export const isValidIPAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

/**
 * Content validation for text fields
 */
export const validateTextContent = (content: string, maxLength: number = 1000): { 
  valid: boolean; 
  sanitized: string; 
  errors: string[] 
} => {
  const validation = validateAndSanitizeInput(content, 'content');
  
  if (validation.sanitized.length > maxLength) {
    validation.errors.push(`Content exceeds maximum length of ${maxLength} characters`);
    validation.valid = false;
  }
  
  return validation;
};