
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Heart, Bitcoin, CheckCircle, Edit, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ReviewStepProps {
  data: any;
  onUpdate: (updates: any) => void;
  onComplete: () => Promise<void>;
}

const ReviewStep = ({ data, onComplete }: ReviewStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold">Almost There! 🎉</h2>
        <p className="text-muted-foreground">
          Review your profile and make any final changes before going live.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Info Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{data.full_name}</h3>
                <p className="text-muted-foreground">@{data.username}</p>
                <p className="text-sm text-muted-foreground">
                  {data.age} years old • {data.location || 'Location not set'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About You Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              About You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.bio && (
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{data.bio}</p>
              </div>
            )}
            
            {data.interests && (
              <div>
                <h4 className="font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {data.interests.split(',').map((interest: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {interest.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.looking_for && (
              <div>
                <h4 className="font-medium mb-2">Looking For</h4>
                <p className="text-sm text-muted-foreground">{data.looking_for}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dating Preferences Review */}
        <Card>
          <CardHeader>
            <CardTitle>Dating Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {data.gender_identity && (
                <div>
                  <span className="font-medium">Gender Identity:</span>
                  <p className="text-muted-foreground">{data.gender_identity}</p>
                </div>
              )}
              {data.sexual_orientation && (
                <div>
                  <span className="font-medium">Orientation:</span>
                  <p className="text-muted-foreground">{data.sexual_orientation}</p>
                </div>
              )}
              {data.relationship_type && (
                <div>
                  <span className="font-medium">Relationship Type:</span>
                  <p className="text-muted-foreground">{data.relationship_type}</p>
                </div>
              )}
              {data.looking_for_gender && data.looking_for_gender.length > 0 && (
                <div>
                  <span className="font-medium">Looking For:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.looking_for_gender.map((gender: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {gender}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crypto Profile Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bitcoin className="w-5 h-5" />
              Crypto Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {data.crypto_experience && (
                <div>
                  <span className="font-medium">Experience:</span>
                  <p className="text-muted-foreground">{data.crypto_experience}</p>
                </div>
              )}
              {data.favorite_crypto && (
                <div>
                  <span className="font-medium">Favorite Crypto:</span>
                  <p className="text-muted-foreground">{data.favorite_crypto}</p>
                </div>
              )}
              {data.portfolio_size && (
                <div>
                  <span className="font-medium">Portfolio Size:</span>
                  <p className="text-muted-foreground">{data.portfolio_size}</p>
                </div>
              )}
              {data.trading_style && (
                <div>
                  <span className="font-medium">Trading Style:</span>
                  <p className="text-muted-foreground">{data.trading_style}</p>
                </div>
              )}
            </div>

            {data.crypto_motto && (
              <div>
                <span className="font-medium">Crypto Motto:</span>
                <p className="text-sm text-muted-foreground italic">"{data.crypto_motto}"</p>
              </div>
            )}

            {data.nft_collections && (
              <div>
                <span className="font-medium">NFT Collections:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.nft_collections.split(',').map((collection: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {collection.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-6">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full md:w-auto bg-gradient-to-r from-web3-red to-web3-magenta hover:opacity-90 text-lg py-6 px-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Your Profile...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Profile & Go Live! 🚀
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-3">
          By completing your profile, you agree to our terms and conditions.
          You can always edit your profile later.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
