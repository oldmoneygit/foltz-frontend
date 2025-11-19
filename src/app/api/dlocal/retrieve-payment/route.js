// src/app/api/dlocal/retrieve-payment/route.js
import { NextResponse } from 'next/server';
import { retrievePayment } from '@/lib/dlocal';

// Force Node.js runtime for external API calls
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/dlocal/retrieve-payment?payment_id=XXX
 *
 * Busca status atual de um pagamento (usado para polling)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const payment_id = searchParams.get('payment_id');

    if (!payment_id) {
      return NextResponse.json(
        { error: 'payment_id is required' },
        { status: 400 }
      );
    }

    console.log('[RETRIEVE-PAYMENT] 🔍 Checking payment:', payment_id);

    // Buscar payment na dlocal
    const payment = await retrievePayment(payment_id);

    // Retornar dados essenciais
    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      amount: payment.amount,
      currency: payment.currency,
      country: payment.country,
      payment_method_type: payment.payment_method_type,
      created_date: payment.created_date,
      updated_date: payment.updated_date,
    });

  } catch (error) {
    console.error('[RETRIEVE-PAYMENT] ❌ ERROR:', error);

    return NextResponse.json(
      {
        error: error.message || 'Failed to retrieve payment',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
