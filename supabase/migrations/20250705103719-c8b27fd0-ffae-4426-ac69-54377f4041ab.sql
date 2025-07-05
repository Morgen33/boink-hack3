-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for storing profile embeddings
CREATE TABLE public.profile_embeddings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio_embedding vector(1536),
    interests_embedding vector(1536),
    personality_traits JSONB,
    crypto_philosophy TEXT,
    communication_style TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create table for AI compatibility scores and insights
CREATE TABLE public.ai_compatibility_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    compatibility_score DECIMAL(3,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
    personality_match DECIMAL(3,2),
    communication_compatibility DECIMAL(3,2),
    crypto_alignment DECIMAL(3,2),
    shared_values_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, target_user_id)
);

-- Create table for match insights and explanations
CREATE TABLE public.match_insights (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    compatibility_explanation TEXT NOT NULL,
    conversation_starters TEXT[] DEFAULT '{}',
    shared_interests TEXT[] DEFAULT '{}',
    personality_highlights TEXT,
    crypto_common_ground TEXT,
    ai_confidence DECIMAL(3,2) DEFAULT 0.8,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, target_user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.profile_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_compatibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile_embeddings
CREATE POLICY "Users can view their own embeddings" 
ON public.profile_embeddings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own embeddings" 
ON public.profile_embeddings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own embeddings" 
ON public.profile_embeddings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for ai_compatibility_scores
CREATE POLICY "Users can view their compatibility scores" 
ON public.ai_compatibility_scores 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "System can insert compatibility scores" 
ON public.ai_compatibility_scores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update compatibility scores" 
ON public.ai_compatibility_scores 
FOR UPDATE 
USING (true);

-- RLS policies for match_insights  
CREATE POLICY "Users can view their match insights" 
ON public.match_insights 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "System can insert match insights" 
ON public.match_insights 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update match insights" 
ON public.match_insights 
FOR UPDATE 
USING (true);

-- Create indexes for better performance
CREATE INDEX profile_embeddings_user_id_idx ON public.profile_embeddings(user_id);
CREATE INDEX ai_compatibility_scores_user_id_idx ON public.ai_compatibility_scores(user_id);
CREATE INDEX ai_compatibility_scores_target_user_id_idx ON public.ai_compatibility_scores(target_user_id);
CREATE INDEX match_insights_user_id_idx ON public.match_insights(user_id);
CREATE INDEX match_insights_target_user_id_idx ON public.match_insights(target_user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profile_embeddings_updated_at
BEFORE UPDATE ON public.profile_embeddings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_compatibility_scores_updated_at
BEFORE UPDATE ON public.ai_compatibility_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_match_insights_updated_at
BEFORE UPDATE ON public.match_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();