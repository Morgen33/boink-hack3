/**
 * Age verification utilities for the platform
 * Ensures consistent age calculation and verification across the app
 */

export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  // Invalid date check
  if (isNaN(birth.getTime())) return 0;
  
  // Future date check - absolutely no future dates allowed
  if (birth > today) return 0;
  
  // Calculate age with precise date arithmetic
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // If birth month hasn't occurred this year, or same month but day hasn't passed
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  // Extra safety: ensure age is never negative
  return Math.max(0, age);
};

export const isUserAdult = (birthDate: string | Date): boolean => {
  const age = calculateAge(birthDate);
  // STRICT: Must be exactly 18 or older, no exceptions
  return age >= MINIMUM_AGE && age > 0;
};

export const MINIMUM_AGE = 18;

export const getAgeVerificationError = (): string => {
  return `You must be at least ${MINIMUM_AGE} years old to use this platform. This platform is restricted to adults only.`;
};

export const validateAge = (birthDate: string | Date): { isValid: boolean; error?: string } => {
  if (!birthDate) {
    return { isValid: false, error: 'Date of birth is required' };
  }
  
  const age = calculateAge(birthDate);
  
  // Multiple strict checks
  if (age <= 0) {
    return { isValid: false, error: 'Please provide a valid date of birth' };
  }
  
  if (age < MINIMUM_AGE) {
    return { isValid: false, error: getAgeVerificationError() };
  }
  
  // Extra check: ensure the birth date would make someone at least 18 today
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - MINIMUM_AGE, today.getMonth(), today.getDate());
  const birth = new Date(birthDate);
  
  if (birth > eighteenYearsAgo) {
    return { isValid: false, error: getAgeVerificationError() };
  }
  
  return { isValid: true };
};