import { Network, Globe, Clock, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkingPreferencesStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const networkingGoals = [
  'Seeking technical co-founder for DeFi protocol',
  'Looking for seed investors (Web3 native)',
  'Building developer community for L2 solution',
  'Seeking partnerships for NFT/gaming project',
  'Looking for advisors with DeFi experience',
  'Recruiting senior Solidity developers',
  'Building relationships with Web3 VCs',
  'Connecting with other Web3 founders',
  'Finding collaborators for DAO initiatives',
  'Seeking mentorship in tokenomics',
  'Looking for audit/security partners',
  'Building strategic partnerships',
  'Seeking technical advisors',
  'Looking for marketing/community talent',
  'Finding Web3 product managers',
  'Seeking legal/compliance expertise',
  'Building investor relationships',
  'Looking for business development partners'
];

const lookingForTypes = [
  'Solidity/Smart Contract Developers',
  'Frontend/dApp Developers',
  'Protocol Engineers',
  'Security/Audit Experts',
  'Blockchain Architects',
  'Web3 Founders/Entrepreneurs',
  'Crypto VCs/Investors',
  'Angel Investors (Web3)',
  'DeFi Protocol Advisors',
  'Tokenomics Experts',
  'Web3 Product Managers',
  'DevRel/Developer Advocates',
  'Web3 Marketing Professionals',
  'Community/DAO Managers',
  'Crypto Legal/Compliance',
  'Business Development',
  'Web3 UX/UI Designers',
  'Technical Writers',
  'Growth Hackers'
];

const timelineOptions = [
  'Immediate (within 1 month)',
  'Short-term (1-3 months)',
  'Medium-term (3-6 months)',
  'Long-term (6+ months)',
  'Ongoing relationship building'
];

const collaborationPreferences = [
  'Remote collaboration',
  'In-person meetings',
  'Hybrid (remote + in-person)',
  'Conference/event networking',
  'Group collaborations',
  'One-on-one mentorship',
  'Team-based projects',
  'Community-driven initiatives'
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

  const handleCollaborationChange = (pref: string, checked: boolean) => {
    const currentPrefs = data.collaboration_preferences || [];
    if (checked) {
      onUpdate('collaboration_preferences', [...currentPrefs, pref]);
    } else {
      onUpdate('collaboration_preferences', currentPrefs.filter((p: string) => p !== pref));
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
            <Clock className="w-5 h-5" />
            Timeline & Urgency
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            When are you looking to achieve your networking goals?
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="networking_timeline">Timeline</Label>
            <Select value={data.networking_timeline} onValueChange={(value) => onUpdate('networking_timeline', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelineOptions.map((timeline) => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaboration Preferences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How do you prefer to collaborate and network?
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {collaborationPreferences.map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={`collab-${pref}`}
                  checked={(data.collaboration_preferences || []).includes(pref)}
                  onCheckedChange={(checked) => handleCollaborationChange(pref, !!checked)}
                />
                <Label 
                  htmlFor={`collab-${pref}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {pref}
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
            Online Presence & Verification
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

          <div className="space-y-2">
            <Label htmlFor="twitter_url">Twitter/X Profile</Label>
            <Input
              id="twitter_url"
              placeholder="https://twitter.com/yourusername"
              value={data.twitter_url || ''}
              onChange={(e) => onUpdate('twitter_url', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingPreferencesStep;