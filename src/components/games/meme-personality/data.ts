import { Question, PersonalityType } from './types';

export const questions: Question[] = [
  {
    id: 1,
    scenario: "Bitcoin just crashed 30% in 5 minutes. Your first reaction?",
    scenarioImage: "/lovable-uploads/b751b95e-6db2-490c-81c4-d5a01ca6e54f.png",
    choices: [
      { id: "a", text: "🔥 'This is fine' - keep hodling", personality: "stoic", points: 3, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" },
      { id: "b", text: "💎 'Diamond hands' - buying the dip", personality: "degen", points: 4, memeImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png" },
      { id: "c", text: "😱 'This drives me up the wall!'", personality: "emotional", points: 2, memeImage: "/lovable-uploads/b751b95e-6db2-490c-81c4-d5a01ca6e54f.png" },
      { id: "d", text: "🤡 'Meanwhile at the crypto market'", personality: "chaos", points: 5, memeImage: "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png" }
    ]
  },
  {
    id: 2,
    scenario: "Your friend asks for crypto advice. You send them:",
    scenarioImage: "/lovable-uploads/d46acc40-3308-4136-9a82-acb33c16485e.png",
    choices: [
      { id: "a", text: "📈 'It's gon' rain' gains", personality: "optimist", points: 3, memeImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png" },
      { id: "b", text: "🚨 'This is not financial advice'", personality: "careful", points: 2, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" },
      { id: "c", text: "🚀 'To the moon' vibes", personality: "degen", points: 4, memeImage: "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png" },
      { id: "d", text: "🤷 'Ain't no snitch' - keep it quiet", personality: "honest", points: 3, memeImage: "/lovable-uploads/ec0f32f2-7f29-4076-9886-c578ad860830.png" }
    ]
  },
  {
    id: 3,
    scenario: "You see a new meme coin with 1000x potential. You:",
    scenarioImage: "/lovable-uploads/a374de1c-8173-4541-88d7-a1032fef38f3.png",
    choices: [
      { id: "a", text: "🎰 YOLO life savings immediately", personality: "degen", points: 5, memeImage: "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png" },
      { id: "b", text: "🧐 Research for 6 hours first", personality: "careful", points: 2, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" },
      { id: "c", text: "📊 Put in $100 for the memes", personality: "balanced", points: 3, memeImage: "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png" },
      { id: "d", text: "💀 'Another day, another rug'", personality: "cynical", points: 4, memeImage: "/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png" }
    ]
  },
  {
    id: 4,
    scenario: "Gas fees are $200 for a $50 transaction. Your meme energy:",
    scenarioImage: "/lovable-uploads/b751b95e-6db2-490c-81c4-d5a01ca6e54f.png",
    choices: [
      { id: "a", text: "🔥 'Money printer go brrr'", personality: "degen", points: 4, memeImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png" },
      { id: "b", text: "⏰ 'I'll wait for 3am'", personality: "patient", points: 2, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" },
      { id: "c", text: "🤬 'This drives me up the wall!'", personality: "emotional", points: 3, memeImage: "/lovable-uploads/b751b95e-6db2-490c-81c4-d5a01ca6e54f.png" },
      { id: "d", text: "🎭 'Welcome to Ethereum'", personality: "accepting", points: 3, memeImage: "/lovable-uploads/a374de1c-8173-4541-88d7-a1032fef38f3.png" }
    ]
  },
  {
    id: 5,
    scenario: "Someone mentions they're 'hodling' since 2017. You respond:",
    scenarioImage: "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png",
    choices: [
      { id: "a", text: "🙏 'Respect the diamond hands'", personality: "respectful", points: 3, memeImage: "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png" },
      { id: "b", text: "🧓 'OK boomer' Bitcoin grandpa", personality: "chaos", points: 4, memeImage: "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png" },
      { id: "c", text: "💎 'This is the way'", personality: "community", points: 3, memeImage: "/lovable-uploads/4a6ee6fe-4d1d-4eac-89d3-5dee75336f46.png" },
      { id: "d", text: "📈 'You're rich now, right?'", personality: "curious", points: 2, memeImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png" }
    ]
  },
  {
    id: 6,
    scenario: "NFTs are mentioned at a party. Your immediate thought:",
    scenarioImage: "/lovable-uploads/dc258823-b296-4c84-b5b7-d579ea1aa53b.png",
    choices: [
      { id: "a", text: "🖼️ 'Right-click save as'", personality: "chaos", points: 4, memeImage: "/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png" },
      { id: "b", text: "🎨 'Actually, some are artistic'", personality: "optimist", points: 3, memeImage: "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png" },
      { id: "c", text: "💸 'Expensive JPEGs'", personality: "cynical", points: 4, memeImage: "/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png" },
      { id: "d", text: "🤷 'Each to their own'", personality: "neutral", points: 2, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" }
    ]
  },
  {
    id: 7,
    scenario: "DeFi summer hits again. Your strategy:",
    scenarioImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png",
    choices: [
      { id: "a", text: "🌾 'Farming every yield'", personality: "degen", points: 5, memeImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png" },
      { id: "b", text: "🏦 'Banks hate this one trick'", personality: "rebel", points: 4, memeImage: "/lovable-uploads/ec0f32f2-7f29-4076-9886-c578ad860830.png" },
      { id: "c", text: "⚠️ 'Smart contracts are risky'", personality: "careful", points: 2, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" },
      { id: "d", text: "📚 'What's DeFi?'", personality: "newbie", points: 1, memeImage: "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png" }
    ]
  },
  {
    id: 8,
    scenario: "You're at Walmart and overhear crypto talk. You:",
    scenarioImage: "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png",
    choices: [
      { id: "a", text: "🚀 Join the conversation immediately", personality: "degen", points: 5, memeImage: "/lovable-uploads/dc258823-b296-4c84-b5b7-d579ea1aa53b.png" },
      { id: "b", text: "🙄 'Here we go again'", personality: "tired", points: 3, memeImage: "/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png" },
      { id: "c", text: "📱 'Meanwhile at Walmart' - meme it", personality: "content", points: 4, memeImage: "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png" },
      { id: "d", text: "😴 'Mind my own business'", personality: "healthy", points: 2, memeImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png" }
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
    avatarImage: "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png",
    memeGallery: [
      "/lovable-uploads/0305be12-86be-4648-ae9b-6adb9e4ccd47.png",
      "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png",
      "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png"
    ]
  },
  {
    id: "meme-lord",
    name: "Meme Lord",
    emoji: "👑",
    description: "You speak fluent meme and turn every market move into comedy gold.",
    traits: ["Content creator", "Community builder", "Humor master", "Cultural trendsetter"],
    compatibility: ["Content Creators", "Community Leaders", "Humor Lovers"],
    avatarImage: "/lovable-uploads/dc258823-b296-4c84-b5b7-d579ea1aa53b.png",
    memeGallery: [
      "/lovable-uploads/dc258823-b296-4c84-b5b7-d579ea1aa53b.png",
      "/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png",
      "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png"
    ]
  },
  {
    id: "diamond-sage",
    name: "Diamond Sage",
    emoji: "💎",
    description: "Wise hodler who's seen it all. You're the voice of reason in the chaos.",
    traits: ["Long-term vision", "Market wisdom", "Steady hands", "Mentor vibes"],
    compatibility: ["Fellow Sages", "Learning Seekers", "Stability Lovers"],
    avatarImage: "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png",
    memeGallery: [
      "/lovable-uploads/8cb46f23-d9ec-49b0-a0f1-ff41811cb303.png",
      "/lovable-uploads/4a6ee6fe-4d1d-4eac-89d3-5dee75336f46.png",
      "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png"
    ]
  },
  {
    id: "chaos-agent",
    name: "Chaos Agent",
    emoji: "🤡",
    description: "You embrace the clown world and find humor in every market disaster.",
    traits: ["Embraces chaos", "Dark humor", "Unpredictable", "Accepts the madness"],
    compatibility: ["Chaos Agents", "Humor Lovers", "Unpredictables"],
    avatarImage: "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png",
    memeGallery: [
      "/lovable-uploads/5f37e312-9a22-4efc-80c9-d1cb26020a47.png",
      "/lovable-uploads/a374de1c-8173-4541-88d7-a1032fef38f3.png",
      "/lovable-uploads/a9bb1df3-dee7-4ab2-bf64-8287b4fd2229.png"
    ]
  },
  {
    id: "cautious-ape",
    name: "Cautious Ape",
    emoji: "🦍",
    description: "You're careful but still in the game. Research first, ape second.",
    traits: ["Risk management", "Due diligence", "Calculated moves", "Safety first"],
    compatibility: ["Fellow Cautious Types", "Learning Partners", "Steady Investors"],
    avatarImage: "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png",
    memeGallery: [
      "/lovable-uploads/012865ab-889d-4820-8cc0-a2048a9d01a1.png",
      "/lovable-uploads/b751b95e-6db2-490c-81c4-d5a01ca6e54f.png",
      "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png"
    ]
  },
  {
    id: "balanced-trader",
    name: "Balanced Trader",
    emoji: "⚖️",
    description: "You've found the sweet spot between YOLO and boring. Perfect equilibrium.",
    traits: ["Balanced approach", "Measured risk", "Steady growth", "Practical wisdom"],
    compatibility: ["Balanced Types", "Stable Partners", "Growth Focused"],
    avatarImage: "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png",
    memeGallery: [
      "/lovable-uploads/4ab6d780-12c5-4b87-8960-05c18e7caa3b.png",
      "/lovable-uploads/e6e0a477-c9fe-46b3-b7a4-04c351f7e3b5.png",
      "/lovable-uploads/4a6ee6fe-4d1d-4eac-89d3-5dee75336f46.png"
    ]
  }
];