-- Add conversation context and intent tracking to conversations table
ALTER TABLE public.conversations 
ADD COLUMN conversation_context TEXT DEFAULT 'mixed',
ADD COLUMN created_from_intent TEXT DEFAULT 'both';

-- Create enum-like constraint for conversation_context
ALTER TABLE public.conversations 
ADD CONSTRAINT conversation_context_check 
CHECK (conversation_context IN ('dating', 'networking', 'mixed'));

-- Create enum-like constraint for created_from_intent  
ALTER TABLE public.conversations 
ADD CONSTRAINT created_from_intent_check 
CHECK (created_from_intent IN ('dating', 'networking', 'both'));

-- Update existing conversations to set context based on user intents
UPDATE public.conversations 
SET conversation_context = CASE
  WHEN EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p1.id = conversations.user2_id
    WHERE p1.id = conversations.user1_id 
    AND p1.platform_intent = 'dating' 
    AND p2.platform_intent = 'dating'
  ) THEN 'dating'
  WHEN EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p1.id = conversations.user2_id
    WHERE p1.id = conversations.user1_id 
    AND p1.platform_intent = 'networking' 
    AND p2.platform_intent = 'networking'
  ) THEN 'networking'
  ELSE 'mixed'
END,
created_from_intent = CASE
  WHEN EXISTS (
    SELECT 1 FROM public.profiles p1 
    WHERE p1.id = conversations.user1_id 
    AND p1.platform_intent = 'dating'
  ) THEN 'dating'
  WHEN EXISTS (
    SELECT 1 FROM public.profiles p1 
    WHERE p1.id = conversations.user1_id 
    AND p1.platform_intent = 'networking'
  ) THEN 'networking'
  ELSE 'both'
END;

-- Update the get_or_create_conversation function to set context
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(user1 uuid, user2 uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  conversation_id UUID;
  ordered_user1 UUID;
  ordered_user2 UUID;
  user1_intent TEXT;
  user2_intent TEXT;
  context_value TEXT;
  intent_value TEXT;
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
      
      -- Get platform intents for context determination
      SELECT platform_intent INTO user1_intent 
      FROM public.profiles WHERE id = ordered_user1;
      
      SELECT platform_intent INTO user2_intent 
      FROM public.profiles WHERE id = ordered_user2;
      
      -- Determine conversation context
      IF user1_intent = 'dating' AND user2_intent = 'dating' THEN
        context_value := 'dating';
      ELSIF user1_intent = 'networking' AND user2_intent = 'networking' THEN
        context_value := 'networking';
      ELSE
        context_value := 'mixed';
      END IF;
      
      -- Determine intent from the initiating user (user1 in original call)
      SELECT platform_intent INTO intent_value 
      FROM public.profiles WHERE id = user1;
      
      IF intent_value IS NULL THEN
        intent_value := 'both';
      END IF;
      
      INSERT INTO public.conversations (user1_id, user2_id, conversation_context, created_from_intent)
      VALUES (ordered_user1, ordered_user2, context_value, intent_value)
      RETURNING id INTO conversation_id;
    ELSE
      RAISE EXCEPTION 'Cannot create conversation: users must have liked each other';
    END IF;
  END IF;

  RETURN conversation_id;
END;
$function$