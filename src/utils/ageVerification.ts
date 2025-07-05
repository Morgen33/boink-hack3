/**
 * Age verification utilities for the platform
 * Ensures consistent age calculation and verification across the app
 */

export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const isUserAdult = (birthDate: string | Date): boolean => {
  return calculateAge(birthDate) >= 18;
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
  if (age < MINIMUM_AGE) {
    return { isValid: false, error: getAgeVerificationError() };
  }
  
  return { isValid: true };
};