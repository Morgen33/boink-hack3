
import { personalityTypes } from './data';
import { PersonalityType } from './types';

export const calculatePersonalityResult = (answers: string[]): PersonalityType => {
  const personalityCount: Record<string, number> = {};
  
  answers.forEach(personality => {
    personalityCount[personality] = (personalityCount[personality] || 0) + 1;
  });

  // Find the most common personality type
  const dominantPersonality = Object.entries(personalityCount)
    .sort(([,a], [,b]) => b - a)[0][0];

  // Map to personality type
  let resultType = personalityTypes.find(type => 
    type.id.includes(dominantPersonality) || 
    type.name.toLowerCase().includes(dominantPersonality)
  );

  // Fallback mapping based on answers
  if (!resultType) {
    const degenCount = answers.filter(a => a === 'degen').length;
    const chaosCount = answers.filter(a => a === 'chaos').length;
    const carefulCount = answers.filter(a => a === 'careful').length;

    if (degenCount >= 3) {
      resultType = personalityTypes[0]; // Apex Degen
    } else if (chaosCount >= 2) {
      resultType = personalityTypes[3]; // Chaos Agent
    } else if (carefulCount >= 2) {
      resultType = personalityTypes[4]; // Cautious Ape
    } else {
      resultType = personalityTypes[1]; // Meme Lord
    }
  }

  return resultType;
};
