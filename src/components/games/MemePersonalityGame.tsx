import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCw, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemeChoice {
  id: string;
  text: string;
  personality: string;
  points: number;
  memeImage?: string;
}

interface Question {
  id: number;
  scenario: string;
  scenarioImage: string;
  choices: MemeChoice[];
}

interface PersonalityType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  traits: string[];
  compatibility: string[];
  avatarImage: string;
  memeGallery: string[];
}

const questions: Question[] = [
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

const personalityTypes: PersonalityType[] = [
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

interface MemePersonalityGameProps {
  onBack: () => void;
}

const MemePersonalityGame = ({ onBack }: MemePersonalityGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const { toast } = useToast();

  const handleAnswer = (choice: MemeChoice) => {
    const newAnswers = [...answers, choice.personality];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const personalityCount: Record<string, number> = {};
      
      newAnswers.forEach(personality => {
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
        const degenCount = newAnswers.filter(a => a === 'degen').length;
        const chaosCount = newAnswers.filter(a => a === 'chaos').length;
        const carefulCount = newAnswers.filter(a => a === 'careful').length;

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

      setResult(resultType);
      setGameComplete(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setGameComplete(false);
    setResult(null);
  };

  const shareToTwitter = () => {
    if (result) {
      const text = `I just discovered my crypto meme personality: ${result.name} ${result.emoji}! ${result.description} What's your meme energy? 🚀`;
      const url = window.location.href;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const shareToFacebook = () => {
    if (result) {
      const url = window.location.href;
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const shareToLinkedIn = () => {
    if (result) {
      const text = `I just discovered my crypto meme personality: ${result.name} ${result.emoji}! ${result.description}`;
      const url = window.location.href;
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied! 🔗",
      description: "Share your meme personality with the world!",
    });
  };

  if (gameComplete && result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute left-4 top-4 md:left-8 md:top-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          
          <div className="mb-6">
            <img 
              src={result.avatarImage} 
              alt={result.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500 mb-4 object-cover"
            />
            <div className="text-6xl mb-4">{result.emoji}</div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            {result.name}
          </h1>
          <p className="text-lg text-gray-300 mb-6">{result.description}</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button onClick={shareToTwitter} className="bg-blue-500 hover:bg-blue-600">
              <Twitter className="w-4 h-4 mr-2" />
              Share on X
            </Button>
            <Button onClick={shareToFacebook} className="bg-blue-700 hover:bg-blue-800">
              <Facebook className="w-4 h-4 mr-2" />
              Share on Facebook
            </Button>
            <Button onClick={shareToLinkedIn} className="bg-blue-600 hover:bg-blue-700">
              <Linkedin className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </Button>
            <Button onClick={copyLink} variant="outline">
              <Link2 className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={resetGame} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-400">Your Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.traits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-400">Compatible With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.compatibility.map((comp, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {comp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meme Gallery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-yellow-400">🎭 Your Meme Energy Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {result.memeGallery.map((meme, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-purple-500/30">
                  <img 
                    src={meme} 
                    alt={`Meme ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold mb-4 text-center">🎯 Your Meme Energy in Action</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm text-gray-400">Market Moves</div>
                <div className="text-xs">{result.traits[0]}</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🎭</div>
                <div className="text-sm text-gray-400">Humor Style</div>
                <div className="text-xs">{result.traits[1]}</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-sm text-gray-400">Community</div>
                <div className="text-xs">{result.traits[2]}</div>
              </div>
              <div>
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm text-gray-400">Energy</div>
                <div className="text-xs">{result.traits[3]}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute left-4 top-4 md:left-8 md:top-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          🧠 What's Your Meme Energy?
        </h1>
        <p className="text-gray-300 mb-4">
          Discover your crypto meme personality through totally scientific scenarios
        </p>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Scenario Image */}
      <div className="mb-6">
        <img 
          src={question.scenarioImage} 
          alt="Scenario"
          className="w-full max-w-md mx-auto rounded-lg border-2 border-purple-500/30 object-cover"
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-center">
            {question.scenario}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {question.choices.map((choice) => (
              <Button
                key={choice.id}
                variant="outline"
                className="w-full h-auto p-6 text-left justify-start hover:bg-purple-900/20 hover:border-purple-500 flex items-center space-x-6"
                onClick={() => handleAnswer(choice)}
              >
                {choice.memeImage && (
                  <img 
                    src={choice.memeImage} 
                    alt="Choice meme"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-600 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <span className="text-xl mr-3">{choice.text.split(' ')[0]}</span>
                  <span className="text-base">{choice.text.substring(choice.text.indexOf(' ') + 1)}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-400">
        Choose the option that best represents your meme energy! 🚀
      </div>
    </div>
  );
};

export default MemePersonalityGame;
