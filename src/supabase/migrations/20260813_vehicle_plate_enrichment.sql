-- Enriquecimento do histórico do veículo via consulta de placa:
-- logo da marca, modelo/submodelo/versão, ano do modelo e resumo FIPE público.

alter table public.vehicles
  add column if not exists submodel text,
  add column if not exists version text,
  add column if not exists model_year integer,
  add column if not exists logo_url text,
  add column if not exists fipe_public jsonb;

comment on column public.vehicles.logo_url is 'URL do logo da marca vinda da API de placas';
comment on column public.vehicles.fipe_public is 'Resumo FIPE público (sem códigos internos)';
comment on column public.vehicles.model_year is 'Ano do modelo informado pela consulta de placa';
comment on column public.vehicles.submodel is 'Submodelo do veículo';
comment on column public.vehicles.version is 'Versão/acao do veículo';
