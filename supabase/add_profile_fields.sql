-- Add 'skills' and 'portfolio_url' to public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
