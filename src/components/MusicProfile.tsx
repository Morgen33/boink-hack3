
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Play, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSpotifyIntegration } from '@/hooks/useSpotifyIntegration';
import { User } from '@supabase/supabase-js';

interface MusicProfileProps {
  user: User | null;
}

interface MusicData {
  top_tracks: any[];
  top_artists: any[];
  currently_playing: any;
  music_genres: string[];
  listening_stats: any;
}

const MusicProfile = ({ user }: MusicProfileProps) => {
  const [musicData, setMusicData] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshSpotifyData, isRefreshing } = useSpotifyIntegration(user);

  useEffect(() => {
    if (user) {
      fetchMusicData();
    }
  }, [user]);

  const fetchMusicData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_music_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching music data:', error);
      } else {
        setMusicData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refreshSpotifyData();
    await fetchMusicData();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Music Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!musicData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Music Profile
          </CardTitle>
          <CardDescription>
            No music data available. Connect your Spotify account to see your music profile.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Currently Playing */}
      {musicData.currently_playing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              Currently Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {musicData.currently_playing.item?.album?.images?.[0] && (
                <img
                  src={musicData.currently_playing.item.album.images[0].url}
                  alt="Album cover"
                  className="w-16 h-16 rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{musicData.currently_playing.item?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  by {musicData.currently_playing.item?.artists?.map((a: any) => a.name).join(', ')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {musicData.currently_playing.item?.album?.name}
                </p>
              </div>
              {musicData.currently_playing.item?.external_urls?.spotify && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(musicData.currently_playing.item.external_urls.spotify, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Artists */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Top Artists
            </CardTitle>
            <CardDescription>Your most listened to artists</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {musicData.top_artists.slice(0, 6).map((artist: any, index: number) => (
              <div key={artist.id} className="flex items-center gap-3">
                {artist.images?.[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{artist.name}</p>
                  <p className="text-xs text-muted-foreground">
                    #{index + 1} • {artist.followers?.total?.toLocaleString()} followers
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Music Genres */}
      {musicData.music_genres && musicData.music_genres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Music Genres</CardTitle>
            <CardDescription>Your favorite music styles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {musicData.music_genres.map((genre: string) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Tracks */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tracks</CardTitle>
          <CardDescription>Your most played songs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {musicData.top_tracks.slice(0, 5).map((track: any, index: number) => (
              <div key={track.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                {track.album?.images?.[0] && (
                  <img
                    src={track.album.images[0].url}
                    alt="Album cover"
                    className="w-10 h-10 rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{track.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {track.artists?.map((a: any) => a.name).join(', ')}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicProfile;
