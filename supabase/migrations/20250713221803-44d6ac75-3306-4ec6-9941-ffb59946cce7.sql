-- Fix Function Search Path Mutable security warnings
-- Update functions to set search_path securely

-- Fix check_rate_limit function (both overloads)
CREATE OR REPLACE FUNCTION public.check_rate_limit(user_id uuid, action_type text, max_attempts integer DEFAULT 10, time_window interval DEFAULT '01:00:00'::interval)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix the resource-based check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(resource_name text, max_count integer, window_size interval)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Placeholder implementation - replace with actual logic as needed
  RETURN true;
END;
$$;

-- Fix is_profile_access_allowed function
CREATE OR REPLACE FUNCTION public.is_profile_access_allowed(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE (blocker_id = auth.uid() AND blocked_id = target_user_id)
       OR (blocker_id = target_user_id AND blocked_id = auth.uid())
  )
$$;

-- Fix cleanup_rate_limit_logs function
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Delete old rate limit logs
  DELETE FROM public.rate_limit_log WHERE created_at < NOW() - INTERVAL '1 day';
END;
$$;