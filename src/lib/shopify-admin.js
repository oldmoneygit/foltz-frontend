// src/lib/shopify-admin.js
// Shopify Admin API - Create and Update Orders - FOLTZ

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10';

/**
 * Helper para fazer requests autenticados na Shopify Admin API
 */
async function shopifyAdminRequest(endpoint, method = 'GET', body = null) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
    console.error('[SHOPIFY-ADMIN] Missing configuration:', {
      hasDomain: !!SHOPIFY_DOMAIN,
      hasToken: !!SHOPIFY_ADMIN_TOKEN,
    });
    throw new Error('Shopify Admin API not configured');
  }

  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Shopify Admin API error: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  return response.json();
}

/**
 * Converter variantId GID para numeric ID
 * gid://shopify/ProductVariant/123456 -> 123456
 */
function extractNumericId(gid) {
  if (typeof gid === 'number') return gid;
  if (typeof gid === 'string') {
    const match = gid.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : parseInt(gid, 10);
  }
  return null;
}

/**
 * Criar pedido na Shopify a partir de dados do dlocal
 *
 * @param {Object} orderData - Dados do pedido
 * @returns {Promise<Object>} Pedido criado
 */
export async function createShopifyOrderFromDLocal(orderData) {
  const {
    email,
    lineItems,
    shippingAddress,
    billingAddress,
    customer,
    dlocalPaymentId,
    dlocalStatus,
    totalAmount,
    currency,
    paymentMethod,
    note,
    tags,
    trackingData = {},
    shippingCostArs = 0,
    shippingMethod = 'free',
    shippingMethodName = 'Correo Argentino',
  } = orderData;

  console.log('[SHOPIFY-ADMIN] 📝 Creating order...');
  console.log('[SHOPIFY-ADMIN] Payment ID:', dlocalPaymentId);
  console.log('[SHOPIFY-ADMIN] Status:', dlocalStatus);

  // Preparar line items para API REST da Shopify
  const shopifyLineItems = lineItems.map((item) => {
    // Build title from name, size, and color
    let title = item.name || 'Product';
    if (item.size) title += ` - Size ${item.size}`;
    if (item.color) title += ` - ${item.color}`;

    // Use shopifyVariantId (numeric ID) if available, otherwise extract from GID
    const variantId = item.shopifyVariantId || extractNumericId(item.variantId);

    const lineItem = {
      variant_id: variantId,
      quantity: item.quantity,
      title: title,
      ...(item.priceArs && { price: item.priceArs.toFixed(2) }),
    };

    // Add custom attributes (properties) for personalizations, Pack Foltz, etc.
    // In Shopify Admin API, line item custom attributes are called "properties"
    if (item.attributes && item.attributes.length > 0) {
      lineItem.properties = item.attributes.map(attr => ({
        name: attr.key,
        value: attr.value,
      }));
    }

    return lineItem;
  });

  // Preparar endereço de envio
  const shipping = {
    first_name: shippingAddress.firstName,
    last_name: shippingAddress.lastName,
    address1: shippingAddress.address1,
    address2: shippingAddress.address2 || '',
    city: shippingAddress.city,
    province: shippingAddress.province,
    zip: shippingAddress.zip,
    country: shippingAddress.country,
    phone: shippingAddress.phone || '',
  };

  // Determine financial status
  const financialStatus = dlocalStatus === 'PAID' ? 'paid' : 'pending';
  const transactionStatus = dlocalStatus === 'PAID' ? 'success' : 'pending';

  // Construir payload do pedido
  const orderPayload = {
    order: {
      email: email,
      line_items: shopifyLineItems,
      shipping_address: shipping,
      billing_address: billingAddress || shipping,
      financial_status: financialStatus,
      tags: tags || 'dlocal,foltz,pending_payment',
      note: note || `⏳ PENDING Payment - dlocal Go\nPayment ID: ${dlocalPaymentId}\nStatus: ${dlocalStatus}`,

      // Shipping line - custo de envio
      shipping_lines: [
        {
          title: shippingMethodName,
          price: shippingCostArs.toFixed(2),
          code: shippingMethod === 'express' ? 'EXPRESS' : 'STANDARD',
        },
      ],

      // Transação do pagamento
      transactions: [
        {
          kind: 'sale',
          status: transactionStatus,
          amount: totalAmount.toFixed(2),
          gateway: 'dlocal_go',
          authorization: dlocalPaymentId,
        },
      ],

      // Enviar confirmação por email (only for PAID orders)
      send_receipt: dlocalStatus === 'PAID',
      send_fulfillment_receipt: dlocalStatus === 'PAID',

      // Dados do cliente (cria se não existir)
      ...(customer && {
        customer: {
          email: customer.email,
          first_name: customer.firstName,
          last_name: customer.lastName,
          ...(customer.phone && customer.phone.trim() !== '' && { phone: customer.phone }),
        },
      }),

      // Custom attributes (tracking, Pack info, etc) - EXPANDED FOR COMPLETE TRACKING
      note_attributes: [
        // Payment Info
        { name: 'payment_method', value: 'dlocal_go' },
        { name: 'dlocal_payment_id', value: dlocalPaymentId },
        { name: 'dlocal_status', value: dlocalStatus },
        ...(paymentMethod ? [{ name: 'dlocal_payment_type', value: paymentMethod }] : []),

        // Session & Client IDs
        ...(trackingData.sessionId ? [{ name: 'session_id', value: trackingData.sessionId }] : []),
        ...(trackingData.clientId ? [{ name: 'client_id', value: trackingData.clientId }] : []),

        // UTM Parameters (Complete)
        ...(trackingData.utmSource ? [{ name: 'utm_source', value: trackingData.utmSource }] : []),
        ...(trackingData.utmMedium ? [{ name: 'utm_medium', value: trackingData.utmMedium }] : []),
        ...(trackingData.utmCampaign ? [{ name: 'utm_campaign', value: trackingData.utmCampaign }] : []),
        ...(trackingData.utmContent ? [{ name: 'utm_content', value: trackingData.utmContent }] : []),
        ...(trackingData.utmTerm ? [{ name: 'utm_term', value: trackingData.utmTerm }] : []),

        // Facebook/Meta Ads Parameters
        ...(trackingData.fbclid ? [{ name: 'fbclid', value: trackingData.fbclid }] : []),
        ...(trackingData.fbc ? [{ name: 'fbc', value: trackingData.fbc }] : []),
        ...(trackingData.fbp ? [{ name: 'fbp', value: trackingData.fbp }] : []),
        ...(trackingData.campaignId ? [{ name: 'fb_campaign_id', value: trackingData.campaignId }] : []),
        ...(trackingData.adsetId ? [{ name: 'fb_adset_id', value: trackingData.adsetId }] : []),
        ...(trackingData.adId ? [{ name: 'fb_ad_id', value: trackingData.adId }] : []),
        ...(trackingData.placement ? [{ name: 'fb_placement', value: trackingData.placement }] : []),

        // Google Ads Parameters
        ...(trackingData.gclid ? [{ name: 'gclid', value: trackingData.gclid }] : []),

        // Session Behavior
        ...(trackingData.viewedProductsCount !== undefined ? [{ name: 'viewed_products_count', value: String(trackingData.viewedProductsCount) }] : []),
        ...(trackingData.addedToCartCount !== undefined ? [{ name: 'added_to_cart_count', value: String(trackingData.addedToCartCount) }] : []),
        ...(trackingData.timeOnSiteSeconds !== undefined ? [{ name: 'time_on_site_seconds', value: String(trackingData.timeOnSiteSeconds) }] : []),
        ...(trackingData.returningVisitor !== undefined ? [{ name: 'returning_visitor', value: String(trackingData.returningVisitor) }] : []),
        ...(trackingData.checkoutStep ? [{ name: 'checkout_step', value: trackingData.checkoutStep }] : []),

        // Device & Browser Info
        ...(trackingData.referrer ? [{ name: 'referrer', value: trackingData.referrer }] : []),
        ...(trackingData.landingPage ? [{ name: 'landing_page', value: trackingData.landingPage }] : []),
        ...(trackingData.currentPage ? [{ name: 'current_page', value: trackingData.currentPage }] : []),
        ...(trackingData.deviceType ? [{ name: 'device_type', value: trackingData.deviceType }] : []),
        ...(trackingData.screenResolution ? [{ name: 'screen_resolution', value: trackingData.screenResolution }] : []),
        ...(trackingData.language ? [{ name: 'language', value: trackingData.language }] : []),
        ...(trackingData.timezone ? [{ name: 'timezone', value: trackingData.timezone }] : []),

        // Timestamps
        ...(trackingData.timestamp ? [{ name: 'tracking_timestamp', value: trackingData.timestamp }] : []),
        ...(trackingData.timestampUnix ? [{ name: 'tracking_timestamp_unix', value: String(trackingData.timestampUnix) }] : []),
      ],
    },
  };

  try {
    const response = await shopifyAdminRequest('/orders.json', 'POST', orderPayload);

    console.log('[SHOPIFY-ADMIN] ✅ Order created:', response.order.name);

    return {
      id: response.order.id,
      name: response.order.name,
      orderNumber: response.order.order_number,
      email: response.order.email,
      totalPrice: response.order.total_price,
      financialStatus: response.order.financial_status,
      fulfillmentStatus: response.order.fulfillment_status,
      createdAt: response.order.created_at,
      statusUrl: response.order.order_status_url,
    };
  } catch (error) {
    console.error('[SHOPIFY-ADMIN] ❌ Error creating order:', error);
    throw error;
  }
}

