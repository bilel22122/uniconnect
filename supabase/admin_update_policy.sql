-- Allow Admins to update ANY profile
-- This is required for the Verification System and other admin actions.
-- The verification column itself is protected by a Trigger, so even with this policy,
-- admins still need to pass the trigger check (which they do).

CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
    -- Check if the current user is an admin
    -- We can check the 'is_admin' column of the current user's profile
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
)
WITH CHECK (
    -- Ensure the user remains an admin after update (sanity check)
    -- and basically just re-validates the permission
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
