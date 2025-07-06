-- Create user_blocks table for blocking functionality
CREATE TABLE public.user_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL,
  blocked_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies for user_blocks
CREATE POLICY "Users can create their own blocks" 
ON public.user_blocks 
FOR INSERT 
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can view their own blocks" 
ON public.user_blocks 
FOR SELECT 
USING (auth.uid() = blocker_id);

CREATE POLICY "Users can delete their own blocks" 
ON public.user_blocks 
FOR DELETE 
USING (auth.uid() = blocker_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_blocks_updated_at
BEFORE UPDATE ON public.user_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();