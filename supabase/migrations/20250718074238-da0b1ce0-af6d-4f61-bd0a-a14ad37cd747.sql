-- Update the trigger function to handle various Google OAuth name formats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Try different name formats from Google OAuth
  user_name := COALESCE(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    CONCAT(
      COALESCE(new.raw_user_meta_data ->> 'given_name', ''),
      CASE 
        WHEN new.raw_user_meta_data ->> 'given_name' IS NOT NULL 
        AND new.raw_user_meta_data ->> 'family_name' IS NOT NULL 
        THEN ' ' 
        ELSE '' 
      END,
      COALESCE(new.raw_user_meta_data ->> 'family_name', '')
    ),
    CONCAT(
      COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
      CASE 
        WHEN new.raw_user_meta_data ->> 'first_name' IS NOT NULL 
        AND new.raw_user_meta_data ->> 'last_name' IS NOT NULL 
        THEN ' ' 
        ELSE '' 
      END,
      COALESCE(new.raw_user_meta_data ->> 'last_name', '')
    )
  );
  
  -- Clean up the name (remove extra spaces)
  user_name := TRIM(user_name);
  
  -- If name is empty string, set to NULL
  IF user_name = '' THEN
    user_name := NULL;
  END IF;

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
    user_name,
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
    COALESCE(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    ),
    FALSE,
    FALSE,
    FALSE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';