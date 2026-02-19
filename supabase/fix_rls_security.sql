-- Fix RLS Policies for Profiles Table
-- CRITICAL: Prevent users from updating other users' profiles

-- 1. Enable RLS to be sure
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing loose policies that might allow unauthorized updates
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles; -- Re-creating this to be safe

-- 3. Re-establish Read Access (Public)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 4. Create STRICT Update Policy
-- Only allow updates where the user's auth ID matches the profile ID
CREATE POLICY "Users can only update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Create Insert Policy (if missing/needed)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Note: Admin policies are separate and should be created in setup_admin.sql if needed.
