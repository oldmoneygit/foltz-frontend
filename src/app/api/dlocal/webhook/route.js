// src/app/api/dlocal/webhook/route.js
import { NextResponse } from 'next/server';
import {
  validateWebhookSignature,
  retrievePayment,
  isPaymentSuccessful,
} from '@/lib/dlocal';
import { updateShopifyOrderStatus } from '@/lib/shopify-admin';

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/dlocal/webhook
 *
 * Recebe webhooks da dlocal quando pagamento é confirmado
 * Atualiza pedido PENDING → PAID na Shopify
 */
export async function POST(req) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   [WEBHOOK] 📨 RECEIVED                ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    // Get raw body for signature validation
    const bodyText = await req.text();
    let body;

    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      console.error('[WEBHOOK] Invalid JSON');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Get signature
    const signature = req.headers.get('X-Signature') || req.headers.get('x-signature');

    if (!signature) {
      console.error('[WEBHOOK] Missing signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    console.log('[WEBHOOK] Event:', body.event);
    console.log('[WEBHOOK] Payment ID:', body.data?.id);

    // Validate signature (security)
    const isValid = validateWebhookSignature(bodyText, signature);

    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Extract payment ID
    const paymentId = body.data?.id || body.payment_id;

    if (!paymentId) {
      console.error('[WEBHOOK] No payment ID');
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 });
    }

    // Retrieve full payment details
    const payment = await retrievePayment(paymentId);

    console.log('[WEBHOOK] Payment status:', payment.status);

    // Se pagamento foi confirmado
    if (isPaymentSuccessful(payment.status)) {
      console.log('[WEBHOOK] ✅ Payment PAID! Searching for order...');

      // Buscar pedido na Shopify pelo payment ID
      try {
        const searchResponse = await fetch(
          `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/orders.json?status=any&limit=50`,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
              'Content-Type': 'application/json',
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const existingOrder = searchData.orders?.find(order =>
            order.note && order.note.includes(`Payment ID: ${payment.id}`)
          );

          if (existingOrder) {
            console.log('[WEBHOOK] 📦 Found order:', existingOrder.id);
            console.log('[WEBHOOK] 🔄 Updating PENDING → PAID...');

            // Atualizar pedido
            const updatedOrder = await updateShopifyOrderStatus(existingOrder.id, {
              dlocalPaymentId: payment.id,
              dlocalStatus: payment.status,
              paymentMethod: payment.payment_method_type || 'Card',
            });

            console.log('[WEBHOOK] ✅ Order updated successfully!');

            return NextResponse.json({
              success: true,
              message: 'Order updated from PENDING to PAID',
              payment_id: payment.id,
              shopify_order_id: updatedOrder.id,
              order_number: updatedOrder.orderNumber,
              order_name: updatedOrder.name,
              financial_status: updatedOrder.financialStatus,
            });
          } else {
            console.error('[WEBHOOK] ⚠️  Order not found for payment:', payment.id);
          }
        }
      } catch (searchError) {
        console.error('[WEBHOOK] ❌ Error searching for order:', searchError);
      }

      // Se chegou aqui, pedido não foi encontrado
      console.error('\n╔════════════════════════════════════════╗');
      console.error('║   [WEBHOOK] ⚠️  ORDER NOT FOUND        ║');
      console.error('╚════════════════════════════════════════╝');
      console.error('[WEBHOOK] Payment ID:', payment.id);
      console.error('[WEBHOOK] Customer Email:', payment.payer?.email || 'N/A');
      console.error('[WEBHOOK] Amount:', payment.amount, payment.currency);
      console.error('[WEBHOOK] ⚠️  Manual action required!');

      return NextResponse.json({
        success: false,
        warning: 'Payment PAID but order not found in Shopify',
        payment_id: payment.id,
        status: payment.status,
        action_required: 'MANUAL ORDER CREATION',
        customer_email: payment.payer?.email || null,
        amount: payment.amount,
        currency: payment.currency,
      });
    }

    // Outros status (PENDING, REJECTED, etc)
    console.log('[WEBHOOK] Status:', payment.status, '- No action needed');

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
      payment_id: payment.id,
      status: payment.status,
    });

  } catch (error) {
    console.error('[WEBHOOK] ❌ ERROR:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Webhook processing failed',
    }, { status: 500 });
  }
}

/**
 * GET /api/dlocal/webhook
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'dlocal webhook endpoint is ready',
    timestamp: new Date().toISOString(),
  });
}
