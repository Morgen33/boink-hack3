-- First, let's see what we're dealing with - check for profiles with ages under 18
DO $$
DECLARE
    underage_count integer;
BEGIN
    -- Count profiles that would violate the age constraint
    SELECT COUNT(*) INTO underage_count
    FROM public.profiles 
    WHERE age IS NOT NULL AND age < 18;
    
    -- If there are underage profiles, we need to handle them
    IF underage_count > 0 THEN
        -- Set their profiles as incomplete and clear age/birth date to prevent access
        UPDATE public.profiles 
        SET profile_completed = false, 
            age = NULL, 
            date_of_birth = NULL
        WHERE age IS NOT NULL AND age < 18;
        
        RAISE NOTICE 'Found and updated % underage profiles - set as incomplete', underage_count;
    END IF;
END $$;

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
      RAISE EXCEPTION 'Users must be at least 18 years old to create an account. This platform is restricted to adults only.';
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