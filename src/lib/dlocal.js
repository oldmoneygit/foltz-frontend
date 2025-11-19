// src/lib/dlocal.js
// dlocal Go Integration Library - FOLTZ

const DLOCAL_ENV = process.env.DLOCAL_ENVIRONMENT || 'production';
const API_KEY =
  DLOCAL_ENV === 'production'
    ? process.env.DLOCAL_PRODUCTION_API_KEY
    : process.env.DLOCAL_SANDBOX_API_KEY;
const SECRET_KEY =
  DLOCAL_ENV === 'production'
    ? process.env.DLOCAL_PRODUCTION_SECRET_KEY
    : process.env.DLOCAL_SANDBOX_SECRET_KEY;

const DLOCAL_API_URL =
  DLOCAL_ENV === 'production'
    ? 'https://api.dlocalgo.com'
    : 'https://api-sbx.dlocalgo.com';

// Create Authorization header (Bearer token format per dlocal Go docs)
function getAuthHeader() {
  if (!API_KEY || !SECRET_KEY) {
    throw new Error('dlocal credentials not configured');
  }
  // dlocal Go uses: Bearer API_KEY:SECRET_KEY
  return `Bearer ${API_KEY}:${SECRET_KEY}`;
}

/**
 * Criar pagamento na dlocal Go
 *
 * @param {Object} params
 * @param {number} params.amount - Valor em ARS (decimal: 59900.00)
 * @param {string} params.currency - Moeda (padrão: 'ARS')
 * @param {string} params.country - País (padrão: 'AR')
 * @param {string} params.orderId - ID único do pedido
 * @param {Object} params.payer - Informações do pagador
 * @param {string} params.description - Descrição da compra
 * @param {string} params.notificationUrl - URL do webhook
 * @param {string} params.successUrl - URL de sucesso
 * @param {string} params.backUrl - URL de retorno
 * @param {Object} params.metadata - Metadados adicionais
 * @returns {Promise<Object>} Dados do pagamento criado
 */
export async function createPayment({
  amount,
  currency = 'ARS',
  country = 'AR',
  orderId,
  payer,
  description,
  notificationUrl,
  successUrl,
  backUrl,
  metadata = {},
}) {
  console.log('========================================');
  console.log('[DLOCAL-LIB] 🚀 Creating payment...');
  console.log('========================================');
  console.log('[DLOCAL-LIB] Environment:', DLOCAL_ENV);
  console.log('[DLOCAL-LIB] API URL:', DLOCAL_API_URL);
  console.log('[DLOCAL-LIB] Amount:', amount, currency);
  console.log('[DLOCAL-LIB] Order ID:', orderId);
  console.log('[DLOCAL-LIB] Description:', description);

  const payload = {
    amount,
    currency,
    country,
    order_id: orderId,
    description: description || 'FOLTZ Purchase',
    // Notification URL
    ...(notificationUrl && { notification_url: notificationUrl }),
    // Redirect mode URLs
    ...(successUrl && { success_url: successUrl }),
    ...(backUrl && { back_url: backUrl }),
    // Metadata (optional)
    ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
  };

  console.log('[DLOCAL-LIB] 📦 Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${DLOCAL_API_URL}/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    console.log('[DLOCAL-LIB] Response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('[DLOCAL-LIB] ❌ Error response:', JSON.stringify(data, null, 2));
      throw new Error(`dlocal API error: ${JSON.stringify(data)}`);
    }

    console.log('[DLOCAL-LIB] ✅ Payment created:', data.id);
    console.log('[DLOCAL-LIB] Redirect URL:', data.redirect_url);
    console.log('========================================\n');

    return data;
  } catch (error) {
    console.error('[DLOCAL-LIB] ❌ Exception:', error);
    throw error;
  }
}

/**
 * Buscar status do pagamento
 *
 * @param {string} paymentId - ID do pagamento
 * @returns {Promise<Object>} Dados do pagamento
 */
export async function retrievePayment(paymentId) {
  console.log('[DLOCAL-LIB] 🔍 Retrieving payment:', paymentId);

  try {
    const response = await fetch(`${DLOCAL_API_URL}/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthHeader(),
      },
    });

    console.log('[DLOCAL-LIB] Response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('[DLOCAL-LIB] ❌ Error response:', JSON.stringify(data, null, 2));
      throw new Error(`dlocal API error: ${JSON.stringify(data)}`);
    }

    console.log('[DLOCAL-LIB] ✅ Payment retrieved:', data.id, 'Status:', data.status);

    return data;
  } catch (error) {
    console.error('[DLOCAL-LIB] ❌ Exception:', error);
    throw error;
  }
}

/**
 * Validar assinatura do webhook (segurança)
 * dlocal assina webhooks com HMAC-SHA256
 * Signature = HMAC-SHA256(api_key + payload_json, secret_key)
 */
export function validateWebhookSignature(payload, signature) {
  try {
    const crypto = require('crypto');

    if (!API_KEY || !SECRET_KEY) {
      throw new Error('dlocal credentials not configured');
    }

    // dlocal signature format: HMAC-SHA256(api_key + payload_json, secret_key)
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const dataToSign = API_KEY + payloadString;

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(dataToSign)
      .digest('hex');

    const isValid = signature === expectedSignature;

    if (!isValid) {
      console.error('[DLOCAL] Invalid webhook signature:', {
        received: signature,
        expected: expectedSignature,
      });
    }

    return isValid;
  } catch (error) {
    console.error('[DLOCAL] Error validating webhook signature:', error);
    return false;
  }
}

/**
 * Verificar se pagamento foi bem-sucedido
 */
export function isPaymentSuccessful(status) {
  return status === 'PAID' || status === 'AUTHORIZED';
}
