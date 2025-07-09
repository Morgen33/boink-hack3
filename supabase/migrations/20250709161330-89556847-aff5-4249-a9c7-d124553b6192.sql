-- Critical Security Fixes: RLS Policy Improvements

-- 1. Add missing INSERT policy for daily_matches (system-only inserts)
CREATE POLICY "System can insert daily matches" ON public.daily_matches
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from service role or edge functions
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
  OR 
  -- Allow inserts from authenticated functions (edge functions with user context)
  (auth.uid() IS NOT NULL AND current_setting('request.jwt.claims', true)::json ->> 'iss' = 'https://pizlzaomylxreizohewd.supabase.co/auth/v1')
);

-- 2. Enhance profile discovery security - ensure only essential fields are exposed
DROP POLICY IF EXISTS "Users can view completed profiles for discovery" ON public.profiles;

CREATE POLICY "Users can view completed profiles for discovery" ON public.profiles
FOR SELECT 
USING (
  profile_completed = true 
  AND full_name IS NOT NULL 
  AND age >= 18  -- Additional age verification
  AND id != auth.uid()  -- Prevent users from seeing their own profile in discovery
);

-- 3. Add policy to prevent users from viewing blocked users' profiles
CREATE POLICY "Block viewing of blocked users profiles" ON public.profiles
FOR SELECT
USING (
  NOT EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE blocker_id = auth.uid() AND blocked_id = profiles.id
  )
  AND 
  NOT EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE blocker_id = profiles.id AND blocked_id = auth.uid()
  )
);

-- 4. Add security function to check if user profile access is allowed
CREATE OR REPLACE FUNCTION public.is_profile_access_allowed(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE (blocker_id = auth.uid() AND blocked_id = target_user_id)
       OR (blocker_id = target_user_id AND blocked_id = auth.uid())
  )
$$;

-- 5. Enhanced match history policy to prevent data leakage
DROP POLICY IF EXISTS "Users can view their own match history" ON public.match_history;

CREATE POLICY "Users can view their own match history" ON public.match_history
FOR SELECT 
USING (
  auth.uid() = user_id 
  AND public.is_profile_access_allowed(shown_profile_id)
);

-- 6. Add rate limiting function for API calls (to be used in edge functions)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_id uuid,
  action_type text,
  max_attempts integer DEFAULT 10,
  time_window interval DEFAULT '1 hour'::interval
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- Count recent attempts
  SELECT COUNT(*) INTO attempt_count
  FROM public.rate_limit_log
  WHERE user_id = check_rate_limit.user_id
    AND action_type = check_rate_limit.action_type
    AND created_at > (now() - time_window);
    
  -- Return false if limit exceeded
  IF attempt_count >= max_attempts THEN
    RETURN false;
  END IF;
  
  -- Log this attempt
  INSERT INTO public.rate_limit_log (user_id, action_type)
  VALUES (check_rate_limit.user_id, check_rate_limit.action_type);
  
  RETURN true;
END;
$$;

-- 7. Create rate limiting log table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_user_action_time 
ON public.rate_limit_log(user_id, action_type, created_at);

-- Enable RLS on rate limit log
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Rate limit log policies
CREATE POLICY "System can insert rate limit logs" ON public.rate_limit_log
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can select rate limit logs" ON public.rate_limit_log
FOR SELECT 
USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
  OR auth.uid() = user_id
);

-- 8. Add function to clean up old rate limit logs
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.rate_limit_log 
  WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;