
import { MemeOption, MemeMatchup } from './types';

// Real meme options with authentic meme energy
export const memeOptions: MemeOption[] = [
  {
    id: 'pudding-dick',
    title: 'I Love Pudding',
    image: '/lovable-uploads/c88180c4-37b0-42d7-844d-ca5de9532a57.png',
    category: 'Chaos',
    tags: ['inappropriate', 'chaotic', 'unhinged']
  },
  {
    id: 'take-one-for-team',
    title: 'Take One For Team',
    image: '/lovable-uploads/cb40035d-41b9-4b89-bdaa-4916fa01062d.png',
    category: 'Loyalty',
    tags: ['reluctant', 'team-player', 'sacrifice']
  },
  {
    id: 'drives-me-up-wall',
    title: 'Drives Me Up The Wall',
    image: '/lovable-uploads/0a1149c2-c0b4-4ce6-afe2-fbfd6c180b0f.png',
    category: 'Frustration',
    tags: ['annoyed', 'frustrated', 'angry']
  },
  {
    id: 'magic-wand',
    title: 'Magic Wand Racecars',
    image: '/lovable-uploads/4d82c8cb-c08f-4afe-aaf4-4348d1346513.png',
    category: 'Inappropriate',
    tags: ['innuendo', 'inappropriate', 'chaotic']
  },
  {
    id: 'cholo-yolo',
    title: 'Cholo YOLO',
    image: '/lovable-uploads/59344510-546d-4d0a-ab0a-360a77dbf81e.png',
    category: 'Risky',
    tags: ['yolo', 'dangerous', 'extreme']
  },
  {
    id: 'meanwhile-walmart',
    title: 'Meanwhile At Walmart',
    image: '/lovable-uploads/75900601-28eb-478a-9c00-e62643b98646.png',
    category: 'Chaos',
    tags: ['walmart', 'chaos', 'weird']
  },
  {
    id: 'going-places',
    title: 'Going Places',
    image: '/lovable-uploads/c81d2cb4-ccf6-4189-b387-c3dc3d3ac2a2.png',
    category: 'Smart',
    tags: ['clever', 'genius', 'smart']
  },
  {
    id: 'true-friendship',
    title: 'True Friendship',
    image: '/lovable-uploads/a31f8ca5-87e4-4491-8130-2571cf03c732.png',
    category: 'Friendship',
    tags: ['loyalty', 'friendship', 'support']
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
