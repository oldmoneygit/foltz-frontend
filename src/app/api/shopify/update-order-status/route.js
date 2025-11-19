// src/app/api/shopify/update-order-status/route.js
import { NextResponse } from 'next/server';
import { retrievePayment } from '@/lib/dlocal';
import { updateShopifyOrderStatus } from '@/lib/shopify-admin';

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/shopify/update-order-status
 *
 * Atualiza status do pedido quando polling detecta PAID
 */
export async function POST(req) {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   [UPDATE-STATUS] 🔄 API CALLED        ║');
  console.log('╚════════════════════════════════════════╝\n');

  try {
    const body = await req.json();
    const { order_id, payment_id } = body;

    if (!order_id || !payment_id) {
      return NextResponse.json(
        { error: 'order_id and payment_id are required' },
        { status: 400 }
      );
    }

    console.log('[UPDATE-STATUS] Order ID:', order_id);
    console.log('[UPDATE-STATUS] Payment ID:', payment_id);

    // Buscar payment na dlocal para confirmar status
    const payment = await retrievePayment(payment_id);

    console.log('[UPDATE-STATUS] Payment status:', payment.status);

    if (payment.status !== 'PAID') {
      return NextResponse.json({
        success: false,
        message: 'Payment not yet confirmed',
        status: payment.status,
      }, { status: 400 });
    }

    // Atualizar pedido na Shopify
    const updatedOrder = await updateShopifyOrderStatus(order_id, {
      dlocalPaymentId: payment_id,
      dlocalStatus: payment.status,
      paymentMethod: payment.payment_method_type || 'Card',
    });

    console.log('[UPDATE-STATUS] ✅ Order updated:', updatedOrder.name);

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id: updatedOrder.id,
        name: updatedOrder.name,
        orderNumber: updatedOrder.orderNumber,
        financialStatus: updatedOrder.financialStatus,
        statusUrl: updatedOrder.statusUrl,
      },
    });

  } catch (error) {
    console.error('[UPDATE-STATUS] ❌ ERROR:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to update order status',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
