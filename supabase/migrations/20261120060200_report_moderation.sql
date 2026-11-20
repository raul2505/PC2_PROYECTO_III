create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'cyclist' check (role in ('cyclist', 'moderator'))
);

alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
create policy read_own_profile on public.profiles for select to authenticated using (id = (select auth.uid()));

create function public.is_risk_moderator()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'moderator');
$$;

revoke execute on function public.is_risk_moderator() from public, anon, authenticated;
grant execute on function public.is_risk_moderator() to authenticated;

create policy moderator_reads_reports on public.risk_reports
  for select to authenticated using ((select public.is_risk_moderator()));

create index risk_reports_pending_date_idx on public.risk_reports(created_at desc) where status = 'pending';

create function public.review_risk_report(report_id uuid, decision text)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_risk_moderator() then
    raise exception 'Moderator role required' using errcode = '42501';
  end if;
  if decision is null or decision not in ('approved', 'rejected') then
    raise exception 'Invalid moderation decision' using errcode = '22023';
  end if;

  update public.risk_reports set status = decision where id = report_id and status = 'pending';
  return found;
end;
$$;

revoke execute on function public.review_risk_report(uuid, text) from public, anon, authenticated;
grant execute on function public.review_risk_report(uuid, text) to authenticated;
