-- Add enhanced security logging columns to rate_limit_log table
ALTER TABLE public.rate_limit_log 
ADD COLUMN IF NOT EXISTS client_ip TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS request_origin TEXT,
ADD COLUMN IF NOT EXISTS security_level TEXT DEFAULT 'low',
ADD COLUMN IF NOT EXISTS additional_data JSONB DEFAULT '{}';

-- Add index for faster security queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_security_level ON public.rate_limit_log(security_level);
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_action_created ON public.rate_limit_log(action_type, created_at);

-- Create function to clean up old security logs
CREATE OR REPLACE FUNCTION public.cleanup_old_security_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete logs older than 30 days
  DELETE FROM public.rate_limit_log 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;