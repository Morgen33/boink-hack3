
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ExternalLink, Trash2, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NFTShowcaseProps {
  user: SupabaseUser | null;
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

const NFTShowcase = ({ user }: NFTShowcaseProps) => {
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: '1',
      name: 'Bored Ape #1234',
      collection: 'Bored Ape Yacht Club',
      imageUrl: '/placeholder.svg',
      floorPrice: '25 ETH',
      rarity: 'Rare',
      blockchain: 'Ethereum'
    },
    {
      id: '2',
      name: 'CryptoPunk #5678',
      collection: 'CryptoPunks',
      imageUrl: '/placeholder.svg',
      floorPrice: '50 ETH',
      rarity: 'Ultra Rare',
      blockchain: 'Ethereum'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNFT, setNewNFT] = useState({
    name: '',
    collection: '',
    imageUrl: '',
    floorPrice: '',
    rarity: '',
    blockchain: 'Ethereum'
  });

  const handleAddNFT = () => {
    if (!newNFT.name || !newNFT.collection) return;

    const nft: NFT = {
      id: Date.now().toString(),
      ...newNFT
    };

    setNfts(prev => [...prev, nft]);
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
    setNfts(prev => prev.filter(nft => nft.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          NFT Showcase
        </CardTitle>
        <CardDescription>
          Show off your NFT collection to fellow degens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nfts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="text-center py-8 text-muted-foreground">
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
      </CardContent>
    </Card>
  );
};

export default NFTShowcase;
