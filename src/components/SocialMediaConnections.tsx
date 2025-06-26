
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Music, 
  Plus, 
  ExternalLink, 
  Trash2,
  Shield,
  Loader2
} from 'lucide-react';
import { useSocialMediaConnections } from '@/hooks/useSocialMediaConnections';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';

interface SocialMediaConnectionsProps {
  user: User | null;
}

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music,
};

const platformColors = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  twitter: 'bg-blue-500',
  facebook: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-black',
};

const platformNames = {
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
};

const SocialMediaConnections = ({ user }: SocialMediaConnectionsProps) => {
  const { signInWithTwitter } = useAuth();
  const { connections, loading, addConnection, removeConnection } = useSocialMediaConnections(user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);

  const handleAddConnection = async () => {
    if (!selectedPlatform || !username.trim()) return;

    setIsSubmitting(true);
    const success = await addConnection(selectedPlatform, username.trim(), profileUrl.trim() || undefined);
    
    if (success) {
      setIsDialogOpen(false);
      setSelectedPlatform('');
      setUsername('');
      setProfileUrl('');
    }
    setIsSubmitting(false);
  };

  const handleTwitterOAuth = async () => {
    setIsConnectingTwitter(true);
    try {
      await signInWithTwitter();
    } catch (error) {
      console.error('Error connecting Twitter:', error);
      setIsConnectingTwitter(false);
    }
  };

  const getConnectedPlatforms = () => {
    return connections.map(conn => conn.platform);
  };

  const getAvailablePlatforms = () => {
    const connected = getConnectedPlatforms();
    return Object.keys(platformNames).filter(platform => !connected.includes(platform));
  };

  const isTwitterConnected = getConnectedPlatforms().includes('twitter');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Social Media Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Social Media Verification
        </CardTitle>
        <CardDescription>
          Connect your social media accounts for identity verification and KYC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Twitter OAuth Connection Button */}
        {!isTwitterConnected && (
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Connect Twitter</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect your Twitter account with OAuth for instant verification
                  </p>
                </div>
              </div>
              <Button
                onClick={handleTwitterOAuth}
                disabled={isConnectingTwitter}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isConnectingTwitter ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        )}

        {connections.length > 0 && (
          <div className="space-y-3">
            {connections.map((connection) => {
              const Icon = platformIcons[connection.platform as keyof typeof platformIcons];
              const platformName = platformNames[connection.platform as keyof typeof platformNames];
              const colorClass = platformColors[connection.platform as keyof typeof platformColors];
              
              return (
                <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{platformName}</span>
                        {connection.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {connection.oauth_provider && (
                          <Badge variant="default" className="text-xs bg-green-500">
                            OAuth
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{connection.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connection.profile_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(connection.profile_url!, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConnection(connection.id, platformName)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {getAvailablePlatforms().filter(platform => platform !== 'twitter').length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Manual Connection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Social Media Account</DialogTitle>
                <DialogDescription>
                  Manually add your social media account information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {getAvailablePlatforms().filter(platform => platform !== 'twitter').map((platform) => {
                      const Icon = platformIcons[platform as keyof typeof platformIcons];
                      const platformName = platformNames[platform as keyof typeof platformNames];
                      const colorClass = platformColors[platform as keyof typeof platformColors];
                      
                      return (
                        <Button
                          key={platform}
                          variant={selectedPlatform === platform ? "default" : "outline"}
                          onClick={() => setSelectedPlatform(platform)}
                          className="justify-start"
                        >
                          <div className={`p-1 rounded-full ${colorClass} mr-2`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          {platformName}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {selectedPlatform && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username (without @)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileUrl">Profile URL (Optional)</Label>
                      <Input
                        id="profileUrl"
                        value={profileUrl}
                        onChange={(e) => setProfileUrl(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <Button
                      onClick={handleAddConnection}
                      disabled={!username.trim() || isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Account'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {connections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No social media accounts connected yet</p>
            <p className="text-sm">Connect your accounts to verify your identity</p>
          </div>
        )}

        {connections.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Verification Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">
                  {connections.length} account{connections.length !== 1 ? 's' : ''} connected
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SocialMediaConnections;
