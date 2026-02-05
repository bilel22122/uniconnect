-- Add is_read column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Policy to allow users to update messages if they are part of the conversation
-- This is needed so users can mark messages as read
CREATE POLICY "Users can mark messages as read"
ON messages
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id
    AND (c.student_id = auth.uid() OR c.company_id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id
    AND (c.student_id = auth.uid() OR c.company_id = auth.uid())
  )
);
