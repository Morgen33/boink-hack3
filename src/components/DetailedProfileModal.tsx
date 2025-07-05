import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MapPin, User, Heart, Wallet, TrendingUp, Coins, Palette } from 'lucide-react';
import { ProfileCard as ProfileCardType } from '@/data/demoProfiles';
import ProfileActions from './ProfileActions';
import AIMatchInsights from './AIMatchInsights';

interface DetailedProfileModalProps {
  profile: ProfileCardType & {
    // Extended profile fields from database
    gender_identity?: string;
    sexual_orientation?: string;
    relationship_type?: string;
    looking_for_gender?: string[];
    wallet_address?: string;
    favorite_crypto?: string;
    crypto_experience?: string;
    portfolio_size?: string;
    trading_style?: string;
    defi_protocols?: string[];
    nft_collections?: string[];
    meme_coin_holdings?: string[];
    biggest_crypto_win?: string;
    biggest_crypto_loss?: string;
    crypto_motto?: string;
    degen_score?: number;
    username?: string;
    photo_urls?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

const DetailedProfileModal = ({ 
  profile, 
  isOpen, 
  onClose, 
  onLike, 
  onPass 
}: DetailedProfileModalProps) => {
  const handleLike = () => {
    onLike();
    onClose();
  };

  const handlePass = () => {
    onPass();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">Profile Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6">
            {/* Header with photos and basic info */}
            <div className="relative">
              {profile.photo_urls && profile.photo_urls.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {profile.photo_urls.map((photoUrl, index) => (
                    <div key={index} className="h-64 bg-gradient-to-br from-web3-red/10 to-web3-magenta/10 rounded-lg overflow-hidden">
                      <img
                        src={photoUrl}
                        alt={`${profile.full_name || 'Profile'} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-web3-red/10 to-web3-magenta/10 rounded-lg flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Profile'}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4">
                <h2 className="text-2xl font-bold text-white">
                  {profile.full_name || 'Anonymous'}
                  {profile.age && (
                    <span className="text-lg font-normal">, {profile.age}</span>
                  )}
                </h2>
                {profile.location && (
                  <p className="text-white/80 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* AI Match Insights */}
            <AIMatchInsights 
              targetUserId={profile.id}
              onStartConversation={() => {
                // Handle conversation start
                console.log('Starting conversation with', profile.full_name);
              }}
            />

            {/* Basic Info */}
            {profile.bio && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  About
                </h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            {/* Dating Preferences */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Dating Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.gender_identity && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender Identity</p>
                    <Badge variant="outline">{profile.gender_identity}</Badge>
                  </div>
                )}
                {profile.sexual_orientation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sexual Orientation</p>
                    <Badge variant="outline">{profile.sexual_orientation}</Badge>
                  </div>
                )}
                {profile.relationship_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship Type</p>
                    <Badge variant="outline">{profile.relationship_type}</Badge>
                  </div>
                )}
                {profile.looking_for_gender && profile.looking_for_gender.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Interested In</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.looking_for_gender.map((gender, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {gender}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.looking_for && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">What I'm Looking For</p>
                    <p className="text-sm mt-1">{profile.looking_for}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Crypto Profile */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Crypto Profile
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.favorite_crypto && (
                  <div>
                    <p className="text-sm text-muted-foreground">Favorite Crypto</p>
                    <Badge variant="secondary">{profile.favorite_crypto}</Badge>
                  </div>
                )}
                {profile.crypto_experience && (
                  <div>
                    <p className="text-sm text-muted-foreground">Experience Level</p>
                    <Badge variant="outline">{profile.crypto_experience}</Badge>
                  </div>
                )}
                {profile.portfolio_size && (
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Size</p>
                    <Badge variant="outline">{profile.portfolio_size}</Badge>
                  </div>
                )}
                {profile.trading_style && (
                  <div>
                    <p className="text-sm text-muted-foreground">Trading Style</p>
                    <Badge variant="outline">{profile.trading_style}</Badge>
                  </div>
                )}
                {profile.degen_score && (
                  <div>
                    <p className="text-sm text-muted-foreground">Degen Score</p>
                    <Badge variant="secondary">{profile.degen_score}/100</Badge>
                  </div>
                )}
              </div>

              {profile.crypto_motto && (
                <div>
                  <p className="text-sm text-muted-foreground">Crypto Motto</p>
                  <p className="italic text-sm mt-1">"{profile.crypto_motto}"</p>
                </div>
              )}
            </div>

            {/* DeFi & Protocols */}
            {profile.defi_protocols && profile.defi_protocols.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  DeFi Protocols
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.defi_protocols.map((protocol, index) => (
                    <Badge key={index} variant="outline">
                      {protocol}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* NFTs */}
            {profile.nft_collections && profile.nft_collections.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  NFT Collections
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.nft_collections.map((collection, index) => (
                    <Badge key={index} variant="outline">
                      {collection}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Meme Coins */}
            {profile.meme_coin_holdings && profile.meme_coin_holdings.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Meme Coin Holdings
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.meme_coin_holdings.map((coin, index) => (
                    <Badge key={index} variant="secondary">
                      {coin}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Crypto Wins/Losses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.biggest_crypto_win && (
                <div>
                  <p className="text-sm text-muted-foreground">Biggest Crypto Win</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {profile.biggest_crypto_win}
                  </p>
                </div>
              )}
              {profile.biggest_crypto_loss && (
                <div>
                  <p className="text-sm text-muted-foreground">Biggest Crypto Loss</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {profile.biggest_crypto_loss}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-4">
              <ProfileActions onLike={handleLike} onPass={handlePass} profile={profile} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedProfileModal;