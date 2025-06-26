export interface ProfileCard {
  id: string;
  full_name: string | null;
  age: number | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  avatar_url: string | null;
  isDemo?: boolean;
}

// Demo crypto Twitter profiles
export const demoProfiles: ProfileCard[] = [
  {
    id: 'demo-1',
    full_name: 'Alex DeFi',
    age: 28,
    bio: '🌾 Yield farming since 2020 | LP tokens are my love language | Building the future of finance one protocol at a time | Currently 47% APY on my portfolio',
    location: 'San Francisco, CA',
    interests: ['DeFi', 'Yield Farming', 'Liquidity Mining', 'DAOs', 'Web3'],
    looking_for: 'Looking for someone who understands that "rugged" isn\'t just a carpet texture',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-2',
    full_name: 'Luna NFTqueen',
    age: 26,
    bio: '🎨 Digital artist | Minted 10k collection | Floor price 0.3 ETH | BAYC holder | Creating the metaverse one pixel at a time | She/Her',
    location: 'Los Angeles, CA',
    interests: ['NFTs', 'Digital Art', 'Metaverse', 'OpenSea', 'Solana'],
    looking_for: 'Seeking someone who appreciates fine art (and by fine art I mean JPEGs)',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-3',
    full_name: 'Bitcoin Brad',
    age: 32,
    bio: '₿ Bitcoin maximalist | HODL since 2013 | "Have fun staying poor" - me, probably | Stack sats, not shitcoins | Orange pill evangelist | 21M cap forever',
    location: 'Austin, TX',
    interests: ['Bitcoin', 'HODLing', 'Austrian Economics', 'Self Custody', 'Lightning Network'],
    looking_for: 'Looking for someone who knows 21 million is the only number that matters',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-4',
    full_name: 'Vitalik Vibe',
    age: 29,
    bio: '🔷 Ethereum dev | Building dApps that your grandma will use | Solidity is my second language | EIP-1559 changed my life | Currently working on Layer 2 scaling',
    location: 'Toronto, ON',
    interests: ['Ethereum', 'Smart Contracts', 'dApps', 'Layer 2', 'Solidity'],
    looking_for: 'Seeking someone who gets excited about gas optimizations',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-5',
    full_name: 'Crypto Sophia',
    age: 27,
    bio: '📈 Day trader | TA wizard | "Buy the dip" is my motto | 100x leverage enthusiast | Lost everything twice, made it back three times | Risk management is overrated',
    location: 'Miami, FL',
    interests: ['Trading', 'Technical Analysis', 'Futures', 'Leverage', 'Market Psychology'],
    looking_for: 'Looking for someone who won\'t judge my 3AM chart watching sessions',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-6',
    full_name: 'DAO Danny',
    age: 31,
    bio: '🏛️ Web3 entrepreneur | Founded 3 DAOs | Governance token collector | "Decentralization or death" | Currently disrupting disruption | Seed round incoming',
    location: 'New York, NY',
    interests: ['DAOs', 'Governance', 'Web3', 'Startups', 'Token Economics'],
    looking_for: 'Seeking co-founder material (in life and business)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-7',
    full_name: 'Meme Queen Maya',
    age: 25,
    bio: '🐕 Doge to the moon | Shiba army general | If it has a dog logo, I\'m in | Portfolio is 90% meme coins and I\'m proud | Diamond hands, smooth brain',
    location: 'Portland, OR',
    interests: ['Meme Coins', 'Dogecoin', 'Shiba Inu', 'Community', 'HODL'],
    looking_for: 'Looking for someone who takes memes seriously (but not too seriously)',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-8',
    full_name: 'Research Ryan',
    age: 33,
    bio: '🎓 Blockchain researcher | PhD in Cryptography | Published 50+ papers | "Not your keys, not your crypto" | Quantum resistance advocate | Privacy maximalist',
    location: 'Cambridge, MA',
    interests: ['Blockchain Research', 'Cryptography', 'Privacy Coins', 'Academic Papers', 'Zero Knowledge'],
    looking_for: 'Seeking someone who appreciates the beauty of cryptographic proofs',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-9',
    full_name: 'Influencer Ivy',
    age: 24,
    bio: '📱 Crypto content creator | 100K followers | "GM" every morning | Sponsored by 12 protocols | Making crypto accessible to normies | Always shilling something',
    location: 'Dubai, UAE',
    interests: ['Content Creation', 'Social Media', 'Influencer Marketing', 'Crypto Education', 'Personal Branding'],
    looking_for: 'Looking for someone who won\'t get jealous of my DMs (they\'re mostly about airdrops)',
    avatar_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  },
  {
    id: 'demo-10',
    full_name: 'Staking Steve',
    age: 30,
    bio: '⚡ Validator node operator | Running 15 different chains | 12% annual rewards | "Proof of Stake > Proof of Work" | Slash conditions give me nightmares',
    location: 'London, UK',
    interests: ['Staking', 'Validators', 'Proof of Stake', 'Node Operations', 'Passive Income'],
    looking_for: 'Seeking someone who understands that uptime is everything',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=face',
    isDemo: true
  }
];
