
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, DollarSign, Target } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface DegenQuestionnaireProps {
  user: SupabaseUser | null;
}

const DegenQuestionnaire = ({ user }: DegenQuestionnaireProps) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState({
    // Financial questions
    portfolioAllocation: '',
    biggestLoss: '',
    biggestWin: '',
    dreamTarget: '',
    riskTolerance: '',
    
    // Behavioral questions
    fomo: [],
    tradingHabits: '',
    marketCrash: '',
    moonStrategy: '',
    
    // Fun/Meme questions
    favoritePhrase: '',
    cryptoAnimal: '',
    worstMistake: '',
    degenConfession: '',
    
    // Social questions
    twitterFollows: '',
    discordGroups: '',
    alphaSource: '',
    shillLevel: ''
  });

  const [degenScore, setDegenScore] = useState(0);

  const handleInputChange = (field: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateDegenScore = () => {
    let score = 0;
    
    // Risk tolerance scoring
    if (responses.riskTolerance === 'yolo') score += 30;
    else if (responses.riskTolerance === 'high') score += 20;
    else if (responses.riskTolerance === 'medium') score += 10;
    
    // Portfolio allocation
    if (responses.portfolioAllocation === '100') score += 25;
    else if (responses.portfolioAllocation === '75') score += 15;
    else if (responses.portfolioAllocation === '50') score += 10;
    
    // FOMO behaviors
    score += (responses.fomo as string[]).length * 5;
    
    // Social activity
    if (responses.shillLevel === 'professional') score += 20;
    else if (responses.shillLevel === 'frequent') score += 15;
    else if (responses.shillLevel === 'sometimes') score += 10;
    
    setDegenScore(Math.min(score, 100));
    
    toast({
      title: "Degen Score Calculated! 🎯",
      description: `Your degen score is ${Math.min(score, 100)}/100`,
    });
  };

  const getDegenLevel = (score: number) => {
    if (score >= 80) return { level: "Ultra Degen 🚀", color: "bg-red-500" };
    if (score >= 60) return { level: "Advanced Degen 💎", color: "bg-orange-500" };
    if (score >= 40) return { level: "Intermediate Degen 📈", color: "bg-yellow-500" };
    if (score >= 20) return { level: "Beginner Degen 🌱", color: "bg-green-500" };
    return { level: "Crypto Curious 👀", color: "bg-blue-500" };
  };

  const fomoOptions = [
    'Bought the top of a pump',
    'FOMO into meme coins',
    'Panic sold at a loss',
    'Bought based on Twitter hype',
    'Aped into unknown projects',
    'Emotional trading decisions'
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Degen Questionnaire 🦍
        </CardTitle>
        <CardDescription>
          Answer these questions to calculate your true degen score and find your crypto tribe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {degenScore > 0 && (
          <div className="text-center p-6 border rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="text-3xl font-bold mb-2">{degenScore}/100</div>
            <Badge className={`${getDegenLevel(degenScore).color} text-white mb-2`}>
              {getDegenLevel(degenScore).level}
            </Badge>
            <p className="text-sm text-muted-foreground">Your Degen Score</p>
          </div>
        )}

        {/* Financial Questions */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Degeneracy
          </h3>
          
          <div className="space-y-2">
            <Label>What % of your portfolio is in crypto?</Label>
            <RadioGroup
              value={responses.portfolioAllocation}
              onValueChange={(value) => handleInputChange('portfolioAllocation', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="25" id="port-25" />
                <Label htmlFor="port-25">25% (Conservative)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50" id="port-50" />
                <Label htmlFor="port-50">50% (Balanced)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="75" id="port-75" />
                <Label htmlFor="port-75">75% (Aggressive)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100" id="port-100" />
                <Label htmlFor="port-100">100% (YOLO Mode) 🚀</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Risk Tolerance Level</Label>
            <RadioGroup
              value={responses.riskTolerance}
              onValueChange={(value) => handleInputChange('riskTolerance', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="risk-low" />
                <Label htmlFor="risk-low">Low (Blue chips only)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="risk-medium" />
                <Label htmlFor="risk-medium">Medium (Some alts)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="risk-high" />
                <Label htmlFor="risk-high">High (Love volatility)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yolo" id="risk-yolo" />
                <Label htmlFor="risk-yolo">YOLO (Meme coins & microcaps) 🦍</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="biggest-loss">Biggest Loss (be honest)</Label>
              <Input
                id="biggest-loss"
                value={responses.biggestLoss}
                onChange={(e) => handleInputChange('biggestLoss', e.target.value)}
                placeholder="Lost my house on LUNA 😭"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biggest-win">Biggest Win</Label>
              <Input
                id="biggest-win"
                value={responses.biggestWin}
                onChange={(e) => handleInputChange('biggestWin', e.target.value)}
                placeholder="10x on DOGE! 🚀"
              />
            </div>
          </div>
        </div>

        {/* Behavioral Questions */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Trading Behavior
          </h3>

          <div className="space-y-3">
            <Label>Which FOMO behaviors apply to you? (Select all)</Label>
            <div className="space-y-2">
              {fomoOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fomo-${index}`}
                    checked={(responses.fomo as string[]).includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange('fomo', [...(responses.fomo as string[]), option]);
                      } else {
                        handleInputChange('fomo', (responses.fomo as string[]).filter(f => f !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`fomo-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="market-crash">What do you do in a market crash?</Label>
            <Textarea
              id="market-crash"
              value={responses.marketCrash}
              onChange={(e) => handleInputChange('marketCrash', e.target.value)}
              placeholder="Buy the dip, panic sell, or hodl for dear life?"
              rows={2}
            />
          </div>
        </div>

        {/* Fun Questions */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Degen Culture
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="crypto-phrase">Favorite Crypto Phrase</Label>
              <Input
                id="crypto-phrase"
                value={responses.favoritePhrase}
                onChange={(e) => handleInputChange('favoritePhrase', e.target.value)}
                placeholder="WAGMI, Diamond Hands, To the Moon!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crypto-animal">Your Crypto Spirit Animal</Label>
              <Input
                id="crypto-animal"
                value={responses.cryptoAnimal}
                onChange={(e) => handleInputChange('cryptoAnimal', e.target.value)}
                placeholder="Bull, Bear, Ape, Shrimp, Whale"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="degen-confession">Degen Confession</Label>
            <Textarea
              id="degen-confession"
              value={responses.degenConfession}
              onChange={(e) => handleInputChange('degenConfession', e.target.value)}
              placeholder="What's the most degen thing you've ever done in crypto? 🤫"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>How often do you shill your bags?</Label>
            <RadioGroup
              value={responses.shillLevel}
              onValueChange={(value) => handleInputChange('shillLevel', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="shill-never" />
                <Label htmlFor="shill-never">Never (Silent holder)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="shill-sometimes" />
                <Label htmlFor="shill-sometimes">Sometimes (Casual mentions)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frequent" id="shill-frequent" />
                <Label htmlFor="shill-frequent">Frequently (Active promoter)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="shill-professional" />
                <Label htmlFor="shill-professional">Professional Shill 📢</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="alpha-source">Main Alpha Source</Label>
              <Input
                id="alpha-source"
                value={responses.alphaSource}
                onChange={(e) => handleInputChange('alphaSource', e.target.value)}
                placeholder="Crypto Twitter, Discord, Reddit, Telegram"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dream-target">Dream Price Target</Label>
              <Input
                id="dream-target"
                value={responses.dreamTarget}
                onChange={(e) => handleInputChange('dreamTarget', e.target.value)}
                placeholder="BTC to $1M, ETH to $50K"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={calculateDegenScore}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          size="lg"
        >
          Calculate My Degen Score 🎯
        </Button>
      </CardContent>
    </Card>
  );
};

export default DegenQuestionnaire;
