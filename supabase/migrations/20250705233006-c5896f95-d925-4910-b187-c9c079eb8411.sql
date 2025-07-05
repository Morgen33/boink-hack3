-- Add age constraint to profiles table to ensure users are at least 18
ALTER TABLE public.profiles ADD CONSTRAINT check_minimum_age 
CHECK (age IS NULL OR age >= 18);

-- Add a function to calculate age from date_of_birth
CREATE OR REPLACE FUNCTION public.calculate_age_from_birthdate(birth_date date)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  IF birth_date IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$;

-- Add a trigger to automatically calculate and validate age when profiles are inserted/updated
CREATE OR REPLACE FUNCTION public.validate_user_age()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calculate age from date_of_birth if provided
  IF NEW.date_of_birth IS NOT NULL THEN
    NEW.age = calculate_age_from_birthdate(NEW.date_of_birth);
    
    -- Ensure user is at least 18 years old
    IF NEW.age < 18 THEN
      RAISE EXCEPTION 'Users must be at least 18 years old to create an account.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER validate_age_before_insert_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_user_age();

-- Update existing profiles to ensure they meet age requirements (this is a safety measure)
UPDATE public.profiles 
SET age = calculate_age_from_birthdate(date_of_birth) 
WHERE date_of_birth IS NOT NULL AND age IS NULL;