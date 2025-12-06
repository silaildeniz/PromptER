-- =====================================================
-- Migration: Add Username to Profiles
-- Run this in your Supabase SQL Editor
-- This is SAFE to run multiple times (idempotent)
-- =====================================================

-- 1. Add username column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT;

-- 2. Create unique index on username (allows null but unique non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_idx 
ON public.profiles(username) 
WHERE username IS NOT NULL;

-- 3. Update existing profiles to have a username derived from email
UPDATE public.profiles
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- 4. Update the handle_new_user function to include username from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, credits)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    200  -- Welcome Bonus: 200 Credits
  );
  
  -- Log the welcome bonus transaction
  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (
    NEW.id,
    200,
    'bonus',
    'Welcome bonus - Thank you for joining PromptHub!'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The trigger already exists, so we don't need to recreate it.
-- The function update will automatically apply to the existing trigger.

-- 5. Verify: Check the profiles table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

