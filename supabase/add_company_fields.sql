-- Company Specific Info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_size text; -- e.g. "1-10", "11-50", "51-200", "201-500", "500+"
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headquarters text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS founded_year text;
