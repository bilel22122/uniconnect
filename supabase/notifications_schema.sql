-- 1. Create the notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table public.notifications enable row level security;

-- 3. Create RLS Policies

-- Policy: Users can only view their own notifications
create policy "Users can view own notifications"
on public.notifications for select
using ( auth.uid() = user_id );

-- Optional: Allow system/service_role to insert notifications (no policy needed for service_role usually, but good to be explicit if using client-side inserts in some edge cases, usually inserts happen via server actions/triggers)
-- For now, we stick to the requested SELECT policy.

-- Create an index on user_id for faster lookups since we filter by it frequently
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);
