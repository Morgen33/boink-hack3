-- Create enum for platform intent
CREATE TYPE public.platform_intent_type AS ENUM ('dating', 'networking', 'both');

-- Add platform intent and networking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN platform_intent platform_intent_type,
ADD COLUMN company_name text,
ADD COLUMN job_title text,
ADD COLUMN industry text,
ADD COLUMN years_in_crypto integer,
ADD COLUMN networking_goals text[],
ADD COLUMN expertise_areas text[],
ADD COLUMN professional_bio text,
ADD COLUMN linkedin_url text,
ADD COLUMN website_url text,
ADD COLUMN looking_for_networking text[],
ADD COLUMN networking_completed boolean DEFAULT false;