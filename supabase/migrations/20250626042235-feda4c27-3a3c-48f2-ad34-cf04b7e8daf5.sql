
-- Add all the missing crypto fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS favorite_crypto TEXT,
ADD COLUMN IF NOT EXISTS crypto_experience TEXT,
ADD COLUMN IF NOT EXISTS portfolio_size TEXT,
ADD COLUMN IF NOT EXISTS trading_style TEXT,
ADD COLUMN IF NOT EXISTS defi_protocols TEXT[],
ADD COLUMN IF NOT EXISTS nft_collections TEXT[],
ADD COLUMN IF NOT EXISTS degen_score INTEGER,
ADD COLUMN IF NOT EXISTS meme_coin_holdings TEXT[],
ADD COLUMN IF NOT EXISTS biggest_crypto_win TEXT,
ADD COLUMN IF NOT EXISTS biggest_crypto_loss TEXT,
ADD COLUMN IF NOT EXISTS crypto_motto TEXT;
