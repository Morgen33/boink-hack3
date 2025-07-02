-- Update RLS policies to allow users to view other users' profiles for discovery

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies that allow viewing completed profiles for discovery
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view completed profiles for discovery" ON public.profiles
FOR SELECT USING (profile_completed = true AND full_name IS NOT NULL);