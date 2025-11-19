import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN
const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET
const API_VERSION = 'v21.0'

/**
 * Verifica autenticidade do webhook da Shopify (HMAC)
 */
function verifyWebhook(rawBody, hmacHeader) {
  if (!WEBHOOK_SECRET || !hmacHeader) return false

  const hash = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64')

  return hash === hmacHeader
}

/**
 * Hash SHA-256 de um valor (server-side)
 */
function hashValue(value) {
  if (!value) return null
  const normalized = String(value).toLowerCase().trim()
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

/**
 * Formata telefone: apenas números
 */
function formatPhone(phone) {
  if (!phone) return null
  return phone.replace(/[^0-9]/g, '')
}

/**
 * Shopify Webhook Handler - Purchase Events
 * Recebe webhook quando pedido é criado
 * Envia Purchase event para Conversions API
 */
export async function POST(request) {
  try {
    // 1. Ler body raw para verificação HMAC
    const rawBody = await request.text()
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256')

    // 2. Verificar autenticidade (prevenir fake webhooks)
    if (!verifyWebhook(rawBody, hmacHeader)) {
      console.error('❌ [Shopify Webhook] HMAC verification failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. Parse do pedido
    const order = JSON.parse(rawBody)

    console.log(`📦 [Shopify Webhook] Order received:`, {
      orderId: order.order_number,
      email: order.email,
      total: order.total_price,
      currency: order.currency,
    })

    // 4. Extrair dados do cliente
    const customer = order.customer || {}
    const billing = order.billing_address || {}
    const shipping = order.shipping_address || {}

    // 5. Preparar userData (hasheado em ARRAYS)
    const userData = {}

    if (order.email) {
      userData.em = [hashValue(order.email)]
    }

    const phone = billing.phone || shipping.phone || customer.phone
    if (phone) {
      const cleanPhone = formatPhone(phone)
      if (cleanPhone) {
        userData.ph = [hashValue(cleanPhone)]
      }
    }

    const firstName = billing.first_name || shipping.first_name || customer.first_name
    const lastName = billing.last_name || shipping.last_name || customer.last_name

    if (firstName) userData.fn = [hashValue(firstName)]
    if (lastName) userData.ln = [hashValue(lastName)]

    // Endereço
    const city = billing.city || shipping.city
    const province = billing.province || shipping.province
    const zip = billing.zip || shipping.zip
    const country = billing.country_code || shipping.country_code

    if (city) userData.ct = [hashValue(city)]
    if (province) userData.st = [hashValue(province)]
    if (zip) userData.zp = [hashValue(zip)]
    if (country) userData.country = [hashValue(country)]

    // External ID
    if (customer.id) {
      userData.external_id = [customer.id.toString()]
    }

    // IP do browser (se disponível)
    if (order.browser_ip) {
      userData.client_ip_address = order.browser_ip
    }

    // 6. Preparar custom_data
    const customData = {
      currency: order.currency || 'ARS',
      value: parseFloat(order.total_price),
      content_ids: order.line_items.map(item => item.product_id?.toString() || item.sku),
      content_type: 'product',
      contents: order.line_items.map(item => ({
        id: item.product_id?.toString() || item.sku,
        quantity: item.quantity,
        item_price: parseFloat(item.price),
      })),
      num_items: order.line_items.reduce((total, item) => total + item.quantity, 0),
      order_id: order.order_number?.toString(),
    }

    // 7. Gerar event_id único
    const eventId = `Purchase_${order.id}_${Date.now()}`

    // 8. Preparar payload
    const eventPayload = {
      event_name: 'Purchase',
      event_time: Math.floor(new Date(order.created_at).getTime() / 1000),
      event_id: eventId,
      event_source_url: order.order_status_url || 'https://foltzoficial.com',
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    }

    console.log(`📤 [Shopify Webhook] Sending Purchase to Conversions API:`, {
      eventId,
      orderId: order.order_number,
      value: customData.value,
      hasUserData: Object.keys(userData).length,
    })

    // 9. Enviar para Conversions API
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [eventPayload],
          access_token: ACCESS_TOKEN,
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ [Shopify Webhook] Conversions API error:', result)
      return NextResponse.json(
        { error: 'Conversions API error', details: result },
        { status: response.status }
      )
    }

    console.log(`✅ [Shopify Webhook] Purchase sent successfully:`, {
      eventId,
      orderId: order.order_number,
      eventsReceived: result.events_received,
      fbtrace_id: result.fbtrace_id,
    })

    return NextResponse.json({
      success: true,
      eventId,
      orderId: order.order_number,
      eventsReceived: result.events_received,
      fbtrace_id: result.fbtrace_id,
    })
  } catch (error) {
    console.error('❌ [Shopify Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}
