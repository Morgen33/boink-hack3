import { Network, Globe } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkingPreferencesStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const networkingGoals = [
  'Find co-founders',
  'Recruit talent',
  'Seek investment/funding',
  'Business partnerships',
  'Knowledge sharing',
  'Mentorship (giving)',
  'Mentorship (receiving)',
  'Industry insights',
  'Technical collaboration',
  'Community building'
];

const lookingForTypes = [
  'Developers/Engineers',
  'Founders/Entrepreneurs',
  'Investors/VCs',
  'Advisors/Mentors',
  'Marketing professionals',
  'Product managers',
  'Designers',
  'Legal/Compliance experts',
  'Community managers',
  'Content creators'
];

const NetworkingPreferencesStep = ({ data, onUpdate }: NetworkingPreferencesStepProps) => {
  const handleGoalsChange = (goal: string, checked: boolean) => {
    const currentGoals = data.networking_goals || [];
    if (checked) {
      onUpdate('networking_goals', [...currentGoals, goal]);
    } else {
      onUpdate('networking_goals', currentGoals.filter((g: string) => g !== goal));
    }
  };

  const handleLookingForChange = (type: string, checked: boolean) => {
    const currentTypes = data.looking_for_networking || [];
    if (checked) {
      onUpdate('looking_for_networking', [...currentTypes, type]);
    } else {
      onUpdate('looking_for_networking', currentTypes.filter((t: string) => t !== type));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Network className="w-12 h-12 text-white" />
        </div>
        <p className="text-muted-foreground">
          Define your networking goals and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Networking Goals</CardTitle>
          <p className="text-sm text-muted-foreground">
            What are you hoping to achieve through professional networking?
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {networkingGoals.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={(data.networking_goals || []).includes(goal)}
                  onCheckedChange={(checked) => handleGoalsChange(goal, !!checked)}
                />
                <Label 
                  htmlFor={`goal-${goal}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {goal}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Looking to Connect With</CardTitle>
          <p className="text-sm text-muted-foreground">
            What types of professionals are you interested in connecting with?
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lookingForTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`looking-${type}`}
                  checked={(data.looking_for_networking || []).includes(type)}
                  onCheckedChange={(checked) => handleLookingForChange(type, !!checked)}
                />
                <Label 
                  htmlFor={`looking-${type}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Online Presence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
            <Input
              id="linkedin_url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={data.linkedin_url || ''}
              onChange={(e) => onUpdate('linkedin_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website/Portfolio</Label>
            <Input
              id="website_url"
              placeholder="https://yourwebsite.com"
              value={data.website_url || ''}
              onChange={(e) => onUpdate('website_url', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingPreferencesStep;