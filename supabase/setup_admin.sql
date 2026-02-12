-- 1. Add 'is_admin' column to 'profiles' table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Set Admin User (REPLACE WITH YOUR EMAIL)
-- We need to find the user ID from auth.users, but we can't join easily in an update.
-- However, profiles.id IS the auth.users.id.
-- So we can update profiles where the email matches (if email is stored in profiles).
-- If email is NOT in profiles (it usually isn't by default in some starters, but let's assume we might need to look it up or user manually enters ID).
-- BUT, typically 'profiles' table might not have email. 
-- Best practice: Update based on ID if known, or if profiles has email.
-- Assuming 'profiles' table has 'email' column or we use a subquery if permissions allow.
-- Since we are running this in SQL Editor, we can use a subquery against auth.users if we have permissions, OR just tell user to use their UUID.
-- However, user asked to use EMAIL.
-- Let's assume standard Supabase setup where we might not have direct access to auth.users in simple queries depending on role, but usually Service Role does.

UPDATE profiles
SET is_admin = TRUE
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'admin@uniconnect.com'
);

-- 3. Security Policies (RLS)

-- A. Allow Admins to DELETE jobs
CREATE POLICY "Admins can delete any job"
ON jobs
FOR DELETE
TO public
USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

-- B. Allow Admins to DELETE profiles (Be careful with cascade!)
CREATE POLICY "Admins can delete any profile"
ON profiles
FOR DELETE
TO public
USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

-- C. Ensure Admins can VIEW all rows in profiles and jobs
-- Existing policies might already allow viewing public data. 
-- But clarity, we can add a specific admin policy if strictly needed, 
-- or rely on "Public profiles are viewable by everyone" policies.
-- If 'jobs' and 'profiles' are already public read, this is redundant but harmless.
-- If they are private, this is needed.

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO public
USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

CREATE POLICY "Admins can view all jobs"
ON jobs
FOR SELECT
TO public
USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);
