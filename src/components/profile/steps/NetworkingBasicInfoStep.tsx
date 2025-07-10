import { Building, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkingBasicInfoStepProps {
  data: any;
  onUpdate: (field: string, value: string) => void;
}

const industries = [
  'DeFi/Decentralized Finance',
  'NFTs/Digital Collectibles',
  'Blockchain Infrastructure',
  'Smart Contract Development',
  'Cryptocurrency Trading',
  'Web3 Gaming',
  'Metaverse/Virtual Reality',
  'DAO/Governance',
  'Crypto Investment/VC',
  'Blockchain Consulting',
  'Layer 2 Solutions',
  'Cross-chain/Interoperability',
  'Stablecoins',
  'RWA/Tokenization',
  'Web3 Security/Auditing',
  'Traditional Finance',
  'Technology/Software',
  'Marketing/Community',
  'Legal/Compliance',
  'Other'
];

const companyStages = [
  'Pre-seed Startup',
  'Seed Stage',
  'Series A',
  'Series B',
  'Series C+',
  'Public Company',
  'Independent/Freelancer',
  'Stealth Mode',
  'DAO/Protocol'
];

const roleLevels = [
  'Individual Contributor',
  'Senior IC',
  'Tech Lead',
  'Team Lead/Manager',
  'Senior Manager',
  'Director',
  'VP/SVP',
  'C-Level',
  'Founder',
  'Co-Founder'
];

const fundingFocus = [
  'Pre-seed/Seed Investment',
  'Series A/B Investment',
  'Growth Stage Investment',
  'DeFi Protocols',
  'Infrastructure Projects',
  'Consumer Web3 Apps',
  'Gaming/Metaverse',
  'Developer Tools',
  'Not Applicable'
];

const NetworkingBasicInfoStep = ({ data, onUpdate }: NetworkingBasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-12 h-12 text-white" />
        </div>
        <p className="text-muted-foreground">
          Tell us about your professional background in Web3
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title *</Label>
              <Input
                id="job_title"
                placeholder="e.g., Blockchain Developer, DeFi Analyst"
                value={data.job_title || ''}
                onChange={(e) => onUpdate('job_title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company/Organization</Label>
              <Input
                id="company_name"
                placeholder="e.g., Ethereum Foundation, Independent"
                value={data.company_name || ''}
                onChange={(e) => onUpdate('company_name', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={data.industry} onValueChange={(value) => onUpdate('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your primary industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role_level">Role Level *</Label>
              <Select value={data.role_level} onValueChange={(value) => onUpdate('role_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role level" />
                </SelectTrigger>
                <SelectContent>
                  {roleLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_stage">Company Stage</Label>
              <Select value={data.company_stage} onValueChange={(value) => onUpdate('company_stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company stage" />
                </SelectTrigger>
                <SelectContent>
                  {companyStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="years_in_crypto">Years in Crypto/Web3 *</Label>
              <Select value={data.years_in_crypto} onValueChange={(value) => onUpdate('years_in_crypto', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How long have you been in Web3?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Just getting started</SelectItem>
                  <SelectItem value="1">1 year</SelectItem>
                  <SelectItem value="2">2 years</SelectItem>
                  <SelectItem value="3">3 years</SelectItem>
                  <SelectItem value="4">4 years</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                  <SelectItem value="10">10+ years (OG)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funding_focus">Investment/Funding Focus</Label>
              <Select value={data.funding_focus} onValueChange={(value) => onUpdate('funding_focus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select if applicable" />
                </SelectTrigger>
                <SelectContent>
                  {fundingFocus.map((focus) => (
                    <SelectItem key={focus} value={focus}>
                      {focus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, Remote, NYC"
                value={data.location || ''}
                onChange={(e) => onUpdate('location', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                placeholder="e.g., PST, UTC+1, EST"
                value={data.timezone || ''}
                onChange={(e) => onUpdate('timezone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingBasicInfoStep;