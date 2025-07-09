/**
 * Security utilities for input validation and sanitization
 */

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  name: /^[a-zA-Z\s\-']{1,50}$/,
  location: /^[a-zA-Z0-9\s,.\-']{1,100}$/,
  url: /^https?:\/\/.+/,
  walletAddress: /^[a-zA-Z0-9]{25,}$/
};

// File upload validation
export const FILE_VALIDATION = {
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 6
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.email.test(email);
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  if (!FILE_VALIDATION.allowedImageTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' };
  }
  
  if (file.size > FILE_VALIDATION.maxFileSize) {
    return { valid: false, error: 'File size too large. Maximum size is 5MB.' };
  }
  
  return { valid: true };
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
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://*.supabase.co'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"]
};