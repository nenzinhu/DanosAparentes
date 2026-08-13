import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, getUserFromRequest, userHasActiveSubscription } from '@/src/lib/server/auth';
import { checkRateLimit } from '@/src/lib/server/rateLimit';
import { sanitizePlateLookupPayload, extractPlateEnrichment } from '@/src/lib/plateLookup/fipePublic';
import { supabaseAdmin } from '@/src/lib/server/supabaseAdmin';

// Placas brasileiras: formato antigo (ABC1234) ou Mercosul (ABC1D23).
const PLATE_REGEX = /^[A-Z]{3}\d[A-Z\d]\d{2}$/;

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const hasAccess = await userHasActiveSubscription(user.id);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Assinatura necessária para consultar placas' }, { status: 403 });
  }

  const ip = getClientIp(req);
  const { allowed, retryAfterSec } = await checkRateLimit(`plate-lookup:${user.id}:${ip}`, 30, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em instantes.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    );
  }

  const plate = (req.nextUrl.searchParams.get('plate') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!PLATE_REGEX.test(plate)) {
    return NextResponse.json({ error: 'Placa inválida' }, { status: 400 });
  }

  const token = process.env.WDAPI_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Consulta de placas não configurada' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://wdapi2.com.br/consulta/${plate}/${token}`);
    if (!res.ok) {
      return NextResponse.json({ error: `Erro na consulta (HTTP ${res.status})` }, { status: 502 });
    }
    const data = await res.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Resposta inválida da consulta' }, { status: 502 });
    }

    // Enriquecimento do histórico do veículo (logo/marca/modelo/FIPE) — best-effort
    const enrichment = extractPlateEnrichment(data as Record<string, unknown>);
    if (supabaseAdmin && (enrichment.brand || enrichment.model || enrichment.logoUrl || enrichment.fipePublic)) {
      const patchRow: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (enrichment.brand) patchRow.brand = enrichment.brand;
      if (enrichment.model) patchRow.model = enrichment.model;
      if (enrichment.submodel) patchRow.submodel = enrichment.submodel;
      if (enrichment.version) patchRow.version = enrichment.version;
      if (enrichment.modelYear != null) patchRow.model_year = enrichment.modelYear;
      if (enrichment.logoUrl) patchRow.logo_url = enrichment.logoUrl;
      if (enrichment.fipePublic) patchRow.fipe_public = enrichment.fipePublic;
      void supabaseAdmin
        .from('vehicles')
        .update(patchRow)
        .eq('user_id', user.id)
        .eq('plate', plate);
    }

    // FIPE bruto (códigos internos) não sai para o cliente — só resumo público.
    return NextResponse.json(sanitizePlateLookupPayload(data as Record<string, unknown>));
  } catch (err) {
    console.error('Erro na consulta de placa:', err);
    return NextResponse.json({ error: 'Erro ao consultar a placa' }, { status: 500 });
  }
}
