-- Add favorite_memes field to profiles table
ALTER TABLE public.profiles ADD COLUMN favorite_memes jsonb DEFAULT '[]'::jsonb;

-- Add comment to explain the field
COMMENT ON COLUMN public.profiles.favorite_memes IS 'Array of favorite meme objects with id, name, ticker, imageUrl, chain, and description';