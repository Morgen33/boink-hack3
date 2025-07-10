import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bitcoin, Wallet, TrendingUp, Coins, Zap, Trophy, Plus, ExternalLink, Trash2, User, Briefcase } from 'lucide-react';

interface UnifiedCryptoStepProps {
  data: any;
  onUpdate: (updates: any) => void;
}

interface NFT {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  floorPrice?: string;
  rarity?: string;
  blockchain: string;
}

interface FavoriteMeme {
  id: string;
  name: string;
  ticker: string;
  imageUrl: string;
  chain: string;
  description: string;
}

const UnifiedCryptoStep = ({ data, onUpdate }: UnifiedCryptoStepProps) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [favoriteMemes, setFavoriteMemes] = useState<FavoriteMeme[]>([]);
  const [isNFTDialogOpen, setIsNFTDialogOpen] = useState(false);
  const [isMemeDialogOpen, setIsMemeDialogOpen] = useState(false);
  const [newNFT, setNewNFT] = useState({
    name: '',
    collection: '',
    imageUrl: '',
    floorPrice: '',
    rarity: '',
    blockchain: 'Ethereum'
  });
  const [newMeme, setNewMeme] = useState({
    name: '',
    ticker: '',
    imageUrl: '',
    chain: 'Ethereum',
    description: ''
  });

  const isDating = data.platform_intent === 'dating';
  const isNetworking = data.platform_intent === 'networking';
  const isBoth = data.platform_intent === 'both';

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleDeFiProtocolChange = (protocol: string, checked: boolean) => {
    const currentProtocols = data.defi_protocols || [];
    let updatedProtocols;
    if (checked) {
      updatedProtocols = [...currentProtocols, protocol];
    } else {
      updatedProtocols = currentProtocols.filter((p: string) => p !== protocol);
    }
    onUpdate({ defi_protocols: updatedProtocols });
  };

  const handleAddNFT = () => {
    if (!newNFT.name || !newNFT.collection) return;
    const nft: NFT = { id: Date.now().toString(), ...newNFT };
    const updatedNfts = [...nfts, nft];
    setNfts(updatedNfts);
    const collections = updatedNfts.map(nft => nft.collection).join(', ');
    onUpdate({ nft_collections: collections });
    setNewNFT({ name: '', collection: '', imageUrl: '', floorPrice: '', rarity: '', blockchain: 'Ethereum' });
    setIsNFTDialogOpen(false);
  };

  const handleAddMeme = () => {
    if (!newMeme.name || !newMeme.ticker) return;
    const meme: FavoriteMeme = { id: Date.now().toString(), ...newMeme };
    const updatedMemes = [...favoriteMemes, meme];
    setFavoriteMemes(updatedMemes);
    onUpdate({ favorite_memes: updatedMemes });
    setNewMeme({ name: '', ticker: '', imageUrl: '', chain: 'Ethereum', description: '' });
    setIsMemeDialogOpen(false);
  };

  const handleRemoveNFT = (id: string) => {
    const updatedNfts = nfts.filter(nft => nft.id !== id);
    setNfts(updatedNfts);
    const collections = updatedNfts.map(nft => nft.collection).join(', ');
    onUpdate({ nft_collections: collections });
  };

  const handleRemoveMeme = (id: string) => {
    const updatedMemes = favoriteMemes.filter(meme => meme.id !== id);
    setFavoriteMemes(updatedMemes);
    onUpdate({ favorite_memes: updatedMemes });
  };

  // Adaptive options based on platform intent
  const getCryptoExperienceOptions = () => {
    if (isDating || isBoth) {
      return [
        { value: 'newbie', label: 'Crypto Newbie (< 6 months)' },
        { value: 'beginner', label: 'Beginner (6 months - 1 year)' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)' },
        { value: 'experienced', label: 'Experienced (3-5 years)' },
        { value: 'veteran', label: 'Veteran (5+ years)' },
        { value: 'og', label: 'OG (Since 2017 or earlier)' },
        { value: 'degen', label: 'Full Degen (YOLO everything)' }
      ];
    } else {
      return [
        { value: 'newbie', label: 'Crypto Newbie (< 6 months)' },
        { value: 'beginner', label: 'Beginner (6 months - 1 year)' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)' },
        { value: 'experienced', label: 'Experienced (3-5 years)' },
        { value: 'veteran', label: 'Veteran (5+ years)' },
        { value: 'og', label: 'OG (Since 2017 or earlier)' }
      ];
    }
  };

  const getPortfolioSizeOptions = () => {
    if (isDating || isBoth) {
      return [
        'Shrimp (< $1k)',
        'Crab ($1k - $10k)', 
        'Fish ($10k - $50k)',
        'Dolphin ($50k - $500k)',
        'Shark ($500k - $1M)',
        'Whale ($1M+) 🐋',
        'Prefer not to say'
      ];
    } else {
      return [
        'Small ($1k - $10k)', 
        'Medium ($10k - $100k)',
        'Large ($100k - $1M)',
        'Institutional ($1M+)',
        'Prefer not to say'
      ];
    }
  };

  const getTradingStyleOptions = () => {
    if (isDating || isBoth) {
      return [
        'HODL only',
        'DCA (Dollar Cost Average)',
        'Swing Trading',
        'Day Trading', 
        'Scalping',
        'Copy Trading',
        'Ape into everything',
        'Research first, then invest'
      ];
    } else {
      return [
        'Long-term Investor',
        'DCA Strategy',
        'Swing Trading',
        'Research-driven',
        'Portfolio Management',
        'Institutional Approach'
      ];
    }
  };

  const getHeaderContent = () => {
    if (isDating) {
      return {
        icon: <Bitcoin className="w-8 h-8 text-white" />,
        gradient: "from-web3-red to-web3-magenta",
        title: "Crypto Credentials 🚀",
        subtitle: "Show off your crypto credentials! This is where you flex your degen status and find your crypto tribe."
      };
    } else if (isNetworking) {
      return {
        icon: <Briefcase className="w-8 h-8 text-white" />,
        gradient: "from-blue-500 to-purple-500",
        title: "Professional Crypto Background",
        subtitle: "Share your crypto credentials with potential business partners and collaborators"
      };
    } else {
      return {
        icon: <Bitcoin className="w-8 h-8 text-white" />,
        gradient: "from-web3-red to-web3-magenta",
        title: "Crypto Profile",
        subtitle: "Show your crypto expertise for both dating and professional connections"
      };
    }
  };

  const header = getHeaderContent();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${header.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {header.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{header.title}</h3>
        <p className="text-muted-foreground">{header.subtitle}</p>
      </div>

      {/* Crypto Basics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bitcoin className="w-5 h-5" />
          {isNetworking ? 'Professional Crypto Background' : 'Crypto Basics'}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crypto_experience">Crypto Experience *</Label>
            <Select value={data.crypto_experience} onValueChange={(value) => handleInputChange('crypto_experience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {getCryptoExperienceOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="favorite_crypto">{isNetworking ? 'Primary Focus Crypto' : 'Favorite Crypto'} *</Label>
            <Select value={data.favorite_crypto} onValueChange={(value) => handleInputChange('favorite_crypto', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isNetworking ? "Select primary crypto focus" : "Select your favorite crypto"} />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)', 'Cardano (ADA)',
                  'Polygon (MATIC)', 'Chainlink (LINK)', 'Avalanche (AVAX)', 'Polkadot (DOT)', 'Other'
                ].map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="portfolio_size">{isNetworking ? 'Investment Scale' : 'Portfolio Size'}</Label>
            <Select value={data.portfolio_size} onValueChange={(value) => handleInputChange('portfolio_size', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isNetworking ? "Select investment scale" : "Select portfolio size"} />
              </SelectTrigger>
              <SelectContent>
                {getPortfolioSizeOptions().map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trading_style" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isNetworking ? 'Investment Approach' : 'Trading Style'}
            </Label>
            <Select value={data.trading_style} onValueChange={(value) => handleInputChange('trading_style', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isNetworking ? "Select investment approach" : "Select trading style"} />
              </SelectTrigger>
              <SelectContent>
                {getTradingStyleOptions().map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* DeFi & Protocols */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {isNetworking ? 'DeFi & Protocol Experience' : 'DeFi & Protocols'}
        </h3>
        
        <div className="space-y-3">
          <Label>{isNetworking ? 'DeFi Protocols (Select your experience)' : 'DeFi Protocols (Select all that apply)'}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Uniswap', 'Compound', 'Aave', 'MakerDAO', 'Curve', 'SushiSwap',
              'PancakeSwap', 'Balancer', 'Yearn Finance', 'Synthetix', 'Lido', 'Rocket Pool'
            ].map((protocol) => (
              <div key={protocol} className="flex items-center space-x-2">
                <Checkbox
                  id={protocol}
                  checked={(data.defi_protocols || []).includes(protocol)}
                  onCheckedChange={(checked) => handleDeFiProtocolChange(protocol, checked as boolean)}
                />
                <Label htmlFor={protocol} className="text-sm">{protocol}</Label>
              </div>
            ))}
          </div>
        </div>

        {(isDating || isBoth) && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="biggest_crypto_win" className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-500" />
                Biggest Crypto Win
              </Label>
              <Input
                id="biggest_crypto_win"
                value={data.biggest_crypto_win}
                onChange={(e) => handleInputChange('biggest_crypto_win', e.target.value)}
                placeholder="Got in ETH at $200, 100x on SHIB..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="biggest_crypto_loss" className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-red-500" />
                Biggest Crypto Loss
              </Label>
              <Input
                id="biggest_crypto_loss"
                value={data.biggest_crypto_loss}
                onChange={(e) => handleInputChange('biggest_crypto_loss', e.target.value)}
                placeholder="LUNA collapse, bought ICP at $700..."
              />
            </div>
          </div>
        )}
      </div>

      {/* NFTs & Collections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          NFT Showcase
        </h3>
        
        {nfts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {nfts.map((nft) => (
              <div key={nft.id} className="border rounded-lg p-4 space-y-3">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {nft.imageUrl ? (
                    <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{nft.name}</h4>
                  <p className="text-xs text-muted-foreground">{nft.collection}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">{nft.blockchain}</Badge>
                    {nft.rarity && (
                      <Badge variant="secondary" className="text-xs">{nft.rarity}</Badge>
                    )}
                  </div>
                  
                  {nft.floorPrice && (
                    <p className="text-xs font-medium text-green-600">Floor: {nft.floorPrice}</p>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => window.open(`https://opensea.io/collection/${nft.collection.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600" onClick={() => handleRemoveNFT(nft.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg mb-4">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No NFTs added yet</p>
            <p className="text-sm">Show off your digital art collection!</p>
          </div>
        )}

        <Dialog open={isNFTDialogOpen} onOpenChange={setIsNFTDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add NFT
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add NFT to Showcase</DialogTitle>
              <DialogDescription>
                Add your favorite NFTs to show off to other {isDating ? 'degens' : 'professionals'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nft-name">NFT Name</Label>
                <Input
                  id="nft-name"
                  value={newNFT.name}
                  onChange={(e) => setNewNFT(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Bored Ape #1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nft-collection">Collection</Label>
                <Input
                  id="nft-collection"
                  value={newNFT.collection}
                  onChange={(e) => setNewNFT(prev => ({ ...prev, collection: e.target.value }))}
                  placeholder="Bored Ape Yacht Club"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nft-image">Image URL (Optional)</Label>
                <Input
                  id="nft-image"
                  value={newNFT.imageUrl}
                  onChange={(e) => setNewNFT(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nft-floor">Floor Price (Optional)</Label>
                  <Input
                    id="nft-floor"
                    value={newNFT.floorPrice}
                    onChange={(e) => setNewNFT(prev => ({ ...prev, floorPrice: e.target.value }))}
                    placeholder="25 ETH"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nft-rarity">Rarity (Optional)</Label>
                  <Input
                    id="nft-rarity"
                    value={newNFT.rarity}
                    onChange={(e) => setNewNFT(prev => ({ ...prev, rarity: e.target.value }))}
                    placeholder="Rare, Ultra Rare"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nft-blockchain">Blockchain</Label>
                <Input
                  id="nft-blockchain"
                  value={newNFT.blockchain}
                  onChange={(e) => setNewNFT(prev => ({ ...prev, blockchain: e.target.value }))}
                  placeholder="Ethereum, Solana, Polygon"
                />
              </div>
              <Button onClick={handleAddNFT} disabled={!newNFT.name || !newNFT.collection} className="w-full">
                Add NFT
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meme Portfolio */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          {isDating ? 'Meme Portfolio 🚀' : 'Favorite Memes & Culture'}
        </h3>
        
        {favoriteMemes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {favoriteMemes.map((meme) => (
              <div key={meme.id} className="border rounded-lg p-4 space-y-3">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {meme.imageUrl ? (
                    <img src={meme.imageUrl} alt={meme.name} className="w-full h-full object-cover" />
                  ) : (
                    <Coins className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{meme.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">${meme.ticker}</p>
                  <Badge variant="outline" className="text-xs">{meme.chain}</Badge>
                  {meme.description && (
                    <p className="text-xs text-muted-foreground">{meme.description}</p>
                  )}
                </div>

                <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600 w-full" onClick={() => handleRemoveMeme(meme.id)}>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg mb-4">
            <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No favorite memes added yet</p>
            <p className="text-sm">{isDating ? 'Show your meme game!' : 'Show your meme culture!'}</p>
          </div>
        )}

        <Dialog open={isMemeDialogOpen} onOpenChange={setIsMemeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {isDating ? 'Add Meme to Portfolio' : 'Add Favorite Meme'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isDating ? 'Add Meme to Portfolio' : 'Add Favorite Meme'}</DialogTitle>
              <DialogDescription>
                {isDating ? 'Show off your meme coin investments!' : 'Share your favorite meme coins and crypto culture'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meme-name">Meme Name</Label>
                  <Input
                    id="meme-name"
                    value={newMeme.name}
                    onChange={(e) => setNewMeme(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Dogecoin, Pepe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meme-ticker">Ticker</Label>
                  <Input
                    id="meme-ticker"
                    value={newMeme.ticker}
                    onChange={(e) => setNewMeme(prev => ({ ...prev, ticker: e.target.value }))}
                    placeholder="DOGE, PEPE"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meme-image">Image URL (Optional)</Label>
                <Input
                  id="meme-image"
                  value={newMeme.imageUrl}
                  onChange={(e) => setNewMeme(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meme-chain">Blockchain</Label>
                <Select value={newMeme.chain} onValueChange={(value) => setNewMeme(prev => ({ ...prev, chain: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="BSC">BSC</SelectItem>
                    <SelectItem value="Base">Base</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meme-description">{isDating ? 'Why you love it (Optional)' : 'Professional relevance (Optional)'}</Label>
                <Textarea
                  id="meme-description"
                  value={newMeme.description}
                  onChange={(e) => setNewMeme(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isDating ? "Best meme coin ever, to the moon! 🚀" : "Strategic investment in meme economy"}
                  rows={2}
                />
              </div>
              <Button onClick={handleAddMeme} disabled={!newMeme.name || !newMeme.ticker} className="w-full">
                Add Meme
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          <Label htmlFor="meme_coin_holdings">Meme Coin Holdings (Text List)</Label>
          <Input
            id="meme_coin_holdings"
            value={data.meme_coin_holdings}
            onChange={(e) => handleInputChange('meme_coin_holdings', e.target.value)}
            placeholder="DOGE, SHIB, PEPE, WIF, BONK, FLOKI"
          />
        </div>
      </div>

      {/* Crypto Identity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Crypto Identity</h3>
        
        <div className="space-y-2">
          <Label htmlFor="crypto_motto">{isDating ? 'Crypto Motto' : 'Investment Philosophy'}</Label>
          <Textarea
            id="crypto_motto"
            value={data.crypto_motto}
            onChange={(e) => handleInputChange('crypto_motto', e.target.value)}
            placeholder={isDating ? "HODL, Diamond hands, To the moon! 🚀" : "Strategic long-term investment in blockchain technology"}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default UnifiedCryptoStep;