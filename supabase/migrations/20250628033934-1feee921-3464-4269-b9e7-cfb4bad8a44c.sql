
-- Add username field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text UNIQUE;

-- Add a comment to describe the username field
COMMENT ON COLUMN public.profiles.username IS 'Unique username/handle for the user (e.g., @cryptoqueen)';

-- Create an index on username for faster lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);
