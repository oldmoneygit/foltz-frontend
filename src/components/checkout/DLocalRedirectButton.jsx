'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Shield, CreditCard, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { getFacebookClickId, getFacebookBrowserId, trackPixelEvent, formatCartData } from '@/utils/metaPixelUtils';
import { findVariantBySize } from '@/lib/shopify';
import { extractShopifyId } from '@/utils/shopifyHelpers';

/**
 * DLocal Redirect Button Component - FOLTZ VERSION
 *
 * Flow:
 * 1. Creates PENDING Shopify order BEFORE payment
 * 2. Creates dlocal payment
 * 3. Opens dlocal in popup window
 * 4. Polls payment status every 3 seconds
 * 5. Updates order from PENDING to PAID when payment confirmed
 * 6. Shows success/failure message
 *
 * This ensures NO lost orders - even if customer closes popup, order exists in Shopify
 */
export default function DLocalRedirectButton({
  shippingInfo,
  promotionalTotal,
  promotionalSavings = 0,
  hasPack = false,
  shippingCost = 0,
  shippingMethod = 'free',
  onError,
}) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, creating_order, opening_payment, polling, success, failed
  const [statusMessage, setStatusMessage] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const router = useRouter();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const pollingIntervalRef = useRef(null);
  const popupRef = useRef(null);

  const totalArs = promotionalTotal || getSubtotal();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  // Poll payment status
  const startPolling = (paymentId, orderId) => {
    console.log('[DLOCAL-BTN] 🔄 Starting payment status polling...');
    setPaymentStatus('polling');
    setStatusMessage('Esperando confirmación del pago...');

    let attempts = 0;
    let popupClosedAt = null;
    const maxAttempts = 100; // 100 attempts * 3 seconds = 5 minutes max
    const maxAttemptsAfterClose = 10; // 10 attempts * 3 seconds = 30 seconds after popup closes

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      console.log(`[DLOCAL-BTN] 📊 Polling attempt ${attempts}/${maxAttempts}`);

      try {
        // Check if popup was closed
        if (popupRef.current && popupRef.current.closed && !popupClosedAt) {
          popupClosedAt = attempts;
          console.log('[DLOCAL-BTN] ⚠️  Popup closed by user at attempt', attempts);
          setStatusMessage('Ventana cerrada. Verificando pago...');
        }

        // If popup was closed more than 30 seconds ago, stop polling
        if (popupClosedAt && (attempts - popupClosedAt) >= maxAttemptsAfterClose) {
          console.log('[DLOCAL-BTN] ⏱️  Popup closed timeout - stopping poll');
          clearInterval(pollingIntervalRef.current);
          setPaymentStatus('pending_confirmation');
          setStatusMessage('Tu pedido fue creado. Recibirás un email cuando se confirme el pago.');
          setLoading(false);
          return;
        }

        // Retrieve payment status
        const response = await fetch(`/api/dlocal/retrieve-payment?payment_id=${paymentId}`);

        // Tratamento defensivo de resposta
        if (!response.ok) {
          console.error('[DLOCAL-BTN] Failed to retrieve payment status:', response.status);
          return; // Continue polling
        }

        const data = await response.json();
        console.log('[DLOCAL-BTN] Payment status:', data.status);

        if (data.status === 'PAID') {
          console.log('[DLOCAL-BTN] ✅ Payment PAID! Updating order...');
          clearInterval(pollingIntervalRef.current);

          setPaymentStatus('updating_order');
          setStatusMessage('Pago confirmado! Actualizando pedido...');

          // Update order status
          const updateResponse = await fetch('/api/shopify/update-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: orderId,
              payment_id: paymentId,
            }),
          });

          // Tratamento defensivo de resposta
          if (!updateResponse.ok) {
            const contentType = updateResponse.headers.get('content-type');
            let errorMessage = 'Failed to update order';

            try {
              if (contentType && contentType.includes('application/json')) {
                const errorData = await updateResponse.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
              } else {
                const errorText = await updateResponse.text();
                console.error('[DLOCAL-BTN] Update order error (non-JSON):', errorText);
                errorMessage = `Update order error (${updateResponse.status})`;
              }
            } catch (parseError) {
              console.error('[DLOCAL-BTN] Failed to parse update error:', parseError);
            }

            console.error('[DLOCAL-BTN] ❌ Update order failed:', errorMessage);

            // Mostrar mensagem de erro mas continuar (pedido foi criado)
            setPaymentStatus('pending_confirmation');
            setStatusMessage('Pago recibido. Tu pedido está siendo procesado.');
            setLoading(false);
            return;
          }

          const updateData = await updateResponse.json();
          console.log('[DLOCAL-BTN] ✅ Order updated successfully!');

            setPaymentStatus('success');
            setStatusMessage('¡Pago exitoso! Redirigiendo...');

            // 🎯 TRACK PURCHASE EVENT (META PIXEL)
            try {
              const cartData = formatCartData(cartItems);
              const shippingCost = shippingCost || 0;
              const finalTotal = totalArs + shippingCost;

              await trackPixelEvent('Purchase', {
                ...cartData,
                transaction_id: paymentId, // dlocal payment ID
                order_id: updateData.order.name, // Shopify order number
                order_number: updateData.order.orderNumber,
                value: finalTotal,
                currency: 'ARS',
                shipping: shippingCost,
                has_pack: hasPack,
                savings: promotionalSavings || 0,
                payment_method: 'dlocal_go',
                shipping_method: shippingMethod,
              }, {
                // User data for Advanced Matching
                email: shippingInfo.email,
                firstName: shippingInfo.firstName,
                lastName: shippingInfo.lastName,
                phone: shippingInfo.phone,
                city: shippingInfo.city,
                state: shippingInfo.province,
                zip: shippingInfo.zip,
                country: shippingInfo.country,
              });

              console.log('[DLOCAL-BTN] 🎯 Purchase event tracked successfully!');
            } catch (pixelError) {
              console.error('[DLOCAL-BTN] ⚠️ Failed to track Purchase event:', pixelError);
              // Don't block the flow if tracking fails
            }

            // Close popup if still open
            if (popupRef.current && !popupRef.current.closed) {
              popupRef.current.close();
            }

            // Clear cart
            clearCart();

            // Redirect to success page
            setTimeout(() => {
              router.push(`/checkout/success?order=${updateData.order.name}`);
            }, 2000);
          } else {
            throw new Error('Failed to update order status');
          }

        } else if (data.status === 'REJECTED' || data.status === 'CANCELLED') {
          console.log('[DLOCAL-BTN] ❌ Payment rejected/cancelled');
          clearInterval(pollingIntervalRef.current);

          setPaymentStatus('failed');
          setStatusMessage('Pago rechazado. Por favor, intenta nuevamente.');
          setLoading(false);

          if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.close();
          }

        } else {
          // Still pending
          console.log('[DLOCAL-BTN] ⏳ Payment still pending...');
        }

        // Timeout after max attempts
        if (attempts >= maxAttempts) {
          console.log('[DLOCAL-BTN] ⏱️  Polling timeout reached');
          clearInterval(pollingIntervalRef.current);
          setPaymentStatus('pending_confirmation');
          setStatusMessage('Tu pedido fue creado. Recibirás un email cuando se confirme el pago.');
          setLoading(false);
        }

      } catch (error) {
        console.error('[DLOCAL-BTN] ❌ Error polling payment status:', error);
        // Don't stop polling on error, just log it
      }
    }, 3000); // Poll every 3 seconds
  };

  const handlePayWithDLocal = async () => {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   [DLOCAL-BTN] 🚀 PAYMENT BUTTON CLICKED (FOLTZ)      ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    try {
      setLoading(true);
      setPaymentStatus('creating_order');
      setStatusMessage('Creando pedido...');

      // ============================================
      // STEP 1: Collect tracking data (COMPLETE Meta Ads tracking)
      // ============================================

      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);

      // Helper function to get param from URL or localStorage
      const getTrackingParam = (paramName) => {
        const urlValue = urlParams.get(paramName);
        const storageValue = localStorage.getItem(paramName);

        // If URL has value, save it and return
        if (urlValue) {
          localStorage.setItem(paramName, urlValue);
          return urlValue;
        }

        // Otherwise return stored value
        return storageValue || '';
      };

      // Detect device type
      const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          return 'mobile';
        }
        return 'desktop';
      };

      // Get landing page
      const getLandingPage = () => {
        return localStorage.getItem('landing_page') || window.location.pathname + window.location.search;
      };

      // Save landing page on first visit
      if (!localStorage.getItem('landing_page')) {
        localStorage.setItem('landing_page', window.location.pathname + window.location.search);
      }

      // Get Facebook Click ID (fbc) and Browser ID (fbp)
      const fbc = getFacebookClickId(); // From metaPixelUtils
      const fbp = getFacebookBrowserId(); // From metaPixelUtils

      // Get session data for tracking
      const getSessionData = () => {
        try {
          const viewedProducts = JSON.parse(localStorage.getItem('viewed_products') || '[]');
          const addedToCartProducts = JSON.parse(localStorage.getItem('added_to_cart_products') || '[]');
          const sessionStartTime = localStorage.getItem('session_start_time');

          // Calculate time on site
          const timeOnSite = sessionStartTime
            ? Math.floor((Date.now() - parseInt(sessionStartTime)) / 1000) // seconds
            : 0;

          return {
            viewedProductsCount: viewedProducts.length,
            addedToCartCount: addedToCartProducts.length,
            timeOnSiteSeconds: timeOnSite,
            returningVisitor: !!localStorage.getItem('foltz_returning_visitor'),
          };
        } catch {
          return {
            viewedProductsCount: 0,
            addedToCartCount: 0,
            timeOnSiteSeconds: 0,
            returningVisitor: false,
          };
        }
      };

      const sessionData = getSessionData();

      const trackingData = {
        // Session & Client IDs
        sessionId: localStorage.getItem('foltz_session_id') || `sess_${Date.now()}`,
        clientId: localStorage.getItem('foltz_client_id') || `cli_${Date.now()}`,

        // UTM Parameters (complete set)
        utmSource: getTrackingParam('utm_source'),
        utmMedium: getTrackingParam('utm_medium'),
        utmCampaign: getTrackingParam('utm_campaign'),
        utmContent: getTrackingParam('utm_content'),
        utmTerm: getTrackingParam('utm_term'),

        // Facebook/Meta Ads Parameters
        fbclid: getTrackingParam('fbclid'),        // Facebook Click ID (raw)
        fbc: fbc || '',                            // Facebook Click ID (formatted)
        fbp: fbp || '',                            // Facebook Browser ID (from cookie)
        campaignId: getTrackingParam('campaign_id') || getTrackingParam('fbadid'), // Campaign ID
        adsetId: getTrackingParam('adset_id') || getTrackingParam('fbadsetid'),    // Adset ID
        adId: getTrackingParam('ad_id') || getTrackingParam('fbcreativeid'),       // Ad ID
        placement: getTrackingParam('placement') || getTrackingParam('fbplacement'), // Placement

        // Google Ads Parameters
        gclid: getTrackingParam('gclid'),          // Google Click ID

        // Session Behavior Tracking
        viewedProductsCount: sessionData.viewedProductsCount,
        addedToCartCount: sessionData.addedToCartCount,
        timeOnSiteSeconds: sessionData.timeOnSiteSeconds,
        returningVisitor: sessionData.returningVisitor,
        checkoutStep: 'payment', // Current step in checkout

        // Device & Browser Info
        referrer: document.referrer || '',
        landingPage: getLandingPage(),
        currentPage: window.location.pathname,
        userAgent: navigator.userAgent,
        deviceType: getDeviceType(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',

        // Timestamp
        timestamp: new Date().toISOString(),
        timestampUnix: Math.floor(Date.now() / 1000),
      };

      console.log('[DLOCAL-BTN] 📊 Complete tracking data collected:', trackingData);

      // ============================================
      // STEP 2: Prepare checkout data with CORRECT variant mapping
      // ============================================
      // IMPORTANTE: Usar MESMA lógica do CartSummary para garantir mapeamento correto
      console.log('[DLOCAL-BTN] 🔍 Mapping cart items to Shopify variants...');

      // ============================================
      // CRITICAL: Calculate discounted prices (Pack Foltz, Black Friday, etc.)
      // ============================================
      // Calculate original subtotal (without any discounts)
      const originalSubtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // totalArs is ALREADY the promotional total (with Pack discount applied)
      const discountedTotal = totalArs;

      // Calculate discount ratio to apply to each item
      const discountRatio = discountedTotal / originalSubtotal;

      console.log('[DLOCAL-BTN] 💰 Price calculation:', {
        originalSubtotal,
        discountedTotal,
        discountRatio,
        hasPack,
        savings: promotionalSavings
      });

      const items = [];
      let isFirstItem = true; // Flag para adicionar atributos Pack/Mystery apenas no primeiro produto
      let runningTotal = 0; // Para garantir que o total seja exato

      for (let index = 0; index < cartItems.length; index++) {
        const item = cartItems[index];

        // Find correct variant ID based on size (SAME as CartSummary)
        if (!item.variants || item.variants.length === 0) {
          console.warn('[DLOCAL-BTN] ⚠️  Item without variants, skipping:', item.name);
          continue;
        }

        // Adaptar estrutura: variants pode ser array direto ou objeto com edges
        const variantsData = Array.isArray(item.variants)
          ? { edges: item.variants.map(v => ({ node: v })) }
          : item.variants;

        const variantGid = findVariantBySize(variantsData, item.size);

        if (!variantGid) {
          throw new Error(`No se encontró la talla ${item.size} para ${item.name}`);
        }

        // Extract numeric ID from GID (gid://shopify/ProductVariant/123456 → 123456)
        const variantId = extractShopifyId(variantGid);

        // ============================================
        // CRITICAL: Calculate discounted price for THIS item
        // ============================================
        const isLastItem = (index === cartItems.length - 1);
        let discountedPriceArs;

        if (isLastItem && cartItems.length > 1) {
          // Last item: adjust to guarantee exact total (prevent rounding errors)
          discountedPriceArs = (discountedTotal - runningTotal) / item.quantity;
        } else {
          // Other items: apply discount ratio
          discountedPriceArs = item.price * discountRatio;
        }

        const itemTotal = discountedPriceArs * item.quantity;
        runningTotal += itemTotal;

        console.log('[DLOCAL-BTN] ✅ Variant mapped:', {
          product: item.name,
          size: item.size,
          gid: variantGid,
          numericId: variantId,
          originalPrice: item.price,
          discountedPrice: Math.round(discountedPriceArs),
          quantity: item.quantity,
          itemTotal: Math.round(itemTotal)
        });

        // Preparar line item com custom attributes (SAME as CartSummary)
        const lineItem = {
          variantId: variantGid,          // GID format for reference
          shopifyVariantId: variantId,    // Numeric ID for Shopify Admin API
          name: item.name,
          size: item.size,
          color: item.selectedOptions?.color || item.color,
          quantity: item.quantity,
          priceArs: discountedPriceArs,  // ✅ DISCOUNTED PRICE (not original!)
          originalPriceArs: item.price,   // Keep original for reference
          image: item.image,
          attributes: [],                  // Custom attributes
        };

        // Adicionar personalização como custom attributes
        if (item.customization) {
          const customName = item.customization.name || item.customization.playerName;
          const customNumber = item.customization.number || item.customization.playerNumber;

          if (customName) {
            lineItem.attributes.push({
              key: '👤 Nombre',
              value: customName
            });
          }

          if (customNumber) {
            lineItem.attributes.push({
              key: '🔢 Número',
              value: customNumber.toString()
            });
          }
        }

        // Add Pack Foltz attributes APENAS NO PRIMEIRO PRODUTO
        if (hasPack && isFirstItem) {
          lineItem.attributes.push({
            key: '🔥 PACK FOLTZ',
            value: '✅ Activado'
          });
          lineItem.attributes.push({
            key: '💰 Ahorro total',
            value: `ARS $${Math.round(promotionalSavings)}`
          });
          lineItem.attributes.push({
            key: '🚚 Envío',
            value: 'GRATIS incluido'
          });
          isFirstItem = false;
        }

        items.push(lineItem);
      }

      if (items.length === 0) {
        throw new Error('No se pudieron procesar los productos del carrito');
      }

      console.log('[DLOCAL-BTN] ✅ All items mapped successfully:', items.length);

      const checkoutData = {
        items,
        shipping: shippingInfo,
        customer: {
          email: shippingInfo.email,
          document: shippingInfo.document,
        },
        promotionalTotal: totalArs,
        promotionalSavings,
        hasPack,
        shippingCost,
        shippingMethod,
        shippingMethodName: shippingMethod === 'express' ? 'Transporte Privado UltraExpress' : 'Correo Argentino',
        trackingData,
      };

      console.log('[DLOCAL-BTN] 📦 Checkout data prepared');

      // ============================================
      // STEP 3: Create dlocal payment FIRST
      // ============================================
      console.log('[DLOCAL-BTN] 🌐 Creating dlocal payment...');
      const paymentResponse = await fetch('/api/dlocal/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkout_data: checkoutData }),
      });

      if (!paymentResponse.ok) {
        // Tratamento defensivo: verificar se resposta é JSON
        const contentType = paymentResponse.headers.get('content-type');
        let errorMessage = 'Failed to create payment';

        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await paymentResponse.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // Se não for JSON, pegar texto da resposta
            const errorText = await paymentResponse.text();
            console.error('[DLOCAL-BTN] Non-JSON error response:', errorText);
            errorMessage = `Payment API error (${paymentResponse.status})`;
          }
        } catch (parseError) {
          console.error('[DLOCAL-BTN] Failed to parse error response:', parseError);
          errorMessage = `Payment API error (${paymentResponse.status})`;
        }

        throw new Error(errorMessage);
      }

      const paymentData = await paymentResponse.json();
      console.log('[DLOCAL-BTN] ✅ Payment created:', paymentData.payment_id);
      setPaymentId(paymentData.payment_id);

      // ============================================
      // STEP 4: Create PENDING Shopify order
      // ============================================
      console.log('[DLOCAL-BTN] 📝 Creating PENDING Shopify order...');
      const orderResponse = await fetch('/api/shopify/create-pending-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkout_data: checkoutData,
          dlocal_payment_id: paymentData.payment_id,
        }),
      });

      if (!orderResponse.ok) {
        // Tratamento defensivo: verificar se resposta é JSON
        const contentType = orderResponse.headers.get('content-type');
        let errorMessage = 'Failed to create pending order';

        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await orderResponse.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // Se não for JSON, pegar texto da resposta
            const errorText = await orderResponse.text();
            console.error('[DLOCAL-BTN] Non-JSON error response:', errorText);
            errorMessage = `Order API error (${orderResponse.status})`;
          }
        } catch (parseError) {
          console.error('[DLOCAL-BTN] Failed to parse error response:', parseError);
          errorMessage = `Order API error (${orderResponse.status})`;
        }

        throw new Error(errorMessage);
      }

      const orderResult = await orderResponse.json();
      console.log('[DLOCAL-BTN] ✅ PENDING order created:', orderResult.shopify_order.name);
      setOrderData(orderResult.shopify_order);

      // ============================================
      // STEP 5: Open dlocal payment in POPUP
      // ============================================
      console.log('[DLOCAL-BTN] 🪟 Opening dlocal payment popup...');
      setPaymentStatus('opening_payment');
      setStatusMessage('Abriendo ventana de pago...');

      const popup = window.open(
        paymentData.redirect_url,
        'dlocal_payment',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Failed to open payment popup. Please allow popups and try again.');
      }

      popupRef.current = popup;

      // ============================================
      // STEP 6: Start polling payment status
      // ============================================
      startPolling(paymentData.payment_id, orderResult.shopify_order.id);

    } catch (error) {
      console.error('\n╔════════════════════════════════════════════════════════╗');
      console.error('║   [DLOCAL-BTN] ❌ ERROR                               ║');
      console.error('╚════════════════════════════════════════════════════════╝');
      console.error('[DLOCAL-BTN] Error:', error.message);
      console.error(error);

      setLoading(false);
      setPaymentStatus('failed');
      setStatusMessage('Error al procesar el pago');
      onError?.(error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Message */}
      {paymentStatus !== 'idle' && (
        <div className={`border rounded-xl p-4 ${
          paymentStatus === 'success'
            ? 'bg-green-500/10 border-green-500/30'
            : paymentStatus === 'failed'
            ? 'bg-red-500/10 border-red-500/30'
            : paymentStatus === 'pending_confirmation'
            ? 'bg-yellow-500/10 border-yellow-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {paymentStatus === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            ) : paymentStatus === 'failed' ? (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            ) : paymentStatus === 'pending_confirmation' ? (
              <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            ) : (
              <Loader2 className="w-6 h-6 text-blue-400 flex-shrink-0 animate-spin" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${
                paymentStatus === 'success'
                  ? 'text-green-400'
                  : paymentStatus === 'failed'
                  ? 'text-red-400'
                  : paymentStatus === 'pending_confirmation'
                  ? 'text-yellow-400'
                  : 'text-blue-400'
              }`}>
                {statusMessage}
              </p>
              {orderData && (
                <p className="text-xs text-white/60 mt-1">
                  Pedido: {orderData.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          <p className="text-green-400 text-sm font-medium">
            Pago 100% seguro · Procesado por dlocal Go
          </p>
        </div>
      </div>

      {/* Payment Info - Mobile Optimized with FOLTZ colors */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-[#DAF10D]" />
          <h3 className="text-white font-semibold text-sm">Métodos de pago disponibles</h3>
        </div>

        {/* Payment Methods Grid - Compact */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Tarjetas */}
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">💳</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-xs mb-1">Tarjetas de crédito y débito</p>
                <p className="text-[10px] text-white/60 leading-relaxed">
                  Visa, Mastercard, American Express, Cabal, Naranja y todas las tarjetas argentinas
                </p>
              </div>
            </div>
          </div>

          {/* Transferencia */}
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">🏦</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-xs mb-1">Transferencia bancaria</p>
                <p className="text-[10px] text-white/60 leading-relaxed">
                  Todos los bancos argentinos aceptados
                </p>
              </div>
            </div>
          </div>

          {/* Efectivo */}
          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">💵</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-xs mb-1">Efectivo en puntos de pago</p>
                <p className="text-[10px] text-white/60 leading-relaxed">
                  Rapi Pago, Pago Fácil, MODO
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] text-white/50 text-center">
            ✓ Pago seguro procesado por dlocal Go
          </p>
        </div>
      </div>

      {/* Pay Button - FOLTZ STYLE (Blue with yellow neon accent) */}
      <button
        onClick={handlePayWithDLocal}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 border-2 border-[#DAF10D]/30 hover:border-[#DAF10D]/50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span className="font-bold">Pagar con tarjeta, transferencia o efectivo</span>
          </>
        )}
      </button>

      {/* Info */}
      <p className="text-xs text-white/40 text-center">
        Se abrirá una ventana segura de dlocal Go para completar tu pago
      </p>
    </div>
  );
}
