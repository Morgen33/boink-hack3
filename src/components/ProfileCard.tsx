
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, User } from 'lucide-react';
import { ProfileCard as ProfileCardType } from '@/data/demoProfiles';
import ProfileActions from './ProfileActions';

interface ProfileCardProps {
  profile: ProfileCardType;
  onLike: () => void;
  onPass: () => void;
  onClick?: () => void;
}

const ProfileCard = ({ profile, onLike, onPass, onClick }: ProfileCardProps) => {
  return (
    <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {profile.isDemo && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            Demo Profile
          </Badge>
        </div>
      )}
      
      <div className="relative">
        <div className="h-96 bg-gradient-to-br from-web3-red/10 to-web3-magenta/10 flex items-center justify-center">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-24 h-24 text-muted-foreground" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
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

      <CardContent className="p-6">
        {profile.bio && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {profile.looking_for && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Looking for</h3>
            <p className="text-muted-foreground">{profile.looking_for}</p>
          </div>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-6">
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

        <ProfileActions onLike={onLike} onPass={onPass} />
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
