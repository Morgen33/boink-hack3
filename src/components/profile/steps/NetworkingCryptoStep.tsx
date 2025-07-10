import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, Wallet, TrendingUp, Coins, Zap, Trophy, Plus, ExternalLink, Trash2, User, Copy, Check, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NetworkingCryptoStepProps {
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

const NetworkingCryptoStep = ({ data, onUpdate }: NetworkingCryptoStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [existingCryptoData, setExistingCryptoData] = useState<any>(null);
  const [showAutoPopulateCard, setShowAutoPopulateCard] = useState(false);
  const [isLoadingExistingData, setIsLoadingExistingData] = useState(true);
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

  // Load existing crypto data from user's profile
  useEffect(() => {
    const loadExistingCryptoData = async () => {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('crypto_experience, favorite_crypto, portfolio_size, trading_style, defi_protocols, nft_collections, biggest_crypto_win, biggest_crypto_loss, crypto_motto, meme_coin_holdings')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile && (
          profile.crypto_experience || 
          profile.favorite_crypto || 
          profile.defi_protocols?.length > 0 ||
          profile.nft_collections?.length > 0 ||
          profile.meme_coin_holdings?.length > 0
        )) {
          setExistingCryptoData(profile);
          setShowAutoPopulateCard(true);
        }
      } catch (error) {
        console.error('Error loading existing crypto data:', error);
      } finally {
        setIsLoadingExistingData(false);
      }
    };

    loadExistingCryptoData();
  }, [user]);

  const handleAutoPopulateData = () => {
    if (!existingCryptoData) return;

    // Copy all crypto fields with networking-specific adjustments
    const updates = {
      crypto_experience: existingCryptoData.crypto_experience,
      favorite_crypto: existingCryptoData.favorite_crypto,
      portfolio_size: existingCryptoData.portfolio_size,
      trading_style: existingCryptoData.trading_style,
      defi_protocols: existingCryptoData.defi_protocols,
      nft_collections: existingCryptoData.nft_collections,
      biggest_crypto_win: existingCryptoData.biggest_crypto_win,
      biggest_crypto_loss: existingCryptoData.biggest_crypto_loss,
      crypto_motto: existingCryptoData.crypto_motto,
      meme_coin_holdings: existingCryptoData.meme_coin_holdings,
    };

    onUpdate(updates);
    setShowAutoPopulateCard(false);

    toast({
      title: "Crypto data imported!",
      description: "Your existing crypto profile has been loaded. You can customize it for networking.",
    });
  };

  const handleAddNFT = () => {
    if (!newNFT.name || !newNFT.collection) return;

    const nft: NFT = {
      id: Date.now().toString(),
      ...newNFT
    };

    const updatedNfts = [...nfts, nft];
    setNfts(updatedNfts);
    
    const collections = updatedNfts.map(nft => nft.collection).join(', ');
    onUpdate({ nft_collections: collections });
    
    setNewNFT({
      name: '',
      collection: '',
      imageUrl: '',
      floorPrice: '',
      rarity: '',
      blockchain: 'Ethereum'
    });
    setIsNFTDialogOpen(false);
  };

  const handleAddMeme = () => {
    if (!newMeme.name || !newMeme.ticker) return;

    const meme: FavoriteMeme = {
      id: Date.now().toString(),
      ...newMeme
    };

    const updatedMemes = [...favoriteMemes, meme];
    setFavoriteMemes(updatedMemes);
    
    const memeList = updatedMemes.map(meme => `${meme.name} (${meme.ticker})`).join(', ');
    onUpdate({ favorite_memes: memeList });
    
    setNewMeme({
      name: '',
      ticker: '',
      imageUrl: '',
      chain: 'Ethereum',
      description: ''
    });
    setIsMemeDialogOpen(false);
  };

  const cryptoExperienceOptions = [
    { value: 'newbie', label: 'Crypto Newbie (< 6 months)' },
    { value: 'beginner', label: 'Beginner (6 months - 1 year)' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)' },
    { value: 'experienced', label: 'Experienced (3-5 years)' },
    { value: 'veteran', label: 'Veteran (5+ years)' },
    { value: 'og', label: 'OG (Since 2017 or earlier)' }
  ];

  const favoriteCryptoOptions = [
    'Bitcoin (BTC)',
    'Ethereum (ETH)', 
    'Solana (SOL)',
    'Cardano (ADA)',
    'Polygon (MATIC)',
    'Chainlink (LINK)',
    'Avalanche (AVAX)',
    'Polkadot (DOT)',
    'Other'
  ];

  const portfolioSizeOptions = [
    'Small ($1k - $10k)', 
    'Medium ($10k - $100k)',
    'Large ($100k - $1M)',
    'Institutional ($1M+)',
    'Prefer not to say'
  ];

  const tradingStyleOptions = [
    'Long-term Investor',
    'DCA Strategy',
    'Swing Trading',
    'Research-driven',
    'Portfolio Management',
    'Institutional Approach'
  ];

  const defiProtocolOptions = [
    'Uniswap', 'Compound', 'Aave', 'MakerDAO', 'Curve', 'SushiSwap',
    'Balancer', 'Yearn Finance', 'Lido', 'Rocket Pool'
  ];

  if (isLoadingExistingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-12 h-12 text-white" />
        </div>
        <p className="text-muted-foreground">
          Share your crypto credentials with potential business partners and collaborators
        </p>
      </div>

      {/* Auto-populate existing data card */}
      {showAutoPopulateCard && existingCryptoData && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Use Existing Crypto Profile?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We found crypto information in your dating profile. Would you like to import it for your professional networking profile? You can customize it afterward.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleAutoPopulateData} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Use Existing Data
              </Button>
              <Button variant="outline" onClick={() => setShowAutoPopulateCard(false)}>
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Crypto Profile */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bitcoin className="w-5 h-5" />
          Professional Crypto Background
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crypto_experience">Crypto Experience *</Label>
            <Select value={data.crypto_experience} onValueChange={(value) => onUpdate({ crypto_experience: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {cryptoExperienceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="favorite_crypto">Primary Focus Crypto</Label>
            <Select value={data.favorite_crypto} onValueChange={(value) => onUpdate({ favorite_crypto: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary crypto focus" />
              </SelectTrigger>
              <SelectContent>
                {favoriteCryptoOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="portfolio_size">Investment Scale</Label>
            <Select value={data.portfolio_size} onValueChange={(value) => onUpdate({ portfolio_size: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select investment scale" />
              </SelectTrigger>
              <SelectContent>
                {portfolioSizeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trading_style">Investment Approach</Label>
            <Select value={data.trading_style} onValueChange={(value) => onUpdate({ trading_style: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select investment approach" />
              </SelectTrigger>
              <SelectContent>
                {tradingStyleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* DeFi & Protocol Experience */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          DeFi & Protocol Experience
        </h3>
        
        <div className="space-y-3">
          <Label>DeFi Protocols (Select your experience)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {defiProtocolOptions.map((protocol) => (
              <div key={protocol} className="flex items-center space-x-2">
                <Checkbox
                  id={protocol}
                  checked={(data.defi_protocols || []).includes(protocol)}
                  onCheckedChange={(checked) => {
                    const currentProtocols = data.defi_protocols || [];
                    if (checked) {
                      onUpdate({ defi_protocols: [...currentProtocols, protocol] });
                    } else {
                      onUpdate({ defi_protocols: currentProtocols.filter((p: string) => p !== protocol) });
                    }
                  }}
                />
                <Label htmlFor={protocol} className="text-sm">
                  {protocol}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Favorite Memes Showcase */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Favorite Memes & Culture
        </h3>
        
        {favoriteMemes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {favoriteMemes.map((meme) => (
              <div key={meme.id} className="border rounded-lg p-4 space-y-3">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {meme.imageUrl ? (
                    <img
                      src={meme.imageUrl}
                      alt={meme.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Coins className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{meme.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">${meme.ticker}</p>
                  
                  <Badge variant="outline" className="text-xs">
                    {meme.chain}
                  </Badge>
                  
                  {meme.description && (
                    <p className="text-xs text-muted-foreground">{meme.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-lg mb-4">
            <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No favorite memes added yet</p>
            <p className="text-sm">Show your meme culture!</p>
          </div>
        )}

        <Dialog open={isMemeDialogOpen} onOpenChange={setIsMemeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Favorite Meme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Favorite Meme</DialogTitle>
              <DialogDescription>
                Share your favorite meme coins and crypto culture
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
                <Label htmlFor="meme-description">Why you love it (Optional)</Label>
                <Textarea
                  id="meme-description"
                  value={newMeme.description}
                  onChange={(e) => setNewMeme(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Much wow, to the moon..."
                  rows={2}
                />
              </div>

              <Button
                onClick={handleAddMeme}
                disabled={!newMeme.name || !newMeme.ticker}
                className="w-full"
              >
                Add Meme
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Professional Crypto Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Achievements</h3>
        
        <div className="space-y-2">
          <Label htmlFor="crypto_motto">Investment Philosophy</Label>
          <Textarea
            id="crypto_motto"
            value={data.crypto_motto}
            onChange={(e) => onUpdate({ crypto_motto: e.target.value })}
            placeholder="Your approach to crypto investing and building..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default NetworkingCryptoStep;