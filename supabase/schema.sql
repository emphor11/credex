create table if not exists public.audits (
  slug text primary key,
  request jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  audit_slug text not null references public.audits(slug) on delete cascade,
  email text not null,
  company_name text,
  role text,
  team_size integer,
  high_savings boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leads_audit_slug_idx on public.leads(audit_slug);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

alter table public.audits enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Public audits are readable" on public.audits;
create policy "Public audits are readable"
  on public.audits for select
  using (true);

drop policy if exists "Service role writes audits" on public.audits;
create policy "Service role writes audits"
  on public.audits for insert
  with check (auth.role() = 'service_role');

drop policy if exists "Service role writes leads" on public.leads;
create policy "Service role writes leads"
  on public.leads for insert
  with check (auth.role() = 'service_role');
