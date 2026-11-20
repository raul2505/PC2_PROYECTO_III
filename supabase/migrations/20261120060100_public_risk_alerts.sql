create index risk_reports_approved_date_idx on public.risk_reports(created_at desc) where status = 'approved';

create function public.list_public_risk_reports()
returns table (id uuid, type text, latitude double precision, longitude double precision, created_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select r.id, r.type, round(r.latitude::numeric, 3)::double precision,
    round(r.longitude::numeric, 3)::double precision, r.created_at
  from public.risk_reports r
  where r.status = 'approved'
  order by r.created_at desc
  limit 100;
$$;

revoke execute on function public.list_public_risk_reports() from public, anon, authenticated;
grant execute on function public.list_public_risk_reports() to anon, authenticated;
