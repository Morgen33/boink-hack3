
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  interests: string[] | null;
  looking_for: string | null;
  date_of_birth: string | null;
  profile_completed: boolean | null;
  // Dating preference fields
  gender_identity: string | null;
  sexual_orientation: string | null;
  looking_for_gender: string[] | null;
  relationship_type: string | null;
  // Crypto fields
  wallet_address: string | null;
  favorite_crypto: string | null;
  crypto_experience: string | null;
  portfolio_size: string | null;
  trading_style: string | null;
  defi_protocols: string[] | null;
  nft_collections: string[] | null;
  degen_score: number | null;
  meme_coin_holdings: string[] | null;
  biggest_crypto_win: string | null;
  biggest_crypto_loss: string | null;
  crypto_motto: string | null;
}

export interface ProfileFormData {
  full_name: string;
  username: string;
  age: string;
  date_of_birth: string;
  location: string;
  avatar_url: string;
  bio: string;
  interests: string;
  looking_for: string;
  gender_identity: string;
  sexual_orientation: string;
  looking_for_gender: string[];
  relationship_type: string;
  wallet_address: string;
  favorite_crypto: string;
  crypto_experience: string;
  portfolio_size: string;
  trading_style: string;
  defi_protocols: string;
  nft_collections: string;
  meme_coin_holdings: string;
  biggest_crypto_win: string;
  biggest_crypto_loss: string;
  crypto_motto: string;
}
