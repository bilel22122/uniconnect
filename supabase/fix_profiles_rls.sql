-- Drop existing 'Public profiles' policy if it exists (commonly created)
DROP POLICY IF EXISTS "Public profiles" ON profiles;
-- Drop any existing 'Profiles are viewable by everyone' policy to prevent conflicts
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create a new policy allowing any authenticated user to VIEW all profiles
-- This is necessary so that students can see company names/logos and vice-versa in the inbox
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
TO authenticated
USING (true);
