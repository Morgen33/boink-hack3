
-- Add Twitter OAuth support to the social_media_connections table
-- Update the platform constraint to ensure 'twitter' is allowed
ALTER TABLE public.social_media_connections 
DROP CONSTRAINT IF EXISTS social_media_connections_platform_check;

ALTER TABLE public.social_media_connections 
ADD CONSTRAINT social_media_connections_platform_check 
CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'tiktok'));

-- Add columns to store OAuth data for Twitter connections
ALTER TABLE public.social_media_connections 
ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
ADD COLUMN IF NOT EXISTS oauth_provider_id TEXT,
ADD COLUMN IF NOT EXISTS access_token TEXT,
ADD COLUMN IF NOT EXISTS refresh_token TEXT;

-- Create an index for OAuth provider lookups
CREATE INDEX IF NOT EXISTS idx_social_media_oauth_provider 
ON public.social_media_connections(oauth_provider, oauth_provider_id);
