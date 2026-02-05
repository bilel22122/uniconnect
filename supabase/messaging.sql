-- Create conversations table
create table conversations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references profiles(id) not null,
  student_id uuid references profiles(id) not null,
  created_at timestamp with time zone default now(),
  constraint conversations_company_id_student_id_key unique (company_id, student_id)
);

-- Enable RLS for conversations
alter table conversations enable row level security;

-- Create messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for messages
alter table messages enable row level security;

-- Policies for conversations

-- Users can VIEW their own conversations
create policy "Users can view their own conversations"
  on conversations for select
  using (
    auth.uid() = company_id or auth.uid() = student_id
  );

-- Only Companies can INSERT (create) a new conversation
-- Assumes the authenticated user is the company starting the chat
create policy "Companies can insert conversations"
  on conversations for insert
  with check (
    auth.uid() = company_id
  );

-- Policies for messages

-- Users can VIEW messages if they belong to the conversation
create policy "Users can view messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.company_id = auth.uid() or c.student_id = auth.uid())
    )
  );

-- Users can INSERT messages if they belong to the conversation
create policy "Users can insert messages in their conversations"
  on messages for insert
  with check (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.company_id = auth.uid() or c.student_id = auth.uid())
    )
    and auth.uid() = sender_id
  );
