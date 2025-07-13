-- Update social_media_connections table to include snapchat
ALTER TABLE public.social_media_connections 
DROP CONSTRAINT IF EXISTS social_media_connections_platform_check;

ALTER TABLE public.social_media_connections 
ADD CONSTRAINT social_media_connections_platform_check 
CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'snapchat'));