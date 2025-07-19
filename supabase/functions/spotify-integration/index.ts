
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const spotifyClientId = Deno.env.get('SPOTIFY_CLIENT_ID')!
const spotifyClientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')!

interface SpotifyTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface SpotifyUserData {
  topTracks: any[]
  topArtists: any[]
  recentTracks: any[]
  playlists: any[]
  currentlyPlaying: any
  userProfile: any
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    const { action, code, state } = await req.json()

    if (action === 'getAuthUrl') {
      const scopes = [
        'user-read-private',
        'user-read-email', 
        'user-top-read',
        'user-read-recently-played',
        'user-read-currently-playing',
        'playlist-read-private',
        'user-library-read'
      ].join(' ')

      const redirectUri = `${req.headers.get('origin')}/auth`
      const authUrl = `https://accounts.spotify.com/authorize?` +
        `response_type=code&` +
        `client_id=${spotifyClientId}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${user.id}`

      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'handleCallback') {
      // Exchange code for tokens
      const redirectUri = `${req.headers.get('origin')}/auth`
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${spotifyClientId}:${spotifyClientSecret}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        })
      })

      const tokens: SpotifyTokenResponse = await tokenResponse.json()
      
      if (!tokens.access_token) {
        throw new Error('Failed to get Spotify access token')
      }

      // Fetch user's Spotify data
      const spotifyData = await fetchSpotifyUserData(tokens.access_token)
      
      // Store tokens in social_media_connections
      await supabase
        .from('social_media_connections')
        .upsert({
          user_id: user.id,
          platform: 'spotify',
          username: spotifyData.userProfile.display_name || spotifyData.userProfile.id,
          profile_url: spotifyData.userProfile.external_urls?.spotify,
          oauth_provider: 'spotify',
          oauth_provider_id: spotifyData.userProfile.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          verified: true
        })

      // Store music data
      await supabase
        .from('user_music_data')
        .upsert({
          user_id: user.id,
          spotify_user_id: spotifyData.userProfile.id,
          top_tracks: spotifyData.topTracks,
          top_artists: spotifyData.topArtists,
          recent_tracks: spotifyData.recentTracks,
          playlists: spotifyData.playlists,
          currently_playing: spotifyData.currentlyPlaying,
          music_genres: extractGenres(spotifyData.topArtists),
          listening_stats: calculateListeningStats(spotifyData)
        })

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'refreshData') {
      // Get existing connection
      const { data: connection } = await supabase
        .from('social_media_connections')
        .select('access_token, refresh_token')
        .eq('user_id', user.id)
        .eq('platform', 'spotify')
        .single()

      if (!connection?.access_token) {
        throw new Error('No Spotify connection found')
      }

      // Fetch fresh data
      const spotifyData = await fetchSpotifyUserData(connection.access_token)
      
      // Update music data
      await supabase
        .from('user_music_data')
        .upsert({
          user_id: user.id,
          top_tracks: spotifyData.topTracks,
          top_artists: spotifyData.topArtists,
          recent_tracks: spotifyData.recentTracks,
          currently_playing: spotifyData.currentlyPlaying,
          music_genres: extractGenres(spotifyData.topArtists),
          listening_stats: calculateListeningStats(spotifyData)
        })

      return new Response(
        JSON.stringify({ success: true, data: spotifyData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Spotify integration error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function fetchSpotifyUserData(accessToken: string): Promise<SpotifyUserData> {
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  }

  const [userProfile, topTracks, topArtists, recentTracks, playlists, currentlyPlaying] = await Promise.all([
    fetch('https://api.spotify.com/v1/me', { headers }).then(r => r.json()),
    fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term', { headers }).then(r => r.json()),
    fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', { headers }).then(r => r.json()),
    fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', { headers }).then(r => r.json()),
    fetch('https://api.spotify.com/v1/me/playlists?limit=20', { headers }).then(r => r.json()),
    fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers }).then(r => r.status === 200 ? r.json() : null)
  ])

  return {
    userProfile,
    topTracks: topTracks.items || [],
    topArtists: topArtists.items || [],
    recentTracks: recentTracks.items || [],
    playlists: playlists.items || [],
    currentlyPlaying
  }
}

function extractGenres(artists: any[]): string[] {
  const genres = new Set<string>()
  artists.forEach(artist => {
    if (artist.genres) {
      artist.genres.forEach((genre: string) => genres.add(genre))
    }
  })
  return Array.from(genres).slice(0, 10)
}

function calculateListeningStats(data: SpotifyUserData) {
  return {
    totalTopTracks: data.topTracks.length,
    totalTopArtists: data.topArtists.length,
    recentTrackCount: data.recentTracks.length,
    playlistCount: data.playlists.length,
    hasCurrentlyPlaying: !!data.currentlyPlaying,
    topGenres: extractGenres(data.topArtists).slice(0, 5)
  }
}
