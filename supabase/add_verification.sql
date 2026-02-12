-- 1. Add 'is_verified' column to 'profiles' table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. Protect 'is_verified' column from unauthorized updates
-- Even if a user has permission to update their own profile (e.g., name, avatar),
-- they should NOT be able to change 'is_verified'.
-- We use a Trigger to enforce this at the database level.

CREATE OR REPLACE FUNCTION protect_verification_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if 'is_verified' is being changed
    IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
        -- Check if the user is an admin
        -- We use a SECURITY DEFINER query to check admin status safely
        IF NOT EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = TRUE
        ) THEN
            RAISE EXCEPTION 'Only admins can change verification status.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach the trigger to the profiles table
DROP TRIGGER IF EXISTS on_profile_verification_update ON profiles;

CREATE TRIGGER on_profile_verification_update
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_verification_column();
