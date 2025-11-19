// src/app/api/dlocal/create-payment/route.js
import { NextResponse } from 'next/server';
import { createPayment } from '@/lib/dlocal';

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/dlocal/create-payment
 *
 * Cria pagamento na dlocal Go
 * Retorna redirect_url para abrir popup
 */
export async function POST(req) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   [CREATE-PAYMENT] 🚀 API CALLED      ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    const body = await req.json();
    const { checkout_data } = body;

    if (!checkout_data) {
      return NextResponse.json(
        { error: 'checkout_data is required' },
        { status: 400 }
      );
    }

    console.log('[CREATE-PAYMENT] Items:', checkout_data.items?.length);
    console.log('[CREATE-PAYMENT] Has Pack:', checkout_data.hasPack);
    console.log('[CREATE-PAYMENT] Total ARS:', checkout_data.promotionalTotal);

    // Validações
    if (!checkout_data.customer?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!checkout_data.customer?.document) {
      return NextResponse.json({ error: 'Document (DNI/CUIT) is required' }, { status: 400 });
    }

    if (!checkout_data.shipping?.firstName || !checkout_data.shipping?.lastName) {
      return NextResponse.json({ error: 'Shipping name is required' }, { status: 400 });
    }

    if (!checkout_data.shipping?.address1 || !checkout_data.shipping?.city) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    // Calcular valores
    const subtotalArs = checkout_data.promotionalTotal || 0;
    const shippingCostArs = checkout_data.shippingCost || 0;
    const totalArs = subtotalArs + shippingCostArs;

    console.log('[CREATE-PAYMENT] 💰 Amounts:');
    console.log('[CREATE-PAYMENT]   Subtotal:', subtotalArs);
    console.log('[CREATE-PAYMENT]   Shipping:', shippingCostArs);
    console.log('[CREATE-PAYMENT]   Total:', totalArs);

    // Preparar payer information
    console.log('[CREATE-PAYMENT] 👤 Preparing payer information...');

    const payer = {
      name: `${checkout_data.shipping?.firstName || ''} ${checkout_data.shipping?.lastName || ''}`.trim(),
      email: checkout_data.customer.email,
      document: checkout_data.customer.document,
    };

    // Adicionar endereço se disponível
    if (checkout_data.shipping) {
      payer.address = {
        state: checkout_data.shipping.province || checkout_data.shipping.city,
        city: checkout_data.shipping.city,
        zip_code: checkout_data.shipping.zip,
        full_address: `${checkout_data.shipping.address1}${checkout_data.shipping.address2 ? ', ' + checkout_data.shipping.address2 : ''}`,
      };
    }

    console.log('[CREATE-PAYMENT] Payer:', payer);

    // Preparar URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const webhookUrl = process.env.DLOCAL_WEBHOOK_URL || `${baseUrl}/api/dlocal/webhook`;
    const successUrl = `${baseUrl}/checkout/success`;
    const backUrl = `${baseUrl}/carrito`;

    // Preparar description
    const itemCount = checkout_data.items?.length || 0;
    const description = checkout_data.hasPack
      ? `FOLTZ - ${itemCount} producto(s) - PACK FOLTZ (Ahorro: AR$ ${Math.round(checkout_data.promotionalSavings || 0)})`
      : `FOLTZ - ${itemCount} producto(s)`;

    // Gerar order ID único
    const orderId = `FOLTZ-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Preparar metadata
    const metadata = {
      source: 'foltz_argentina',
      has_pack_promo: checkout_data.hasPack || false,
      shipping_method: checkout_data.shippingMethod,
      shipping_cost_ars: shippingCostArs.toString(),
      subtotal_ars: subtotalArs.toString(),
      total_ars: totalArs.toString(),
      item_count: itemCount.toString(),
      checkout_data: JSON.stringify(checkout_data),
      ...(checkout_data.trackingData && {
        utm_source: checkout_data.trackingData.utmSource,
        utm_medium: checkout_data.trackingData.utmMedium,
        utm_campaign: checkout_data.trackingData.utmCampaign,
        session_id: checkout_data.trackingData.sessionId,
      }),
    };

    console.log('[CREATE-PAYMENT] 🌐 Calling dlocal API...');

    // Criar pagamento na dlocal
    const dlocalPayment = await createPayment({
      amount: Math.round(totalArs),
      currency: 'ARS',
      country: 'AR',
      orderId,
      payer,
      description,
      notificationUrl: webhookUrl,
      successUrl,
      backUrl,
      metadata,
    });

    console.log('[CREATE-PAYMENT] ✅ Payment created:', dlocalPayment.id);

    // Retornar para frontend
    return NextResponse.json({
      success: true,
      payment_id: dlocalPayment.id,
      redirect_url: dlocalPayment.redirect_url,
      status: dlocalPayment.status,
      amount: {
        ars: totalArs,
        decimal: totalArs,
      },
      metadata: {
        hasPack: checkout_data.hasPack,
        shippingMethod: checkout_data.shippingMethod,
      },
    });

  } catch (error) {
    console.error('\n[CREATE-PAYMENT] ❌ ERROR:', error);
    console.error('[CREATE-PAYMENT] Stack:', error.stack);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create payment',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
