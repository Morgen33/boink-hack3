
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Sparkles, Target } from 'lucide-react';

interface AboutYouStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const lookingForOptions = [
  'Serious relationship',
  'Casual dating', 
  'Friends first',
  'Crypto friends',
  'Trading buddies',
  'Business partners',
  'NFT collectors',
  'DeFi enthusiasts',
  'Meme lords',
  'Gaming partners',
  'Travel companions',
  'Open to anything'
];

const AboutYouStep = ({ data, onUpdate }: AboutYouStepProps) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleLookingForChange = (option: string, checked: boolean) => {
    const currentSelections = data.looking_for ? data.looking_for.split(', ').filter(Boolean) : [];
    
    if (checked) {
      const newSelections = [...currentSelections, option];
      onUpdate({ looking_for: newSelections.join(', ') });
    } else {
      const newSelections = currentSelections.filter((item: string) => item !== option);
      onUpdate({ looking_for: newSelections.join(', ') });
    }
  };

  const selectedOptions = data.looking_for ? data.looking_for.split(', ').filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <p className="text-muted-foreground">
          Tell your story! This is what people will see first when they discover your profile.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Bio *
        </Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself... Are you a diamond hands HODLer or a paper hands trader? What makes you unique in the crypto space? 💎🙌"
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Tip: Mention your crypto journey, favorite projects, or what you're passionate about!
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Hobbies</Label>
        <Input
          id="interests"
          value={data.interests}
          onChange={(e) => handleInputChange('interests', e.target.value)}
          placeholder="DeFi, NFTs, Gaming, Music, Art, Memes, Yield Farming, Travel"
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple interests with commas. Mix crypto and non-crypto interests!
        </p>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          What are you looking for? * (select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {lookingForOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`looking-${option}`}
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => handleLookingForChange(option, !!checked)}
              />
              <Label 
                htmlFor={`looking-${option}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Select all that apply. This helps our algorithm find better matches for you!
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Pro Tips for a Great Profile
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Be authentic - the crypto community values realness</li>
          <li>• Share your wins AND losses - we've all been rekt</li>
          <li>• Mention specific projects you're passionate about</li>
          <li>• Include non-crypto interests too - you're more than just DeFi</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutYouStep;
