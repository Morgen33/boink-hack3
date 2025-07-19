
-- Create table to store user music data from Spotify
CREATE TABLE public.user_music_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  spotify_user_id TEXT,
  top_tracks JSONB DEFAULT '[]'::jsonb,
  top_artists JSONB DEFAULT '[]'::jsonb,
  recent_tracks JSONB DEFAULT '[]'::jsonb,
  playlists JSONB DEFAULT '[]'::jsonb,
  music_genres JSONB DEFAULT '[]'::jsonb,
  currently_playing JSONB,
  listening_stats JSONB DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_music_data ENABLE ROW LEVEL SECURITY;

-- Users can view their own music data
CREATE POLICY "Users can view their own music data" 
  ON public.user_music_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own music data
CREATE POLICY "Users can insert their own music data" 
  ON public.user_music_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own music data
CREATE POLICY "Users can update their own music data" 
  ON public.user_music_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- System can view music data for compatibility calculations
CREATE POLICY "System can view music data for matching" 
  ON public.user_music_data 
  FOR SELECT 
  USING (true);

-- Add music compatibility fields to existing compatibility scores table
ALTER TABLE public.ai_compatibility_scores 
ADD COLUMN IF NOT EXISTS music_compatibility NUMERIC,
ADD COLUMN IF NOT EXISTS shared_artists JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS shared_genres JSONB DEFAULT '[]'::jsonb;

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_music_data_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_music_data_timestamp
  BEFORE UPDATE ON public.user_music_data
  FOR EACH ROW
  EXECUTE FUNCTION update_music_data_timestamp();
