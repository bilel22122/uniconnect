-- FORCE SECURITY RESET
-- -----------------------------------------------------------------------------
-- Objective: Completely reset 'profiles' security to fix the "Update All" bug.
-- This script handles potential "Policy already exists" errors by dropping them first.

-- 1. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. DROP OLD/CONFLICTING POLICIES (Clean Slate)
DROP POLICY IF EXISTS "Users can only update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Public profiles" ON profiles;
DROP POLICY IF EXISTS "Strict Self-Update Only" ON profiles; -- Drop ours if re-running

-- 3. CREATE STRICT POLICIES

-- A. Public Read Access (Safe)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- B. Strict Update Access (The Fix)
-- This policy allows updates ONLY when the authenticated user's ID matches the row ID.
CREATE POLICY "Strict Self-Update Only"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- C. Strict Insert Access
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. DATA CLEANUP (Reset corrupted data)
-- The 'photo_url' column was corrupted by the bug. We reset it to NULL.
UPDATE profiles
SET photo_url = NULL;

-- (Optional) If you also have 'avatar_url', uncomment this:
-- UPDATE profiles SET avatar_url = NULL;

-- 5. VERIFICATION
-- After running this:
-- 1. Try to view profiles (should work for everyone).
-- 2. Try to update your OWN profile (should work).
-- 3. Try to update ANOTHER user's profile (should be blocked).
