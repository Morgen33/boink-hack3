
-- Create a table to store social media connections
CREATE TABLE public.social_media_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'tiktok')),
  username TEXT NOT NULL,
  profile_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE public.social_media_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own social media connections" 
  ON public.social_media_connections 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own social media connections" 
  ON public.social_media_connections 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own social media connections" 
  ON public.social_media_connections 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own social media connections" 
  ON public.social_media_connections 
  FOR DELETE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Create an index for better performance
CREATE INDEX idx_social_media_connections_user_id ON public.social_media_connections(user_id);
