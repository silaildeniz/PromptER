-- =====================================================
-- NanoPrompt Pro - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 200 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- 2. PROMPTS TABLE
-- =====================================================
CREATE TYPE media_type AS ENUM ('image', 'video', 'text');

CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  media_url TEXT,
  media_type media_type DEFAULT 'image' NOT NULL,
  cost INTEGER DEFAULT 5 NOT NULL CHECK (cost > 0),
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  author TEXT DEFAULT 'PromptER Team',
  sales INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  variables TEXT[], -- Array of variable names like ["color", "style"]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Prompts policies - Everyone can read
CREATE POLICY "Anyone can view prompts"
  ON public.prompts FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- 3. TRANSACTIONS TABLE (Purchase History)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('debit', 'credit', 'bonus', 'ad_reward')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. TRIGGER: AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (
    NEW.id,
    NEW.email,
    200  -- Welcome Bonus: 200 Credits
  );
  
  -- Log the welcome bonus transaction
  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (
    NEW.id,
    200,
    'bonus',
    'Welcome bonus - New user registration'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 5. RPC FUNCTION: DEDUCT CREDITS (Secure Purchase)
-- =====================================================
CREATE OR REPLACE FUNCTION public.deduct_credits(
  prompt_id_param UUID,
  amount INTEGER
)
RETURNS JSON AS $$
DECLARE
  current_credits INTEGER;
  prompt_title TEXT;
  result JSON;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'unauthorized',
      'message', 'User must be logged in'
    );
  END IF;

  -- Get current credits
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = auth.uid();

  -- Check if user has enough credits
  IF current_credits < amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'insufficient_funds',
      'message', 'Not enough credits',
      'current_credits', current_credits,
      'required_credits', amount
    );
  END IF;

  -- Get prompt title for transaction log
  SELECT title INTO prompt_title
  FROM public.prompts
  WHERE id = prompt_id_param;

  -- Deduct credits
  UPDATE public.profiles
  SET credits = credits - amount,
      updated_at = now()
  WHERE id = auth.uid();

  -- Log transaction
  INSERT INTO public.transactions (user_id, prompt_id, amount, type, description)
  VALUES (
    auth.uid(),
    prompt_id_param,
    amount,
    'debit',
    'Purchased prompt: ' || prompt_title
  );

  -- Increment sales count
  UPDATE public.prompts
  SET sales = sales + 1
  WHERE id = prompt_id_param;

  -- Get updated credits
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN json_build_object(
    'success', true,
    'message', 'Credits deducted successfully',
    'credits_remaining', current_credits
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. RPC FUNCTION: ADD CREDITS (Ad Rewards, Purchases)
-- =====================================================
CREATE OR REPLACE FUNCTION public.add_credits(
  amount INTEGER,
  reward_type TEXT DEFAULT 'ad_reward'
)
RETURNS JSON AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'unauthorized',
      'message', 'User must be logged in'
    );
  END IF;

  -- Add credits
  UPDATE public.profiles
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = auth.uid()
  RETURNING credits INTO new_credits;

  -- Log transaction
  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (
    auth.uid(),
    amount,
    reward_type,
    CASE 
      WHEN reward_type = 'ad_reward' THEN 'Earned credits by watching ad'
      WHEN reward_type = 'credit' THEN 'Purchased credits'
      ELSE 'Credits added'
    END
  );

  RETURN json_build_object(
    'success', true,
    'message', 'Credits added successfully',
    'credits_total', new_credits
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. SEED DATA (Sample Prompts)
-- =====================================================
-- You can insert your mock data here or via the dashboard
-- This is optional for testing

-- =====================================================
-- 8. INDEXES for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_media_type ON public.prompts(media_type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- =====================================================
-- Setup Complete! 🎉
-- Next Steps:
-- 1. Copy your Supabase URL and Anon Key to .env.local
-- 2. Enable Email Auth in Supabase Dashboard
-- 3. Configure Google/Apple OAuth (optional)
-- =====================================================

