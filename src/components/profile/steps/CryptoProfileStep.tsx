
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bitcoin, Wallet, TrendingUp, Coins, Zap, Trophy, Plus, ExternalLink, Trash2, User } from 'lucide-react';

interface CryptoProfileStepProps {
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

const CryptoProfileStep = ({ data, onUpdate }: CryptoProfileStepProps) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNFT, setNewNFT] = useState({
    name: '',
    collection: '',
    imageUrl: '',
    floorPrice: '',
    rarity: '',
    blockchain: 'Ethereum'
  });

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleAddNFT = () => {
    if (!newNFT.name || !newNFT.collection) return;

    const nft: NFT = {
      id: Date.now().toString(),
      ...newNFT
    };

    const updatedNfts = [...nfts, nft];
    setNfts(updatedNfts);
    
    // Update the form data with the new NFT collections
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
    setIsDialogOpen(false);
  };

  const handleRemoveNFT = (id: string) => {
    const updatedNfts = nfts.filter(nft => nft.id !== id);
    setNfts(updatedNfts);
    
    // Update the form data
    const collections = updatedNfts.map(nft => nft.collection).join(', ');
    onUpdate({ nft_collections: collections });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto mb-4">
          <Bitcoin className="w-8 h-8 text-white" />
        </div>
        <p className="text-muted-foreground">
          Show off your crypto credentials! This is where you flex your degen status and find your crypto tribe. 🚀
        </p>
      </div>

      {/* Crypto Basics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bitcoin className="w-5 h-5" />
          Crypto Basics
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crypto_experience">Crypto Experience *</Label>
            <Input
              id="crypto_experience"
              value={data.crypto_experience}
              onChange={(e) => handleInputChange('crypto_experience', e.target.value)}
              placeholder="Newbie, Veteran, OG, Degen, Satoshi himself"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="favorite_crypto">Favorite Crypto *</Label>
            <Input
              id="favorite_crypto"
              value={data.favorite_crypto}
              onChange={(e) => handleInputChange('favorite_crypto', e.target.value)}
              placeholder="BTC, ETH, SOL, DOGE, ADA..."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="portfolio_size">Portfolio Size</Label>
            <Input
              id="portfolio_size"
              value={data.portfolio_size}
              onChange={(e) => handleInputChange('portfolio_size', e.target.value)}
              placeholder="Shrimp, Crab, Fish, Dolphin, Whale 🐋"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trading_style" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trading Style
            </Label>
            <Input
              id="trading_style"
              value={data.trading_style}
              onChange={(e) => handleInputChange('trading_style', e.target.value)}
              placeholder="HODL, Day Trading, Swing Trading, Ape into everything"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wallet_address" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Main Wallet Address
          </Label>
          <Input
            id="wallet_address"
            value={data.wallet_address}
            onChange={(e) => handleInputChange('wallet_address', e.target.value)}
            placeholder="0x1234... (optional but shows you're legit)"
          />
          <p className="text-xs text-muted-foreground">
            Optional: This helps verify you're a real crypto user
          </p>
        </div>
      </div>

      {/* DeFi & Protocols */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5" />
          DeFi & Protocols
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="defi_protocols">DeFi Protocols</Label>
          <Input
            id="defi_protocols"
            value={data.defi_protocols}
            onChange={(e) => handleInputChange('defi_protocols', e.target.value)}
            placeholder="Uniswap, Compound, Aave, PancakeSwap, Curve"
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple protocols with commas
          </p>
        </div>

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
                    <img
                      src={nft.imageUrl}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{nft.name}</h4>
                  <p className="text-xs text-muted-foreground">{nft.collection}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {nft.blockchain}
                    </Badge>
                    {nft.rarity && (
                      <Badge variant="secondary" className="text-xs">
                        {nft.rarity}
                      </Badge>
                    )}
                  </div>
                  
                  {nft.floorPrice && (
                    <p className="text-xs font-medium text-green-600">
                      Floor: {nft.floorPrice}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => window.open(`https://opensea.io/collection/${nft.collection.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveNFT(nft.id)}
                  >
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                Add your favorite NFTs to show off to other degens
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

              <Button
                onClick={handleAddNFT}
                disabled={!newNFT.name || !newNFT.collection}
                className="w-full"
              >
                Add NFT
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          <Label htmlFor="meme_coin_holdings">Meme Coin Holdings</Label>
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
          <Label htmlFor="crypto_motto">Crypto Motto</Label>
          <Textarea
            id="crypto_motto"
            value={data.crypto_motto}
            onChange={(e) => handleInputChange('crypto_motto', e.target.value)}
            placeholder="Diamond hands forever, WAGMI, To the moon! 🚀, Have fun staying poor..."
            rows={2}
          />
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Degen Tips
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Be honest about your wins AND losses - we've all been rekt</li>
          <li>• Add your favorite NFTs to show your taste in digital art</li>
          <li>• Your wallet address helps prove you're not a bot</li>
          <li>• Sharing your losses shows you're battle-tested 💪</li>
        </ul>
      </div>
    </div>
  );
};

export default CryptoProfileStep;
