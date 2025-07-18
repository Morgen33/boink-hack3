-- Create AI conversations table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  context_summary TEXT,
  conversation_type TEXT DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI messages table
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  context_metadata JSONB DEFAULT '{}',
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI context embeddings table for semantic search
CREATE TABLE public.ai_context_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.ai_messages(id) ON DELETE CASCADE,
  content_summary TEXT NOT NULL,
  embedding_vector JSONB,
  context_tags TEXT[],
  relevance_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_context_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_conversations
CREATE POLICY "Users can view their own AI conversations" 
ON public.ai_conversations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI conversations" 
ON public.ai_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI conversations" 
ON public.ai_conversations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI conversations" 
ON public.ai_conversations 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for ai_messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.ai_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_messages.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their conversations" 
ON public.ai_messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_messages.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

-- RLS Policies for ai_context_embeddings
CREATE POLICY "Users can view embeddings for their conversations" 
ON public.ai_context_embeddings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_context_embeddings.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

CREATE POLICY "System can manage embeddings" 
ON public.ai_context_embeddings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_updated_at ON public.ai_conversations(updated_at DESC);
CREATE INDEX idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON public.ai_messages(created_at);
CREATE INDEX idx_ai_context_embeddings_conversation_id ON public.ai_context_embeddings(conversation_id);
CREATE INDEX idx_ai_context_embeddings_relevance ON public.ai_context_embeddings(relevance_score DESC);

-- Trigger to update conversation timestamp when messages are added
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.ai_conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.ai_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_timestamp();