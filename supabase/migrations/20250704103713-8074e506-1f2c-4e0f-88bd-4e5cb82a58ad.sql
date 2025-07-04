-- Create user_likes table for storing profile likes
CREATE TABLE public.user_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  liked_profile_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_mutual_match BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, liked_profile_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for user_likes
CREATE POLICY "Users can view their own likes" 
ON public.user_likes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own likes" 
ON public.user_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own likes" 
ON public.user_likes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to handle mutual match detection
CREATE OR REPLACE FUNCTION public.handle_user_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the liked user has also liked this user
  IF EXISTS (
    SELECT 1 FROM public.user_likes 
    WHERE user_id = NEW.liked_profile_id 
    AND liked_profile_id = NEW.user_id
  ) THEN
    -- Update both records to mark as mutual match
    UPDATE public.user_likes 
    SET is_mutual_match = true 
    WHERE (user_id = NEW.user_id AND liked_profile_id = NEW.liked_profile_id)
       OR (user_id = NEW.liked_profile_id AND liked_profile_id = NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for mutual match detection
CREATE TRIGGER on_user_like_created
  AFTER INSERT ON public.user_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_like();