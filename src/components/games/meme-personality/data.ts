
import { Question, PersonalityType } from './types';

export const questions: Question[] = [
  {
    id: 1,
    scenario: "Bitcoin just crashed 30% in 5 minutes. Your first reaction?",
    scenarioImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🔥 'This is fine' dog meme", personality: "stoic", points: 3, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" },
      { id: "b", text: "💎 'Diamond hands' - buying the dip", personality: "degen", points: 4, memeImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop" },
      { id: "c", text: "😱 Wojak crying face", personality: "emotional", points: 2, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" },
      { id: "d", text: "🤡 'Honk honk' clown world", personality: "chaos", points: 5, memeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 2,
    scenario: "Your friend asks for crypto advice. You send them:",
    scenarioImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "📈 'Number go up' chart", personality: "optimist", points: 3, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" },
      { id: "b", text: "🚨 'This is not financial advice' disclaimer", personality: "careful", points: 2, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" },
      { id: "c", text: "🚀 'To the moon' rocket", personality: "degen", points: 4, memeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop" },
      { id: "d", text: "🤷 'I don't know shit about fuck'", personality: "honest", points: 3, memeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 3,
    scenario: "You see a new meme coin with 1000x potential. You:",
    scenarioImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🎰 YOLO life savings immediately", personality: "degen", points: 5, memeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop" },
      { id: "b", text: "🧐 Research for 6 hours first", personality: "careful", points: 2, memeImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop" },
      { id: "c", text: "📊 Put in $100 for the memes", personality: "balanced", points: 3, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" },
      { id: "d", text: "💀 'Another day, another rug'", personality: "cynical", points: 4, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 4,
    scenario: "Gas fees are $200 for a $50 transaction. Your meme energy:",
    scenarioImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🔥 'Money printer go brrr'", personality: "degen", points: 4, memeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop" },
      { id: "b", text: "⏰ 'I'll wait for 3am'", personality: "patient", points: 2, memeImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop" },
      { id: "c", text: "🤬 Angry Pepe screaming", personality: "emotional", points: 3, memeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop" },
      { id: "d", text: "🎭 'Welcome to Ethereum'", personality: "accepting", points: 3, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 5,
    scenario: "Someone mentions they're 'hodling' since 2017. You respond:",
    scenarioImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🙏 'Respect the diamond hands'", personality: "respectful", points: 3, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" },
      { id: "b", text: "🧓 'OK boomer' Bitcoin grandpa", personality: "chaos", points: 4, memeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop" },
      { id: "c", text: "💎 'This is the way'", personality: "community", points: 3, memeImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop" },
      { id: "d", text: "📈 'You're rich now, right?'", personality: "curious", points: 2, memeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 6,
    scenario: "NFTs are mentioned at a party. Your immediate thought:",
    scenarioImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🖼️ 'Right-click save as'", personality: "chaos", points: 4, memeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop" },
      { id: "b", text: "🎨 'Actually, some are artistic'", personality: "optimist", points: 3, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" },
      { id: "c", text: "💸 'Expensive JPEGs'", personality: "cynical", points: 4, memeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop" },
      { id: "d", text: "🤷 'Each to their own'", personality: "neutral", points: 2, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 7,
    scenario: "DeFi summer hits again. Your strategy:",
    scenarioImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🌾 'Farming every yield'", personality: "degen", points: 5, memeImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop" },
      { id: "b", text: "🏦 'Banks hate this one trick'", personality: "rebel", points: 4, memeImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop" },
      { id: "c", text: "⚠️ 'Smart contracts are risky'", personality: "careful", points: 2, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" },
      { id: "d", text: "📚 'What's DeFi?'", personality: "newbie", points: 1, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" }
    ]
  },
  {
    id: 8,
    scenario: "Elon tweets about Dogecoin at 3am. You:",
    scenarioImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    choices: [
      { id: "a", text: "🚀 Immediately buy more DOGE", personality: "degen", points: 5, memeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop" },
      { id: "b", text: "🙄 'Here we go again'", personality: "tired", points: 3, memeImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop" },
      { id: "c", text: "📱 Screenshot and meme it", personality: "content", points: 4, memeImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop" },
      { id: "d", text: "😴 'I was sleeping like normal'", personality: "healthy", points: 2, memeImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop" }
    ]
  }
];

export const personalityTypes: PersonalityType[] = [
  {
    id: "apex-degen",
    name: "Apex Degen",
    emoji: "🚀",
    description: "You live for the chaos and YOLO harder than anyone. Risk is your middle name.",
    traits: ["High risk tolerance", "Meme coin enthusiast", "3am trader", "Diamond hands"],
    compatibility: ["Fellow Degens", "Chaos Agents", "Risk Takers"],
    avatarImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop",
    memeGallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "meme-lord",
    name: "Meme Lord",
    emoji: "👑",
    description: "You speak fluent meme and turn every market move into comedy gold.",
    traits: ["Content creator", "Community builder", "Humor master", "Cultural trendsetter"],
    compatibility: ["Content Creators", "Community Leaders", "Humor Lovers"],
    avatarImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=300&fit=crop",
    memeGallery: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "diamond-sage",
    name: "Diamond Sage",
    emoji: "💎",
    description: "Wise hodler who's seen it all. You're the voice of reason in the chaos.",
    traits: ["Long-term vision", "Market wisdom", "Steady hands", "Mentor vibes"],
    compatibility: ["Fellow Sages", "Learning Seekers", "Stability Lovers"],
    avatarImage: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=300&h=300&fit=crop",
    memeGallery: [
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "chaos-agent",
    name: "Chaos Agent",
    emoji: "🤡",
    description: "You embrace the clown world and find humor in every market disaster.",
    traits: ["Embraces chaos", "Dark humor", "Unpredictable", "Accepts the madness"],
    compatibility: ["Chaos Agents", "Humor Lovers", "Unpredictables"],
    avatarImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=300&fit=crop",
    memeGallery: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "cautious-ape",
    name: "Cautious Ape",
    emoji: "🦍",
    description: "You're careful but still in the game. Research first, ape second.",
    traits: ["Risk management", "Due diligence", "Calculated moves", "Safety first"],
    compatibility: ["Fellow Cautious Types", "Learning Partners", "Steady Investors"],
    avatarImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop",
    memeGallery: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop"
    ]
  },
  {
    id: "balanced-trader",
    name: "Balanced Trader",
    emoji: "⚖️",
    description: "You've found the sweet spot between YOLO and boring. Perfect equilibrium.",
    traits: ["Balanced approach", "Measured risk", "Steady growth", "Practical wisdom"],
    compatibility: ["Balanced Types", "Stable Partners", "Growth Focused"],
    avatarImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=300&fit=crop",
    memeGallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop"
    ]
  }
];
