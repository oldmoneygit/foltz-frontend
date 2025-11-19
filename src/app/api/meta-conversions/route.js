import { NextResponse } from 'next/server'

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN
const API_VERSION = 'v21.0'

/**
 * Conversions API - Server-Side Tracking
 * Recebe eventos do client e envia para Facebook
 * 100% delivery (não bloqueável por AdBlockers)
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      eventName,
      eventData,
      eventId,
      fbc,
      fbp,
      userData = {},
      eventTime,
      sourceUrl,
      userAgent,
    } = body

    // Validar parâmetros obrigatórios
    if (!eventName || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields: eventName, eventId' },
        { status: 400 }
      )
    }

    // Extrair IP real do cliente (Vercel forwarded headers)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null

    // Preparar user_data conforme spec do Facebook
    const user_data = {
      // Dados do servidor (NÃO hasheados)
      ...(clientIp && { client_ip_address: clientIp }),
      ...(userAgent && { client_user_agent: userAgent }),

      // Facebook IDs (NÃO hasheados)
      ...(fbc && { fbc }),
      ...(fbp && { fbp }),
    }

    // Adicionar dados hasheados do client (já vêm como ARRAYS)
    if (userData.em) user_data.em = Array.isArray(userData.em) ? userData.em : [userData.em]
    if (userData.ph) user_data.ph = Array.isArray(userData.ph) ? userData.ph : [userData.ph]
    if (userData.fn) user_data.fn = Array.isArray(userData.fn) ? userData.fn : [userData.fn]
    if (userData.ln) user_data.ln = Array.isArray(userData.ln) ? userData.ln : [userData.ln]
    if (userData.ct) user_data.ct = Array.isArray(userData.ct) ? userData.ct : [userData.ct]
    if (userData.st) user_data.st = Array.isArray(userData.st) ? userData.st : [userData.st]
    if (userData.zp) user_data.zp = Array.isArray(userData.zp) ? userData.zp : [userData.zp]
    if (userData.country) user_data.country = Array.isArray(userData.country) ? userData.country : [userData.country]

    // Preparar payload para Conversions API
    const eventPayload = {
      event_name: eventName,
      event_time: eventTime || Math.floor(Date.now() / 1000),
      event_id: eventId, // CRÍTICO: Mesmo ID do Pixel!
      event_source_url: sourceUrl || 'https://foltzoficial.com',
      action_source: 'website',
      user_data,
      custom_data: eventData,
    }

    console.log(`📤 [Conversions API] Sending ${eventName}:`, {
      eventId,
      hasUserData: Object.keys(user_data).length > 2,
      hasFbc: !!fbc,
      hasFbp: !!fbp,
    })

    // Enviar para Facebook Conversions API
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
      console.error('❌ [Conversions API] Error:', result)
      return NextResponse.json(
        { error: 'Conversions API error', details: result },
        { status: response.status }
      )
    }

    console.log(`✅ [Conversions API] ${eventName} sent successfully:`, {
      eventsReceived: result.events_received,
      fbtrace_id: result.fbtrace_id,
    })

    return NextResponse.json({
      success: true,
      eventsReceived: result.events_received,
      fbtrace_id: result.fbtrace_id,
    })
  } catch (error) {
    console.error('❌ [Conversions API] Route error:', error)
    return NextResponse.json(
      { error: 'Server error', message: error.message },
      { status: 500 }
    )
  }
}
