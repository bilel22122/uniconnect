-- Create the 'jobs' table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  company_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text,
  job_type text,
  salary_range text,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.jobs enable row level security;

-- Policy 1: Public Read
-- Allow all authenticated users to view jobs
create policy "Allow authenticated users to view jobs"
on public.jobs for select
to authenticated
using (true);

-- Policy 2: Company Post
-- Allow users to insert jobs ONLY IF their profile role is 'company'
-- We verify that the user inserting is the one in company_id AND they have the correct role.
create policy "Allow companies to insert jobs"
on public.jobs for insert
to authenticated
with check (
  auth.uid() = company_id
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and lower(role) = 'company'
  )
);

-- Optional: Allow companies to update/delete their OWN jobs
create policy "Allow companies to update their own jobs"
on public.jobs for update
to authenticated
using (auth.uid() = company_id);

create policy "Allow companies to delete their own jobs"
on public.jobs for delete
to authenticated
using (auth.uid() = company_id);
