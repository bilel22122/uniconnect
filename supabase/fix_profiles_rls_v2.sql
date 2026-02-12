-- Allow users to read their own profile row.
-- This applies to all users (authenticated) who match the ID.
CREATE POLICY "Users can see their own profile"
ON profiles
FOR SELECT
TO public
USING (
    auth.uid() = id
);
