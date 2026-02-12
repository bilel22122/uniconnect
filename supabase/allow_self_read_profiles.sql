-- Allow users to view their own profile (for login, etc.)
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO public
USING (
    auth.uid() = id
);
