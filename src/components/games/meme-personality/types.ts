
export interface MemeChoice {
  id: string;
  text: string;
  personality: string;
  points: number;
  memeImage?: string;
}

export interface Question {
  id: number;
  scenario: string;
  scenarioImage: string;
  choices: MemeChoice[];
}

export interface PersonalityType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  compatibility: string[];
  avatarImage: string;
  memeGallery: string[];
}
