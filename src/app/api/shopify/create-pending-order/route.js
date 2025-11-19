// src/app/api/shopify/create-pending-order/route.js
import { NextResponse } from 'next/server';
import { createShopifyOrderFromDLocal } from '@/lib/shopify-admin';

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/shopify/create-pending-order
 *
 * Cria pedido PENDING na Shopify ANTES do pagamento
 * Garante que pedido não seja perdido se popup fechar
 */
export async function POST(req) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   [PENDING-ORDER] 📝 API CALLED        ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    const body = await req.json();
    const { checkout_data, dlocal_payment_id } = body;

    if (!checkout_data) {
      return NextResponse.json({ error: 'checkout_data is required' }, { status: 400 });
    }

    if (!dlocal_payment_id) {
      return NextResponse.json({ error: 'dlocal_payment_id is required' }, { status: 400 });
    }

    console.log('[PENDING-ORDER] Payment ID:', dlocal_payment_id);
    console.log('[PENDING-ORDER] Items:', checkout_data.items?.length);

    // Calcular valores
    const arsRate = parseFloat(process.env.NEXT_PUBLIC_ARS_RATE || '1200');
    const subtotalArs = checkout_data.promotionalTotal || 0;
    const shippingCostArs = checkout_data.shippingCost || 0;
    const totalArs = subtotalArs + shippingCostArs;

    // Line items JÁ VÊM MAPEADOS corretamente do DLocalRedirectButton
    // Incluem: shopifyVariantId, variantId (GID), quantity, priceArs, attributes, etc.
    const lineItems = checkout_data.items;

    console.log('[PENDING-ORDER] ✅ Using pre-mapped line items from checkout_data');
    console.log('[PENDING-ORDER] First item example:', JSON.stringify(lineItems[0], null, 2));

    // Preparar tags
    let tags = ['dlocal', 'foltz', 'pending_payment', 'awaiting_payment'];
    if (checkout_data.hasPack) {
      tags.push('pack_foltz');
    }

    // Preparar note
    const discountArs = checkout_data.hasPack
      ? Math.round((checkout_data.promotionalSavings || 0) * arsRate)
      : 0;

    let note = `⏳ PENDING Payment - Awaiting customer payment via dlocal Go.\n`;
    note += `⚠️ DO NOT SHIP until payment is confirmed!\n\n`;
    note += `Payment ID: ${dlocal_payment_id}\n`;
    note += `Status: PENDING\n`;
    note += `Payment Method: dlocal Go (Card, Cash, or Transfer)\n`;
    note += `Amount: ARS $${totalArs.toLocaleString('es-AR')}\n`;

    if (checkout_data.hasPack && discountArs > 0) {
      note += `Promo: PACK FOLTZ - Ahorro: ARS $${discountArs.toLocaleString('es-AR')}\n`;
    }

    note += `Envío: ARS $${shippingCostArs.toLocaleString('es-AR')} (${checkout_data.shippingMethodName || 'Correo Argentino'})\n`;
    note += `\n💡 This order was created BEFORE payment to prevent data loss.\n`;
    note += `Order will be automatically updated to PAID when payment is confirmed.\n`;

    // Criar pedido PENDING na Shopify
    try {
      const shopifyOrder = await createShopifyOrderFromDLocal({
        email: checkout_data.customer.email,
        lineItems,
        shippingAddress: {
          firstName: checkout_data.shipping.firstName,
          lastName: checkout_data.shipping.lastName,
          address1: checkout_data.shipping.address1,
          address2: checkout_data.shipping.address2,
          city: checkout_data.shipping.city,
          province: checkout_data.shipping.province,
          zip: checkout_data.shipping.zip,
          country: checkout_data.shipping.country,
          phone: checkout_data.shipping.phone || '',
        },
        customer: {
          email: checkout_data.customer.email,
          firstName: checkout_data.shipping.firstName,
          lastName: checkout_data.shipping.lastName,
          phone: checkout_data.shipping.phone || '',
        },
        dlocalPaymentId: dlocal_payment_id,
        dlocalStatus: 'PENDING',
        totalAmount: totalArs,
        currency: 'ARS',
        paymentMethod: 'dlocal Go',
        note,
        tags: tags.join(','),
        trackingData: checkout_data.trackingData || {},
        shippingCostArs,
        shippingMethod: checkout_data.shippingMethod || 'standard',
        shippingMethodName: checkout_data.shippingMethodName || 'Correo Argentino',
      });

      console.log('[PENDING-ORDER] ✅ Order created:', shopifyOrder.name);

      return NextResponse.json({
        success: true,
        shopify_order: {
          id: shopifyOrder.id,
          orderNumber: shopifyOrder.orderNumber,
          name: shopifyOrder.name,
          email: shopifyOrder.email,
          totalPrice: shopifyOrder.totalPrice,
          createdAt: shopifyOrder.createdAt,
        },
        amounts: {
          subtotalArs,
          shippingCostArs,
          totalArs,
          discountArs,
        },
        message: 'Pedido PENDIENTE criado com sucesso na Shopify!',
      });

    } catch (shopifyError) {
      console.error('[PENDING-ORDER] ❌ Shopify error:', shopifyError);

      return NextResponse.json({
        success: false,
        error: 'Failed to create PENDING Shopify order',
        details: shopifyError.message,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[PENDING-ORDER] ❌ ERROR:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to create PENDING order',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
