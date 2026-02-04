-- Identity
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tagline text;

-- Narrative & Offerings
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS history_milestones text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS products_services text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS markets_served text;

-- Team
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS leadership_info text;

-- Contact & Social
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter_url text;
