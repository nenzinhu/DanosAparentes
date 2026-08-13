-- Webhooks outbound: integração com sistemas de outras empresas
-- Permite que uma empresa (tenant) registre endpoints que recebem eventos
-- de veículo assinados via HMAC-SHA256.

create table if not exists public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.companies(id) on delete cascade,
  url text not null,
  description text,
  secret_hash text not null,
  secret_raw text not null,            -- visível apenas no insert (server-only)
  events text[] not null default array[
    'vehicle.event.created','vehicle.inspection.created',
    'vehicle.damage.created','vehicle.report.created'
  ],
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_error_at timestamptz,
  constraint webhook_endpoints_url_check check (url ~* '^https://')
);

create index if not exists webhook_endpoints_tenant_idx
  on public.webhook_endpoints (tenant_id);

create table if not exists public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid not null references public.webhook_endpoints(id) on delete cascade,
  event_id text not null,
  event_type text not null,
  status integer not null,
  success boolean not null default false,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists webhook_deliveries_endpoint_idx
  on public.webhook_deliveries (endpoint_id, created_at desc);

-- RLS: ninguém acessa direto pelo cliente anônimo; leitura/escrita só via service role
alter table public.webhook_endpoints enable row level security;
alter table public.webhook_deliveries enable row level security;

-- policy no-op: acesso exclusivo por service role (server routes)
drop policy if exists webhook_endpoints_service on public.webhook_endpoints;
create policy webhook_endpoints_service on public.webhook_endpoints
  for all to service_role using (true) with check (true);

drop policy if exists webhook_deliveries_service on public.webhook_deliveries;
create policy webhook_deliveries_service on public.webhook_deliveries
  for all to service_role using (true) with check (true);
