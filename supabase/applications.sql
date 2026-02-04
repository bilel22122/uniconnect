-- Create the 'applications' table
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid not null references public.jobs(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text default 'pending' not null,
  created_at timestamp with time zone default now() not null,
  -- Ensure a student can only apply to a specific job once
  unique(job_id, student_id)
);

-- Enable Row Level Security (RLS)
alter table public.applications enable row level security;

-- Policy 1: Student Apply
-- Users can insert their own applications
create policy "Students can insert their own applications"
on public.applications for insert
to authenticated
with check (auth.uid() = student_id);

-- Policy 2: Student View Own
-- Students should probably be able to see their own applications
create policy "Students can view their own applications"
on public.applications for select
to authenticated
using (auth.uid() = student_id);

-- Policy 3: Company View
-- Companies can view applications ONLY if they own the related job
create policy "Companies can view applications for their jobs"
on public.applications for select
to authenticated
using (
  exists (
    select 1 from public.jobs
    where jobs.id = applications.job_id
    and jobs.company_id = auth.uid()
  )
);

-- Policy 4: Company Update
-- Companies can update status (e.g. accept/reject) if they own the job
create policy "Companies can update applications for their jobs"
on public.applications for update
to authenticated
using (
  exists (
    select 1 from public.jobs
    where jobs.id = applications.job_id
    and jobs.company_id = auth.uid()
  )
);
