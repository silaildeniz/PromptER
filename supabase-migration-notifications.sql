-- =====================================================
-- Migration: Add Notification Preferences to Profiles
-- Run this in your Supabase SQL Editor
-- This is SAFE to run multiple times (idempotent)
-- =====================================================

-- 1. Add notification_preferences JSONB column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "creditEarned": true,
  "promptUnlocked": true,
  "emailNotifications": true,
  "weeklyDigest": false
}'::jsonb;

-- 2. Update existing profiles that have NULL notification_preferences
UPDATE public.profiles
SET notification_preferences = '{
  "creditEarned": true,
  "promptUnlocked": true,
  "emailNotifications": true,
  "weeklyDigest": false
}'::jsonb
WHERE notification_preferences IS NULL;

-- 3. Optional: Create a notifications table for storing actual notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit_earned', 'prompt_unlocked', 'system', 'weekly_digest')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB, -- Extra data like prompt_id, credit_amount, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- =====================================================
-- 4. Function to create notification when credit is earned
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_credit_earned()
RETURNS TRIGGER AS $$
DECLARE
  user_prefs JSONB;
BEGIN
  -- Only for credit/bonus transactions
  IF NEW.type IN ('credit', 'bonus', 'ad_reward') THEN
    -- Check user's notification preferences
    SELECT notification_preferences INTO user_prefs
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- If user wants credit notifications
    IF (user_prefs->>'creditEarned')::boolean = true THEN
      INSERT INTO public.notifications (user_id, type, title, message, data)
      VALUES (
        NEW.user_id,
        'credit_earned',
        '💰 Credits Earned!',
        'You earned ' || NEW.amount || ' credits. ' || COALESCE(NEW.description, ''),
        jsonb_build_object('amount', NEW.amount, 'transaction_id', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for credit notifications
DROP TRIGGER IF EXISTS on_credit_earned ON public.transactions;
CREATE TRIGGER on_credit_earned
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.notify_credit_earned();

-- =====================================================
-- 5. Function to create notification when prompt is unlocked
-- =====================================================
CREATE OR REPLACE FUNCTION public.notify_prompt_unlocked()
RETURNS TRIGGER AS $$
DECLARE
  user_prefs JSONB;
  prompt_title TEXT;
BEGIN
  -- Check user's notification preferences
  SELECT notification_preferences INTO user_prefs
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Get prompt title
  SELECT title INTO prompt_title
  FROM public.prompts
  WHERE id = NEW.prompt_id;

  -- If user wants prompt unlock notifications
  IF (user_prefs->>'promptUnlocked')::boolean = true THEN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'prompt_unlocked',
      '🔓 Prompt Unlocked!',
      'You now have access to: ' || COALESCE(prompt_title, 'a new prompt'),
      jsonb_build_object('prompt_id', NEW.prompt_id, 'prompt_title', prompt_title)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for prompt unlock notifications
DROP TRIGGER IF EXISTS on_prompt_unlocked ON public.purchases;
CREATE TRIGGER on_prompt_unlocked
  AFTER INSERT ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.notify_prompt_unlocked();

-- =====================================================
-- Verify: Check the profiles table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';
-- =====================================================

