
import { MemeOption, MemeMatchup } from './types';

// Placeholder meme options - you can replace these with actual meme images later
export const memeOptions: MemeOption[] = [
  {
    id: 'stonks',
    title: 'Stonks',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop',
    category: 'Trading',
    tags: ['gains', 'bullish', 'stocks']
  },
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
    category: 'Trading',
    tags: ['hodl', 'diamond', 'hold']
  },
  {
    id: 'paper-hands',
    title: 'Paper Hands',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop',
    category: 'Trading',
    tags: ['weak', 'sell', 'paper']
  },
  {
    id: 'to-the-moon',
    title: 'To The Moon',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    category: 'Bullish',
    tags: ['moon', 'rocket', 'gains']
  },
  {
    id: 'ape-together',
    title: 'Apes Together Strong',
    image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop',
    category: 'Community',
    tags: ['apes', 'community', 'strong']
  },
  {
    id: 'doge',
    title: 'Much Wow Doge',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop',
    category: 'Meme Coins',
    tags: ['doge', 'wow', 'shiba']
  },
  {
    id: 'rekt',
    title: 'Get Rekt',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'Bearish',
    tags: ['rekt', 'loss', 'bear']
  },
  {
    id: 'lambo',
    title: 'When Lambo',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=400&fit=crop',
    category: 'Lifestyle',
    tags: ['lambo', 'rich', 'goals']
  }
];

// Generate matchups from the meme options
export const generateMatchups = (): MemeMatchup[] => {
  const matchups: MemeMatchup[] = [];
  
  for (let i = 0; i < memeOptions.length; i++) {
    for (let j = i + 1; j < memeOptions.length; j++) {
      const memeA = memeOptions[i];
      const memeB = memeOptions[j];
      
      matchups.push({
        id: `${memeA.id}-vs-${memeB.id}`,
        memeA,
        memeB,
        category: memeA.category === memeB.category ? memeA.category : 'Mixed'
      });
    }
  }
  
  // Shuffle the matchups
  return matchups.sort(() => Math.random() - 0.5);
};

export const memeMatchups = generateMatchups();
