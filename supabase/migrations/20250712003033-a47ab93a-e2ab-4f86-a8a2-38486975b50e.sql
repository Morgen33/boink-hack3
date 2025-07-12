-- Add new columns to profiles table for comprehensive form
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_birthdate boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS favorite_memes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS investment_philosophy text,
ADD COLUMN IF NOT EXISTS crypto_date_preference text,
ADD COLUMN IF NOT EXISTS ideal_crypto_date text,
ADD COLUMN IF NOT EXISTS crypto_deal_breaker text,
ADD COLUMN IF NOT EXISTS willing_to_relocate text,
ADD COLUMN IF NOT EXISTS preferred_meeting_type text,
ADD COLUMN IF NOT EXISTS show_in_dating_pool boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_in_networking_pool boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS make_profile_public boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS skills_offered text[],
ADD COLUMN IF NOT EXISTS skills_needed text[],
ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb;