
-- Add new columns to the profiles table for dating preferences
ALTER TABLE public.profiles 
ADD COLUMN gender_identity text,
ADD COLUMN sexual_orientation text,
ADD COLUMN looking_for_gender text[],
ADD COLUMN relationship_type text;

-- Add some common default values to help with data consistency
COMMENT ON COLUMN public.profiles.gender_identity IS 'User gender identity (e.g., Man, Woman, Non-binary, Other)';
COMMENT ON COLUMN public.profiles.sexual_orientation IS 'User sexual orientation (e.g., Straight, Gay, Lesbian, Bisexual, Pansexual, Other)';
COMMENT ON COLUMN public.profiles.looking_for_gender IS 'Array of gender identities the user is looking for';
COMMENT ON COLUMN public.profiles.relationship_type IS 'Type of relationship seeking (e.g., Serious, Casual, Friends, Open to anything)';
