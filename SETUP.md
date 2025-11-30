# PromptER - Supabase Setup Guide

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready (~2 minutes)

### 2. Run Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and click **Run**
5. Wait for "Success!" message

### 3. Get API Keys

1. Go to **Settings** → **API**
2. Copy the **Project URL** and **anon/public key**
3. Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Configure **Google** and **Apple** OAuth

### 5. Storage (Optional for Images/Videos)

1. Go to **Storage**
2. Create a bucket named `prompt-media`
3. Set policies to allow public read

### 6. Test the Application

```bash
npm run dev
```

1. Click **Sign Up**
2. Create an account
3. Check that you receive **200 credits** automatically
4. Try copying a prompt

## 🎯 Key Features

### Welcome Bonus System
- New users get **200 credits** automatically
- Handled by database trigger (`handle_new_user()`)
- Logged in transactions table

### Credit System
- **Deduct Credits**: `supabase.rpc('deduct_credits', { prompt_id_param, amount })`
- **Add Credits**: `supabase.rpc('add_credits', { amount, reward_type })`
- All operations are secure (SECURITY DEFINER)

### Copy Prompt Flow

```
1. User clicks "Copy" button
2. Check if logged in
   ├─ NO → Redirect to /login
   └─ YES → Continue
3. Call deduct_credits RPC
4. Check balance
   ├─ Insufficient → Show "Watch Ad" modal
   └─ Success → Copy to clipboard
5. Show toast notification
6. Update UI (credits remaining)
```

## 📊 Database Tables

### profiles
- `id` (uuid) - Links to auth.users
- `email` (text)
- `credits` (integer) - Default: 200
- Row Level Security enabled

### prompts
- Full prompt marketplace data
- `cost` - Credits required to purchase
- `prompt_text` - The actual prompt (hidden until purchased)
- Public read access

### transactions
- Purchase history
- Types: debit, credit, bonus, ad_reward
- User-specific access only

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure RPC functions with `SECURITY DEFINER`
- Users can only access their own data
- Anonymous users can browse prompts but not purchase

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists in project root
- Restart dev server after adding env variables

### "User must be logged in" error
- Sign out and sign in again
- Check browser console for auth errors

### Credits not deducted
- Check Supabase logs in Dashboard
- Verify RPC function exists (`deduct_credits`)
- Check user's current credit balance

## 📝 Next Steps

1. Seed database with real prompts
2. Add payment integration (Stripe)
3. Implement "Watch Ad" functionality
4. Add user dashboard
5. Add prompt upload feature for sellers

## 🎉 That's It!

Your PromptER marketplace is ready to go! 

Test signup → Get 200 credits → Copy prompts → See balance update.

