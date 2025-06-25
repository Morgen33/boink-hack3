
-- Add additional fields to the profiles table for personal profiles
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT,
ADD COLUMN age INTEGER,
ADD COLUMN location TEXT,
ADD COLUMN interests TEXT[],
ADD COLUMN looking_for TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;

-- Update the handle_new_user function to include the new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, profile_completed)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    FALSE
  );
  RETURN new;
END;
$$;

-- Add RLS policy for users to update their own profiles
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
