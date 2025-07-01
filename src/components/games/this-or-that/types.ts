
export interface MemeOption {
  id: string;
  title: string;
  image: string;
  category?: string;
  tags?: string[];
}

export interface MemeMatchup {
  id: string;
  memeA: MemeOption;
  memeB: MemeOption;
  category: string;
}

export interface UserChoice {
  matchupId: string;
  chosenMemeId: string;
  timestamp: Date;
}

export interface GameStats {
  totalChoices: number;
  favoriteCategories: string[];
  compatibilityScore?: number;
}