/**
 * Atualizar status do pedido (PENDING → PAID)
 */
export async function updateShopifyOrderStatus(orderId, updateData) {
  const { dlocalPaymentId, dlocalStatus, paymentMethod } = updateData;

  console.log('[SHOPIFY-ADMIN] 🔄 Updating order:', orderId);
  console.log('[SHOPIFY-ADMIN] New status:', dlocalStatus);

  try {
    // Buscar pedido atual
    const currentOrder = await getShopifyOrder(orderId);

    // Preparar update payload
    const updatePayload = {
      order: {
        financial_status: dlocalStatus === 'PAID' ? 'paid' : 'pending',
        // Atualizar tags
        tags: currentOrder.tags
          .replace(/pending_payment,?/g, '')
          .replace(/awaiting_payment,?/g, '')
          .replace(/,,/g, ',')
          + (dlocalStatus === 'PAID' ? ',paid' : ''),
        // Atualizar note
        note: currentOrder.note + `\n\n✅ Payment Confirmed!\n` +
              `Updated at: ${new Date().toISOString()}\n` +
              `Payment ID: ${dlocalPaymentId}\n` +
              `Status: ${dlocalStatus}\n` +
              `Payment Method: ${paymentMethod || 'Card'}\n`,
      },
    };

    const response = await shopifyAdminRequest(`/orders/${orderId}.json`, 'PUT', updatePayload);

    console.log('[SHOPIFY-ADMIN] ✅ Order updated:', response.order.name);

    return {
      id: response.order.id,
      name: response.order.name,
      orderNumber: response.order.order_number,
      email: response.order.email,
      totalPrice: response.order.total_price,
      financialStatus: response.order.financial_status,
      fulfillmentStatus: response.order.fulfillment_status,
      updatedAt: response.order.updated_at,
      statusUrl: response.order.order_status_url,
    };
  } catch (error) {
    console.error('[SHOPIFY-ADMIN] ❌ Error updating order:', error);
    throw error;
  }
}

/**
 * Buscar pedido por ID
 */
export async function getShopifyOrder(orderId) {
  try {
    const response = await shopifyAdminRequest(`/orders/${orderId}.json`);
    return response.order;
  } catch (error) {
    console.error('[SHOPIFY-ADMIN] ❌ Error fetching order:', error);
    throw error;
  }
}
