
export interface ProfileQualityScore {
  score: number;
  percentage: number;
  level: 'none' | 'minimal' | 'good' | 'excellent';
  missingCritical: string[];
  missingOptional: string[];
  visibilityStatus: 'invisible' | 'limited' | 'good' | 'excellent';
}

export const assessProfileQuality = (profile: any): ProfileQualityScore => {
  let score = 0;
  const missingCritical: string[] = [];
  const missingOptional: string[] = [];

  // Critical fields for basic visibility (60 points total)
  const criticalChecks = [
    { field: 'full_name', points: 10, label: 'Full Name' },
    { field: 'username', points: 10, label: 'Username' },
    { field: 'age', points: 10, label: 'Age' },
    { field: 'bio', points: 15, label: 'Bio' },
    { field: 'location', points: 10, label: 'Location' },
    { field: 'avatar_url', points: 5, label: 'Profile Photo' }
  ];

  // Optional fields for better matching (40 points total)
  const optionalChecks = [
    { field: 'interests', points: 8, label: 'Interests' },
    { field: 'looking_for', points: 8, label: 'What you\'re looking for' },
    { field: 'gender_identity', points: 6, label: 'Gender Identity' },
    { field: 'sexual_orientation', points: 6, label: 'Sexual Orientation' },
    { field: 'favorite_crypto', points: 6, label: 'Favorite Crypto' },
    { field: 'crypto_experience', points: 6, label: 'Crypto Experience' }
  ];

  // Check critical fields
  criticalChecks.forEach(check => {
    const value = profile[check.field];
    if (value && value !== '' && value !== null) {
      score += check.points;
    } else {
      missingCritical.push(check.label);
    }
  });

  // Check optional fields
  optionalChecks.forEach(check => {
    const value = profile[check.field];
    if (value && value !== '' && value !== null) {
      score += check.points;
    } else {
      missingOptional.push(check.label);
    }
  });

  const percentage = Math.round((score / 100) * 100);
  
  let level: ProfileQualityScore['level'];
  let visibilityStatus: ProfileQualityScore['visibilityStatus'];

  if (percentage < 30) {
    level = 'none';
    visibilityStatus = 'invisible';
  } else if (percentage < 60) {
    level = 'minimal';
    visibilityStatus = 'limited';
  } else if (percentage < 85) {
    level = 'good';
    visibilityStatus = 'good';
  } else {
    level = 'excellent';
    visibilityStatus = 'excellent';
  }

  return {
    score,
    percentage,
    level,
    missingCritical,
    missingOptional,
    visibilityStatus
  };
};

export const getVisibilityMessage = (quality: ProfileQualityScore): string => {
  switch (quality.visibilityStatus) {
    case 'invisible':
      return "You're currently invisible in discovery";
    case 'limited':
      return "You have limited visibility in discovery";
    case 'good':
      return "You're visible in discovery with good matching";
    case 'excellent':
      return "You have excellent visibility and matching potential";
    default:
      return "Profile assessment unavailable";
  }
};
