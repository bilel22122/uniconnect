-- Drop existing insert policy to avoid conflicts
DROP POLICY IF EXISTS "Insert notifications" ON notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON notifications;

-- Create new policy allowing any authenticated user to create a notification
-- This is necessary for companies to notify students and vice versa
CREATE POLICY "Anyone can create notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);
