-- Add foreign key constraints to user_likes table
ALTER TABLE public.user_likes 
ADD CONSTRAINT user_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_likes 
ADD CONSTRAINT user_likes_liked_profile_id_fkey 
FOREIGN KEY (liked_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;