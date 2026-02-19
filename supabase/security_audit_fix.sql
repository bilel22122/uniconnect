-- SECURITY AND INTEGRITY AUDIT FIX
-- -----------------------------------------------------------------------------
-- Objective: Fix the "Update All" vulnerability and clean up corrupted data.

-- 1. LOCK DOWN THE TABLE
-- Ensure Row Level Security is strictly ENABLED.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. PURGE PERMISSIVE POLICIES
-- Drop any policy that might be allowing global updates.
-- We drop generic names that might have been created previously.
DROP POLICY IF EXISTS "Enable update for users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Public profiles" ON profiles;

-- 3. ESTABLISH STRICT SECURITY (The "Self-Service Only" Rule)

-- A. Public Read Access (Safe)
-- Anyone can READ profiles (needed for job boards, etc.)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- B. Strict Update Access (The Fix)
-- Users can ONLY update rows where their auth.uid matches the profile.id.
CREATE POLICY "Users can only update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- C. Strict Insert Access
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. DATA INTEGRITY CLEANUP
-- The `photo_url` column was corrupted by a global update.
-- We must reset it to NULL to clear the incorrect images.
-- (Using 'photo_url' as confirmed in the codebase)
UPDATE profiles
SET photo_url = NULL;

-- If you have an 'avatar_url' column as well, uncomment the line below:
-- UPDATE profiles SET avatar_url = NULL;

-- 5. VERIFICATION
-- After running this, try updating a profile from the frontend.
-- Attempting to update another user's ID should now throw a permission error (401/403) or affect 0 rows.
