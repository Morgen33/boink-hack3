-- Add separate completion tracking fields for dating and networking profiles
ALTER TABLE public.profiles 
ADD COLUMN dating_profile_completed boolean DEFAULT false,
ADD COLUMN networking_profile_completed boolean DEFAULT false;

-- Update the handle_new_user function to store name and location from signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    location,
    age,
    date_of_birth,
    avatar_url, 
    profile_completed,
    dating_profile_completed,
    networking_profile_completed
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'location',
    CASE 
      WHEN new.raw_user_meta_data ->> 'date_of_birth' IS NOT NULL 
      THEN public.calculate_age_from_birthdate((new.raw_user_meta_data ->> 'date_of_birth')::date)
      ELSE NULL
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'date_of_birth' IS NOT NULL 
      THEN (new.raw_user_meta_data ->> 'date_of_birth')::date
      ELSE NULL
    END,
    new.raw_user_meta_data ->> 'avatar_url',
    FALSE,
    FALSE,
    FALSE
  );
  RETURN new;
END;
$$;