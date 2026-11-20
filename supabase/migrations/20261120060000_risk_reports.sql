create table public.risk_reports (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null check (type in ('obstaculo', 'infraestructura', 'iluminacion', 'otro')),
  description text not null check (char_length(btrim(description)) between 10 and 500),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.risk_reports enable row level security;
revoke all on public.risk_reports from public, anon, authenticated;
grant select on public.risk_reports to authenticated;
grant insert (type, description, latitude, longitude) on public.risk_reports to authenticated;
create index risk_reports_author_idx on public.risk_reports(author_id);

create policy read_own_reports on public.risk_reports
  for select to authenticated using (author_id = (select auth.uid()));

create policy submit_own_pending_report on public.risk_reports
  for insert to authenticated with check (author_id = (select auth.uid()) and status = 'pending');
