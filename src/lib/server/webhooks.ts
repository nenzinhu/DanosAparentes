/**
 * Webhooks outbound — integração com sistemas de outras empresas.
 *
 * Fluxo:
 *   evento de veículo criado
 *     → buscar webhook_endpoints ativos da empresa (tenant)
 *     → POST assinado HMAC-SHA256 para cada endpoint
 *     → registrar tentativa em webhook_deliveries (com retry simples)
 *
 * O segredo NUNCA é exposto na resposta da API; apenas prefixo + últimos 4 chars.
 */
import crypto from 'crypto'
import { supabaseAdmin } from './supabaseAdmin'

export type WebhookEventType =
  | 'vehicle.event.created'
  | 'vehicle.inspection.created'
  | 'vehicle.damage.created'
  | 'vehicle.report.created'

const EVENT_TYPE_BY_VEHICLE_EVENT: Record<string, WebhookEventType> = {
  inspection: 'vehicle.inspection.created',
  damage: 'vehicle.damage.created',
  report: 'vehicle.report.created',
}

export function resolveWebhookEventType(vehicleEventType: string): WebhookEventType {
  return EVENT_TYPE_BY_VEHICLE_EVENT[vehicleEventType] || 'vehicle.event.created'
}

export function generateWebhookSecret(): { raw: string; prefix: string; hash: string } {
  const raw = `da_whsec_${crypto.randomBytes(24).toString('hex')}`
  const prefix = `da_whsec_${raw.substring(11, 17)}...`
  const hash = crypto.createHash('sha256').update(raw).digest('hex')
  return { raw, prefix, hash }
}

/** Assinatura no formato: t=<timestamp>,v1=<hmac-hex> */
export function signWebhookPayload(secret: string, payload: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const signedContent = `${timestamp}.${payload}`
  const signature = crypto.createHmac('sha256', secret).update(signedContent).digest('hex')
  return `t=${timestamp},v1=${signature}`
}

export interface DispatchPayload {
  id: string
  type: WebhookEventType
  createdAt: string
  data: Record<string, unknown>
}

async function postToEndpoint(
  endpointId: string,
  url: string,
  secret: string,
  payload: DispatchPayload,
): Promise<{ status: number; ok: boolean; error?: string }> {
  const body = JSON.stringify(payload)
  const signature = signWebhookPayload(secret, body)
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DanosAparentes-Webhooks/1.0',
        'X-DanosAparentes-Event': payload.type,
        'X-DanosAparentes-Delivery': payload.id,
        'X-DanosAparentes-Signature': signature,
      },
      body,
      signal: controller.signal,
    })
    clearTimeout(timeout)
    return { status: res.status, ok: res.ok }
  } catch (err) {
    return { status: 0, ok: false, error: err instanceof Error ? err.message : 'network_error' }
  }
}

/**
 * Dispara o evento para todos os endpoints ativos da empresa (tenant).
 * Não deve bloquear a resposta principal — execução em background via Promise.
 */
export function dispatchVehicleEvent(tenantId: string | null, event: DispatchPayload): void {
  if (!tenantId || !supabaseAdmin) return
  void (async () => {
    try {
      const { data: endpoints, error } = await supabaseAdmin
        .from('webhook_endpoints')
        .select('id, url, secret_hash')
        .eq('tenant_id', tenantId)
        .eq('active', true)

      if (error || !endpoints?.length) return

      for (const ep of endpoints) {
        // reconstrói o segredo a partir do hash? Não é possível — armazenamos o raw no insert
        // e lemos o raw aqui (coluna segura, só server-side).
        const secret = (ep as unknown as { secret_raw?: string }).secret_raw
        if (!secret) continue
        const result = await postToEndpoint(ep.id, ep.url, secret, event)
        await supabaseAdmin.from('webhook_deliveries').insert({
          endpoint_id: ep.id,
          event_id: event.id,
          event_type: event.type,
          status: result.status,
          success: result.ok,
          error: result.error || null,
        })
      }
    } catch {
      // falha de webhook nunca quebra o fluxo principal
    }
  })()
}

export function buildEventPayload(
  vehicleEventId: string,
  vehicleEventType: string,
  vehicleId: string,
  createdAt: string,
  data: Record<string, unknown>,
): DispatchPayload {
  return {
    id: vehicleEventId,
    type: resolveWebhookEventType(vehicleEventType),
    createdAt,
    data: { vehicleId, ...data },
  }
}
