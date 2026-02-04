-- Personal Info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nationality text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url text;

-- Academic Info
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id text; -- Academic ID, distinct from user UUID
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS major text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_year text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expected_graduation date;

-- Extracurricular
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clubs text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sports text;

-- Skills & Experience
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS soft_skills text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS part_time_jobs text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS freelance_projects text;

-- Other
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS references_list text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mobility text;
