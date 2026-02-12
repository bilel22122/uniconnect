-- 1. DROP the problematic policies that cause recursion
-- Recursion happens because checking 'is_admin' queries 'profiles', which triggers the policy again.
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all jobs" ON jobs;

-- 2. Restore/Ensure simple public access for profiles
-- (This avoids recursion because it doesn't query the table to check permissions)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

CREATE POLICY "Profiles are viewable by everyone"
ON profiles
FOR SELECT
TO authenticated
USING (true);
