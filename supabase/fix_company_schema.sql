-- Ensure all company profile fields exist, including 'bio'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_size text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headquarters text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS founded_year text;

-- Verify columns are present (optional check for admin)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='bio') THEN 
        RAISE NOTICE 'Bio column missing even after alter'; 
    END IF; 
END $$;
