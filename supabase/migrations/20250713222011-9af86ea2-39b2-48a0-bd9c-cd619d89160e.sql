-- Fix the remaining Function Search Path Mutable warning
-- Check if there are any other functions that need search_path set

-- Fix the trigger-based check_rate_limit function if it exists
CREATE OR REPLACE FUNCTION public.check_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  limit_count INTEGER;
BEGIN
  SELECT count(*) INTO limit_count
  FROM public.rate_limit_log
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 minute';

  IF limit_count >= 5 THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.rate_limit_log (user_id, created_at)
  VALUES (NEW.user_id, NOW());

  RETURN NEW;
END;
$$;

-- Also ensure cleanup_expired_matches has proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_matches()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Delete expired matches
    DELETE FROM public.daily_matches WHERE expires_at < NOW();
    
    RETURN;
END;
$$;