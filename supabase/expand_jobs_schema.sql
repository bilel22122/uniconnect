-- Role Details
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS employment_type text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS job_location_type text; -- On-site, Hybrid, Remote
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS location_address text;

-- Company Context (Specific to this job)
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_display_name text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_overview text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_website text;

-- The Core Content
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS role_overview text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS responsibilities text; -- Intended for bullet points
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS skills_required text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS skills_preferred text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS education_requirements text;

-- Logistics
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS application_deadline date;
