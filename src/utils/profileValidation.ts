
import { ProfileFormData } from '@/types/ProfileTypes';

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  errors: Record<string, string>;
}

export const validateBasicInfoStep = (data: ProfileFormData): ValidationResult => {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!data.full_name?.trim()) {
    missingFields.push('Full Name');
    errors.full_name = 'Full name is required';
  }

  if (!data.username?.trim()) {
    missingFields.push('Username');
    errors.username = 'Username is required';
  }

  if (!data.date_of_birth) {
    missingFields.push('Date of Birth');
    errors.date_of_birth = 'Date of birth is required';
  }

  if (!data.photo_urls || data.photo_urls.length === 0) {
    missingFields.push('Profile Photo');
    errors.photo_urls = 'At least one profile photo is required';
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    errors
  };
};

export const validateAboutYouStep = (data: ProfileFormData): ValidationResult => {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!data.bio?.trim() || data.bio.trim().length < 50) {
    missingFields.push('Bio');
    errors.bio = 'Bio is required and must be at least 50 characters';
  }

  if (!data.looking_for?.trim()) {
    missingFields.push('What You\'re Looking For');
    errors.looking_for = 'Please select what you\'re looking for';
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    errors
  };
};

export const validateDatingPreferencesStep = (data: ProfileFormData): ValidationResult => {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  if (!data.gender_identity?.trim()) {
    missingFields.push('Gender Identity');
    errors.gender_identity = 'Gender identity is required';
  }

  if (!data.sexual_orientation?.trim()) {
    missingFields.push('Sexual Orientation');
    errors.sexual_orientation = 'Sexual orientation is required';
  }

  if (!data.looking_for_gender || data.looking_for_gender.length === 0) {
    missingFields.push('Looking For Gender');
    errors.looking_for_gender = 'Please select at least one gender you\'re interested in';
  }

  if (!data.relationship_type?.trim()) {
    missingFields.push('Relationship Type');
    errors.relationship_type = 'Relationship type is required';
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    errors
  };
};

export const validateCryptoProfileStep = (data: ProfileFormData): ValidationResult => {
  const missingFields: string[] = [];
  const errors: Record<string, string> = {};

  // At least one crypto field should be filled
  const hasFavoriteCrypto = data.favorite_crypto?.trim();
  const hasCryptoExperience = data.crypto_experience?.trim();

  if (!hasFavoriteCrypto && !hasCryptoExperience) {
    missingFields.push('Crypto Information');
    errors.crypto_info = 'Please fill in at least your favorite crypto or crypto experience';
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    errors
  };
};

export const validateStepByNumber = (stepNumber: number, data: ProfileFormData): ValidationResult => {
  switch (stepNumber) {
    case 1:
      return validateBasicInfoStep(data);
    case 2:
      return validateAboutYouStep(data);
    case 3:
      return validateDatingPreferencesStep(data);
    case 4:
      return validateCryptoProfileStep(data);
    default:
      return { isValid: true, missingFields: [], errors: {} };
  }
};
