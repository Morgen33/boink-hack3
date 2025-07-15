
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Sparkles } from 'lucide-react';
import { validateAboutYouStep } from '@/utils/profileValidation';

interface AboutYouStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

const AboutYouStep = ({ data, onUpdate }: AboutYouStepProps) => {
  const validation = validateAboutYouStep(data);

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

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
          Bio * (minimum 50 characters)
        </Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself... Are you a diamond hands HODLer or a paper hands trader? What makes you unique in the crypto space? 💎🙌"
          rows={4}
          className={`resize-none ${validation.errors.bio ? 'border-red-500' : ''}`}
        />
        <div className="flex justify-between items-center">
          <div>
            {validation.errors.bio && (
              <p className="text-sm text-red-600">{validation.errors.bio}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Tip: Mention your crypto journey, favorite projects, or what you're passionate about!
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.bio?.length || 0}/50 min
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Hobbies</Label>
        <Input
          id="interests"
          value={data.interests}
          onChange={(e) => handleInputChange('interests', e.target.value)}
          placeholder="DeFi, NFTs, Gaming, Reading, Music, Art, Memes, Yield Farming, Travel"
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple interests with commas. Mix crypto and non-crypto interests!
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
