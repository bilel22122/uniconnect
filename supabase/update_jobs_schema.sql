-- Add columns if they do not exist
DO $$
BEGIN
    BEGIN
        ALTER TABLE jobs ADD COLUMN job_type text;
    EXCEPTION
        WHEN duplicate_column THEN
            -- Column already exists, do nothing
            RAISE NOTICE 'job_type column already exists';
    END;

    BEGIN
        ALTER TABLE jobs ADD COLUMN location text;
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'location column already exists';
    END;

    BEGIN
        ALTER TABLE jobs ADD COLUMN salary_min integer;
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'salary_min column already exists';
    END;

    BEGIN
        ALTER TABLE jobs ADD COLUMN salary_max integer;
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'salary_max column already exists';
    END;

    BEGIN
        ALTER TABLE jobs ADD COLUMN tags text[];
    EXCEPTION
        WHEN duplicate_column THEN
            RAISE NOTICE 'tags column already exists';
    END;
END $$;

-- Migrate existing values if possible (Optional but helpful)
-- Migrating 'job_location_type' to 'job_type'
UPDATE jobs 
SET job_type = job_location_type 
WHERE job_type IS NULL AND job_location_type IS NOT NULL;

-- Migrating 'location_address' to 'location'
UPDATE jobs 
SET location = location_address 
WHERE location IS NULL AND location_address IS NOT NULL;

-- Migrating 'skills_required' (comma separated) to 'tags' array
-- Assuming 'skills_required' is like 'React, Node.js, Next.js'
UPDATE jobs 
SET tags = string_to_array(skills_required, ', ') 
WHERE tags IS NULL AND skills_required IS NOT NULL;


-- Add Public Read Policy
-- First, recreate a generic public read policy to be safe
DROP POLICY IF EXISTS "Public jobs are viewable by everyone" ON jobs;
CREATE POLICY "Public jobs are viewable by everyone" 
ON jobs FOR SELECT 
USING (true);

-- Ensure authenticated users can insert (companies)
-- Existing Insert policies should be fine, but verifying:
-- CREATE POLICY "Enable insert for authenticated users only" ON "public"."jobs"
-- AS PERMISSIVE FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- Ensure authenticated users can update own jobs
-- CREATE POLICY "Enable update for users based on company_id" ON "public"."jobs"
-- AS PERMISSIVE FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = company_id)
-- WITH CHECK (auth.uid() = company_id);
