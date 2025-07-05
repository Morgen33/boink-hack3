-- Create conversations table to track message threads between users
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message_preview TEXT,
  user1_unread_count INTEGER DEFAULT 0,
  user2_unread_count INTEGER DEFAULT 0,
  UNIQUE(user1_id, user2_id),
  CONSTRAINT check_different_users CHECK (user1_id != user2_id),
  CONSTRAINT check_user_order CHECK (user1_id < user2_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  message_type TEXT DEFAULT 'text',
  CONSTRAINT check_message_content CHECK (length(trim(content)) > 0)
);

-- Enable RLS on both tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations with people they've liked or been liked by" 
ON public.conversations 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user1_id OR auth.uid() = user2_id) AND
  (
    -- Check if there's a mutual like or one-way like
    EXISTS (
      SELECT 1 FROM public.user_likes 
      WHERE (user_id = user1_id AND liked_profile_id = user2_id)
         OR (user_id = user2_id AND liked_profile_id = user1_id)
    )
  )
);

CREATE POLICY "Users can update their own conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

CREATE POLICY "Users can send messages to people they have conversations with" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE id = conversation_id AND (user1_id = sender_id OR user2_id = sender_id)
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(user1 UUID, user2 UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  conversation_id UUID;
  ordered_user1 UUID;
  ordered_user2 UUID;
BEGIN
  -- Ensure consistent ordering (smaller UUID first)
  IF user1 < user2 THEN
    ordered_user1 := user1;
    ordered_user2 := user2;
  ELSE
    ordered_user1 := user2;
    ordered_user2 := user1;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO conversation_id
  FROM public.conversations
  WHERE user1_id = ordered_user1 AND user2_id = ordered_user2;

  -- If no conversation exists, create one (only if users have liked each other)
  IF conversation_id IS NULL THEN
    -- Check if there's a mutual like or one-way like
    IF EXISTS (
      SELECT 1 FROM public.user_likes 
      WHERE (user_id = ordered_user1 AND liked_profile_id = ordered_user2)
         OR (user_id = ordered_user2 AND liked_profile_id = ordered_user1)
    ) THEN
      INSERT INTO public.conversations (user1_id, user2_id)
      VALUES (ordered_user1, ordered_user2)
      RETURNING id INTO conversation_id;
    ELSE
      RAISE EXCEPTION 'Cannot create conversation: users must have liked each other';
    END IF;
  END IF;

  RETURN conversation_id;
END;
$$;

-- Function to update conversation when new message is sent
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    user1_unread_count = CASE 
      WHEN user1_id = NEW.recipient_id THEN user1_unread_count + 1
      ELSE user1_unread_count
    END,
    user2_unread_count = CASE 
      WHEN user2_id = NEW.recipient_id THEN user2_unread_count + 1
      ELSE user2_unread_count
    END,
    updated_at = now()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update conversation on new message
CREATE TRIGGER update_conversation_on_message_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_on_message();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(conversation_uuid UUID, reader_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Mark messages as read
  UPDATE public.messages
  SET read_at = now()
  WHERE conversation_id = conversation_uuid
    AND recipient_id = reader_id
    AND read_at IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Reset unread count in conversation
  UPDATE public.conversations
  SET 
    user1_unread_count = CASE 
      WHEN user1_id = reader_id THEN 0
      ELSE user1_unread_count
    END,
    user2_unread_count = CASE 
      WHEN user2_id = reader_id THEN 0
      ELSE user2_unread_count
    END
  WHERE id = conversation_uuid;
  
  RETURN updated_count;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_conversations_user1 ON public.conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON public.conversations(user2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);