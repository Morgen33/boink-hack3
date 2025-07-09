import { Brain, Target } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkingBackgroundStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const expertiseAreas = [
  'DeFi Protocols',
  'Smart Contract Development',
  'Blockchain Architecture',
  'Tokenomics',
  'NFT Development',
  'DAO Governance',
  'Web3 Security',
  'MEV/Trading Strategies',
  'Layer 2 Solutions',
  'Cross-chain Technology',
  'Crypto Investment Analysis',
  'Community Building',
  'Product Management',
  'Marketing & Growth',
  'Legal & Compliance'
];

const NetworkingBackgroundStep = ({ data, onUpdate }: NetworkingBackgroundStepProps) => {
  const handleExpertiseChange = (area: string, checked: boolean) => {
    const currentAreas = data.expertise_areas || [];
    if (checked) {
      onUpdate('expertise_areas', [...currentAreas, area]);
    } else {
      onUpdate('expertise_areas', currentAreas.filter((a: string) => a !== area));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-12 h-12 text-white" />
        </div>
        <p className="text-muted-foreground">
          Showcase your Web3 expertise and experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Professional Bio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="professional_bio">Professional Bio *</Label>
            <Textarea
              id="professional_bio"
              placeholder="Describe your Web3 journey, current role, and what you're passionate about in the space..."
              value={data.professional_bio || ''}
              onChange={(e) => onUpdate('professional_bio', e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This will be visible to other professionals looking to connect
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Areas of Expertise</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select all areas where you have significant knowledge or experience
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {expertiseAreas.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={`expertise-${area}`}
                  checked={(data.expertise_areas || []).includes(area)}
                  onCheckedChange={(checked) => handleExpertiseChange(area, !!checked)}
                />
                <Label 
                  htmlFor={`expertise-${area}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingBackgroundStep;