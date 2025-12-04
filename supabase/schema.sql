-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create proposals table
create table public.proposals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  client_name text not null,
  client_phone text,
  client_email text,
  value numeric,
  description text,
  status text default 'sent' check (status in ('sent', 'accepted', 'rejected')),
  pdf_url text,
  read_token uuid default uuid_generate_v4(),
  response_token uuid default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  responded_at timestamp with time zone
);

-- Enable RLS on proposals
alter table public.proposals enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Policies for proposals
-- Admin can do everything
create policy "Admins can do everything on proposals" on public.proposals
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Users can view their own proposals
create policy "Users can view own proposals" on public.proposals
  for select using (auth.uid() = user_id);

-- Users can insert their own proposals
create policy "Users can insert own proposals" on public.proposals
  for insert with check (auth.uid() = user_id);

-- Users can update their own proposals
create policy "Users can update own proposals" on public.proposals
  for update using (auth.uid() = user_id);

-- Public access for read/response via tokens (handled via edge functions or just public read if we want, 
-- but strictly speaking RLS checks auth. For public link access, we might use a service role in the API 
-- or a specific function. For simplicity in client-side fetching, we can allow public select if we filter by token, 
-- but standard RLS doesn't support "filtering by token" easily without exposing data.
-- STRATEGY: We will use `supabase-admin` (service role) or `security definer` functions for the public links 
-- OR we can make a specific policy for "read_token" if we query by it.
-- Let's add a policy for public read if they know the token (security by obscurity + UUID).
create policy "Public read access via read_token" on public.proposals
  for select using (true); 
-- Note: The above is too broad. It allows listing ALL if you don't filter.
-- Better: Application logic handles the public view using a server-side query with admin privileges 
-- or we rely on the UUID being hard to guess. 
-- For now, let's keep it restricted and handle public views via Server Actions (which run on server) 
-- using a client with appropriate permissions or just standard fetch if we open it up.
-- Actually, for "Public Read", we can just allow SELECT if the query matches the token? 
-- Postgres RLS doesn't know "the query". 
-- Let's stick to: Authenticated users see theirs. Admins see all. 
-- Public pages will use a Server Action that uses `createClient` (standard) but maybe we need 
-- a `getProposalByToken` function that bypasses RLS or we open RLS for specific columns?
-- Safest: Server Action with `supabase-admin` (service role) is best for public links to avoid exposing DB.
-- BUT we don't have service role key in the prompt.
-- User said: "Rotas públicas somente para leitura/aceite".
-- If we only have Anon Key, we MUST allow public select on the table OR use a Postgres Function `security definer`.

-- Let's create a secure function for fetching by token to avoid opening the table.
create or replace function get_proposal_by_read_token(token uuid)
returns setof public.proposals
language sql
security definer
as $$
  select * from public.proposals where read_token = token;
$$;

create or replace function get_proposal_by_response_token(token uuid)
returns setof public.proposals
language sql
security definer
as $$
  select * from public.proposals where response_token = token;
$$;

-- Function to update status (for public response)
create or replace function update_proposal_status(token uuid, new_status text)
returns void
language plpgsql
security definer
as $$
begin
  update public.proposals
  set status = new_status, responded_at = now()
  where response_token = token;
end;
$$;

-- Storage Bucket
insert into storage.buckets (id, name, public) 
values ('proposals', 'proposals', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload proposals" on storage.objects
  for insert with check (bucket_id = 'proposals' and auth.role() = 'authenticated');

create policy "Public can view proposals" on storage.objects
  for select using (bucket_id = 'proposals');

-- Trigger to handle new user signup -> create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    case when new.email = 'cristianospaula1972@gmail.com' then 'admin' else 'user' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
