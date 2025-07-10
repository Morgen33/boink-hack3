import { Brain, Target } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  'Tokenomics Design',
  'NFT Development',
  'DAO Governance',
  'Web3 Security/Auditing',
  'MEV/Trading Strategies',
  'Layer 2 Solutions',
  'Cross-chain/Bridges',
  'Stablecoin Design',
  'RWA Tokenization',
  'Crypto Investment/VC',
  'Community Building',
  'Product Management',
  'Marketing & Growth',
  'Developer Relations',
  'Technical Writing',
  'Legal & Compliance',
  'Business Development'
];

const blockchainExperience = [
  'Ethereum',
  'Solana',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Base',
  'Avalanche',
  'BNB Chain',
  'Cosmos',
  'Polkadot',
  'Near',
  'Sui',
  'Aptos',
  'Bitcoin'
];

const protocolExperience = [
  'Uniswap',
  'Aave',
  'Compound',
  'MakerDAO',
  'Curve',
  'Balancer',
  'SushiSwap',
  'OpenSea',
  'Blur',
  'Lido',
  'Rocket Pool',
  'Chainlink',
  'The Graph',
  'Arweave'
];

const developmentStack = [
  'Solidity',
  'Rust',
  'TypeScript/JavaScript',
  'Python',
  'Go',
  'Move',
  'Cairo',
  'React/Next.js',
  'Node.js',
  'Hardhat/Foundry',
  'Web3.js/Ethers.js',
  'Subgraph/GraphQL'
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

  const handleBlockchainChange = (blockchain: string, checked: boolean) => {
    const currentBlockchains = data.blockchain_experience || [];
    if (checked) {
      onUpdate('blockchain_experience', [...currentBlockchains, blockchain]);
    } else {
      onUpdate('blockchain_experience', currentBlockchains.filter((b: string) => b !== blockchain));
    }
  };

  const handleProtocolChange = (protocol: string, checked: boolean) => {
    const currentProtocols = data.protocol_experience || [];
    if (checked) {
      onUpdate('protocol_experience', [...currentProtocols, protocol]);
    } else {
      onUpdate('protocol_experience', currentProtocols.filter((p: string) => p !== protocol));
    }
  };

  const handleStackChange = (stack: string, checked: boolean) => {
    const currentStack = data.development_stack || [];
    if (checked) {
      onUpdate('development_stack', [...currentStack, stack]);
    } else {
      onUpdate('development_stack', currentStack.filter((s: string) => s !== stack));
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

      <Card>
        <CardHeader>
          <CardTitle>Blockchain Experience</CardTitle>
          <p className="text-sm text-muted-foreground">
            Which blockchains have you worked with or built on?
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {blockchainExperience.map((blockchain) => (
              <div key={blockchain} className="flex items-center space-x-2">
                <Checkbox
                  id={`blockchain-${blockchain}`}
                  checked={(data.blockchain_experience || []).includes(blockchain)}
                  onCheckedChange={(checked) => handleBlockchainChange(blockchain, !!checked)}
                />
                <Label 
                  htmlFor={`blockchain-${blockchain}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {blockchain}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protocol Experience</CardTitle>
          <p className="text-sm text-muted-foreground">
            Notable protocols or projects you've worked with or contributed to
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {protocolExperience.map((protocol) => (
              <div key={protocol} className="flex items-center space-x-2">
                <Checkbox
                  id={`protocol-${protocol}`}
                  checked={(data.protocol_experience || []).includes(protocol)}
                  onCheckedChange={(checked) => handleProtocolChange(protocol, !!checked)}
                />
                <Label 
                  htmlFor={`protocol-${protocol}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {protocol}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Stack</CardTitle>
          <p className="text-sm text-muted-foreground">
            Programming languages and tools you're proficient with
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {developmentStack.map((stack) => (
              <div key={stack} className="flex items-center space-x-2">
                <Checkbox
                  id={`stack-${stack}`}
                  checked={(data.development_stack || []).includes(stack)}
                  onCheckedChange={(checked) => handleStackChange(stack, !!checked)}
                />
                <Label 
                  htmlFor={`stack-${stack}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {stack}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notable Projects & Work</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share links to your public work, projects, or contributions (optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Profile</Label>
            <Input
              id="github_url"
              placeholder="https://github.com/yourusername"
              value={data.github_url || ''}
              onChange={(e) => onUpdate('github_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio/Personal Website</Label>
            <Input
              id="portfolio_url"
              placeholder="https://yourportfolio.com"
              value={data.portfolio_url || ''}
              onChange={(e) => onUpdate('portfolio_url', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notable_projects">Notable Projects/Contributions</Label>
            <Textarea
              id="notable_projects"
              placeholder="Briefly describe key projects, protocols you've contributed to, or notable achievements..."
              value={data.notable_projects || ''}
              onChange={(e) => onUpdate('notable_projects', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkingBackgroundStep;