
import { Profile, ProfileFormData } from '@/types/ProfileTypes';

export const convertProfileToFormData = (profile: Profile): ProfileFormData => {
  return {
    // Platform Intent
    platform_intent: profile.platform_intent || '',
    // Basic Info
    full_name: profile.full_name || '',
    username: profile.username || '',
    age: profile.age ? profile.age.toString() : '',
    date_of_birth: profile.date_of_birth || '',
    location: profile.location || '',
    avatar_url: profile.avatar_url || '',
    bio: profile.bio || '',
    interests: profile.interests ? profile.interests.join(', ') : '',
    looking_for: profile.looking_for || '',
    gender_identity: profile.gender_identity || '',
    sexual_orientation: profile.sexual_orientation || '',
    looking_for_gender: profile.looking_for_gender || [],
    relationship_type: profile.relationship_type || '',
    // Photo fields
    photo_urls: profile.photo_urls || [],
    main_photo_index: profile.main_photo_index || 0,
    // Crypto fields
    wallet_address: profile.wallet_address || '',
    favorite_crypto: profile.favorite_crypto || '',
    crypto_experience: profile.crypto_experience || '',
    portfolio_size: profile.portfolio_size || '',
    trading_style: profile.trading_style || '',
    defi_protocols: profile.defi_protocols || [],
    nft_collections: profile.nft_collections ? profile.nft_collections.join(', ') : '',
    meme_coin_holdings: profile.meme_coin_holdings ? profile.meme_coin_holdings.join(', ') : '',
    biggest_crypto_win: profile.biggest_crypto_win || '',
    biggest_crypto_loss: profile.biggest_crypto_loss || '',
    crypto_motto: profile.crypto_motto || '',
    favorite_memes: [],
  };
};

export const createProfileFromData = (data: any): Profile => {
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    username: data.username,
    avatar_url: data.avatar_url,
    bio: data.bio,
    age: data.age,
    location: data.location,
    interests: data.interests,
    looking_for: data.looking_for,
    date_of_birth: data.date_of_birth,
    profile_completed: data.profile_completed,
    // Photo fields - using type assertion since we know these columns exist
    photo_urls: (data as any).photo_urls || null,
    main_photo_index: (data as any).main_photo_index || null,
    // Dating preferences
    gender_identity: data.gender_identity,
    sexual_orientation: data.sexual_orientation,
    looking_for_gender: data.looking_for_gender,
    relationship_type: data.relationship_type,
    // Crypto fields
    wallet_address: data.wallet_address || null,
    favorite_crypto: data.favorite_crypto || null,
    crypto_experience: data.crypto_experience || null,
    portfolio_size: data.portfolio_size || null,
    trading_style: data.trading_style || null,
    defi_protocols: data.defi_protocols || null,
    nft_collections: data.nft_collections || null,
    degen_score: data.degen_score || null,
    meme_coin_holdings: data.meme_coin_holdings || null,
    biggest_crypto_win: data.biggest_crypto_win || null,
    biggest_crypto_loss: data.biggest_crypto_loss || null,
    crypto_motto: data.crypto_motto || null,
    // Platform intent and networking fields
    platform_intent: data.platform_intent || null,
    company_name: data.company_name || null,
    job_title: data.job_title || null,
    industry: data.industry || null,
    years_in_crypto: data.years_in_crypto || null,
    networking_goals: data.networking_goals || null,
    expertise_areas: data.expertise_areas || null,
    professional_bio: data.professional_bio || null,
    linkedin_url: data.linkedin_url || null,
    website_url: data.website_url || null,
    looking_for_networking: data.looking_for_networking || null,
    networking_completed: data.networking_completed || null,
  };
};

export const prepareUpdateData = (formData: ProfileFormData) => {
  return {
    // Platform Intent
    platform_intent: (formData.platform_intent && 
      ['dating', 'networking', 'both'].includes(formData.platform_intent)) 
      ? formData.platform_intent as 'dating' | 'networking' | 'both' 
      : null,
    // Basic Info
    full_name: formData.full_name || null,
    username: formData.username || null,
    bio: formData.bio || null,
    age: formData.age ? parseInt(formData.age) : null,
    location: formData.location || null,
    interests: formData.interests ? formData.interests.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
    looking_for: formData.looking_for || null,
    date_of_birth: formData.date_of_birth || null,
    // Photo fields
    photo_urls: formData.photo_urls.length > 0 ? formData.photo_urls : null,
    main_photo_index: formData.main_photo_index || 0,
    avatar_url: formData.photo_urls[formData.main_photo_index] || formData.avatar_url || null,
    // Dating preferences
    gender_identity: formData.gender_identity || null,
    sexual_orientation: formData.sexual_orientation || null,
    looking_for_gender: formData.looking_for_gender.length > 0 ? formData.looking_for_gender : null,
    relationship_type: formData.relationship_type || null,
    // Crypto fields
    wallet_address: formData.wallet_address || null,
    favorite_crypto: formData.favorite_crypto || null,
    crypto_experience: formData.crypto_experience || null,
    portfolio_size: formData.portfolio_size || null,
    trading_style: formData.trading_style || null,
    defi_protocols: Array.isArray(formData.defi_protocols) ? formData.defi_protocols : null,
    nft_collections: formData.nft_collections ? formData.nft_collections.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
    meme_coin_holdings: formData.meme_coin_holdings ? formData.meme_coin_holdings.split(',').map((i: string) => i.trim()).filter(Boolean) : null,
    biggest_crypto_win: formData.biggest_crypto_win || null,
    biggest_crypto_loss: formData.biggest_crypto_loss || null,
    crypto_motto: formData.crypto_motto || null,
    favorite_memes: formData.favorite_memes || null,
    updated_at: new Date().toISOString(),
  };
};
