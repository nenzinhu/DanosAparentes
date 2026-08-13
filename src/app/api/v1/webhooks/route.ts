/**
 * Gestão de webhook endpoints outbound (integração com outras empresas).
 * Apenas owner de empresa no plano Corporativo.
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateWebhookSecret } from '@/src/lib/server/webhooks'
import { getUserFromRequest } from '@/src/lib/server/auth'
import { resolveTenantContextForUser } from '@/src/lib/server/tenantScope'
import { supabaseAdmin } from '@/src/lib/server/supabaseAdmin'
import { hasActiveSubscriptionAccess } from '@/src/lib/subscriptionAccess'

const ALL_EVENTS = [
  'vehicle.event.created',
  'vehicle.inspection.created',
  'vehicle.damage.created',
  'vehicle.report.created',
]

async function isCorporate(userId: string): Promise<boolean> {
  if (!supabaseAdmin) return false
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('status, trial_ends_at, expires_at, plan_tier')
    .eq('user_id', userId)
    .maybeSingle()
  if (!data || data.plan_tier !== 'corporativo') return false
  return hasActiveSubscriptionAccess({
    status: data.status as string,
    trialEndsAt: data.trial_ends_at as string | null,
    expiresAt: data.expires_at as string | null,
  })
}

async function requireManager(req: NextRequest): Promise<
  { userId: string; companyId: string } | NextResponse
> {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 })
  if (!(await isCorporate(user.id))) {
    return NextResponse.json({ error: 'Recurso disponível apenas no plano Corporativo' }, { status: 403 })
  }
  const { role, tenantId } = await resolveTenantContextForUser(user.id)
  if (role !== 'owner' || !tenantId) {
    return NextResponse.json({ error: 'Apenas o gestor da empresa pode gerenciar webhooks' }, { status: 403 })
  }
  const { data: company } = await supabaseAdmin
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .eq('id', tenantId)
    .maybeSingle()
  if (!company?.id) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 403 })
  return { userId: user.id, companyId: company.id as string }
}

function normalizeEvents(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [...ALL_EVENTS]
  const evs = raw.filter((e): e is string => typeof e === 'string').filter((e) => ALL_EVENTS.includes(e))
  return evs.length > 0 ? [...new Set(evs)] : [...ALL_EVENTS]
}

export async function GET(req: NextRequest) {
  const authz = await requireManager(req)
  if (authz instanceof NextResponse) return authz
  const { data, error } = await supabaseAdmin!
    .from('webhook_endpoints')
    .select('id, url, description, events, active, created_at, last_error_at, secret_prefix')
    .eq('tenant_id', authz.companyId)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ webhooks: data || [] }, { status: 200 })
}

export async function POST(req: NextRequest) {
  const authz = await requireManager(req)
  if (authz instanceof NextResponse) return authz
  try {
    const body = await req.json().catch(() => ({}))
    const url = typeof body?.url === 'string' ? body.url.trim() : ''
    const description = typeof body?.description === 'string' ? body.description.trim().slice(0, 200) : null
    if (!/^https:\/\//i.test(url)) {
      return NextResponse.json({ error: 'url deve começar com https://' }, { status: 400 })
    }
    const { raw, prefix, hash } = generateWebhookSecret()
    const events = normalizeEvents(body?.events)
    const { data, error } = await supabaseAdmin!
      .from('webhook_endpoints')
      .insert({
        tenant_id: authz.companyId,
        url,
        description,
        secret_hash: hash,
        secret_raw: raw,
        secret_prefix: prefix,
        events,
      })
      .select('id, url, description, events, active, secret_prefix')
      .single()
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Falha ao criar webhook' }, { status: 500 })
    }
    // segredo exibido apenas uma vez
    return NextResponse.json({ webhook: data, secret: raw }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const authz = await requireManager(req)
  if (authz instanceof NextResponse) return authz
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })
  const { error } = await supabaseAdmin!
    .from('webhook_endpoints')
    .delete()
    .eq('id', id)
    .eq('tenant_id', authz.companyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 200 })
}
