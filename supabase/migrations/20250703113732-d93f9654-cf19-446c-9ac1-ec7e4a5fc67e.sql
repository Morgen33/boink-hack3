-- Create daily matches table
CREATE TABLE public.daily_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(5,4) NOT NULL,
  match_breakdown JSONB,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '1 day'),
  viewed BOOLEAN NOT NULL DEFAULT FALSE,
  liked BOOLEAN DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX idx_daily_matches_user_id ON public.daily_matches(user_id);
CREATE INDEX idx_daily_matches_expires_at ON public.daily_matches(expires_at);
CREATE INDEX idx_daily_matches_generated_at ON public.daily_matches(generated_at);

-- Enable RLS
ALTER TABLE public.daily_matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own daily matches" ON public.daily_matches
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily matches" ON public.daily_matches
FOR UPDATE USING (auth.uid() = user_id);

-- Create table to track previously shown profiles
CREATE TABLE public.match_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shown_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  shown_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, shown_profile_id)
);

-- Create index for match history
CREATE INDEX idx_match_history_user_id ON public.match_history(user_id);
CREATE INDEX idx_match_history_shown_at ON public.match_history(shown_at);

-- Enable RLS on match history
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for match history
CREATE POLICY "Users can view their own match history" ON public.match_history
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert match history" ON public.match_history
FOR INSERT WITH CHECK (true);

-- Function to clean up expired matches
CREATE OR REPLACE FUNCTION public.cleanup_expired_matches()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.daily_matches 
  WHERE expires_at < now();
  
  -- Clean up old match history (keep last 30 days)
  DELETE FROM public.match_history 
  WHERE shown_at < now() - INTERVAL '30 days';
END;
$$;