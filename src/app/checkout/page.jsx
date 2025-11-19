'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Truck, Shield, CreditCard, Tag, Gift, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { usePackFoltz, PACK_SIZE, PACK_PRICE } from '@/contexts/PackFoltzContext';
import DLocalRedirectButton from '@/components/checkout/DLocalRedirectButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { trackPixelEvent, formatCartData } from '@/utils/metaPixelUtils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { packSize, packPrice, formatPrice } = usePackFoltz();
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    document: '', // DNI/CUIT for dlocal
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'AR',
  });
  const [errors, setErrors] = useState({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('free'); // 'free' or 'express'

  // Shipping costs
  const EXPRESS_SHIPPING_COST = 14707;

  // Calculate total quantity
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate Pack Foltz pricing
  const hasPack = totalQuantity >= PACK_SIZE;
  const subtotalNormal = getSubtotal();
  const subtotalWithPack = hasPack ? PACK_PRICE : subtotalNormal;
  const savings = hasPack ? (subtotalNormal - PACK_PRICE) : 0;
  const productTotal = hasPack ? PACK_PRICE : subtotalNormal;

  // Track PageView on checkout page load
  useEffect(() => {
    if (cartItems.length > 0) {
      const cartData = formatCartData(cartItems);
      trackPixelEvent('PageView', {
        ...cartData,
        page_type: 'checkout',
        checkout_step: 'shipping_info',
      });
    }
  }, []); // Run only on mount

  // Track AddPaymentInfo when shipping method changes
  useEffect(() => {
    if (shippingMethod && cartItems.length > 0) {
      const cartData = formatCartData(cartItems);
      const shippingCost = shippingMethod === 'express' ? EXPRESS_SHIPPING_COST : 0;

      trackPixelEvent('AddPaymentInfo', {
        ...cartData,
        shipping_method: shippingMethod === 'express' ? 'Transporte Privado UltraExpress' : 'Correo Argentino (Gratis)',
        shipping_cost: shippingCost,
        payment_type: 'dlocal_go',
      });
    }
  }, [shippingMethod]); // Run when shipping method changes

  useEffect(() => {
    // Don't redirect to cart if payment was completed (cart was cleared after successful payment)
    if (cartItems.length === 0 && !paymentCompleted) {
      router.push('/carrito');
    }
  }, [cartItems, router, paymentCompleted]);

  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.email) {
      newErrors.email = 'Email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!shippingInfo.firstName) newErrors.firstName = 'Nombre es obligatorio';
    if (!shippingInfo.lastName) newErrors.lastName = 'Apellido es obligatorio';
    if (!shippingInfo.document) newErrors.document = 'DNI/CUIT es obligatorio';
    if (!shippingInfo.address1) newErrors.address1 = 'Dirección es obligatoria';
    if (!shippingInfo.city) newErrors.city = 'Ciudad es obligatoria';
    if (!shippingInfo.province) newErrors.province = 'Provincia es obligatoria';
    if (!shippingInfo.zip) newErrors.zip = 'Código postal es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Calculate shipping cost
  const shippingCost = shippingMethod === 'express' ? EXPRESS_SHIPPING_COST : 0;
  const finalTotal = productTotal + shippingCost;

  const formatARS = (amount) => {
    return `$ ${Math.round(amount).toLocaleString('es-AR')}`;
  };

  const getItemCount = () => totalQuantity;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DAF10D]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/carrito"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#DAF10D] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al carrito
          </Link>

          <div className="flex items-center gap-3 mt-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#DAF10D]' : 'text-white/30'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#DAF10D] text-black' : 'bg-white/10 text-white/30'}`}>
                1
              </div>
              <span className="font-medium text-sm">Envío</span>
            </div>
            <div className="w-8 h-px bg-white/10" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#DAF10D]' : 'text-white/30'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#DAF10D] text-black' : 'bg-white/10 text-white/30'}`}>
                2
              </div>
              <span className="font-medium text-sm">Pago</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-4">
            {step === 1 && (
              <>
                {/* Shipping Form */}
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5">
                  <h2 className="text-base md:text-lg font-bold text-white mb-4 md:mb-5 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#DAF10D]" />
                    Información de Envío
                  </h2>

                  <form onSubmit={handleShippingSubmit} className="space-y-3.5">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold mb-2 text-white/80">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 focus:border-[#DAF10D] outline-none text-white placeholder-white/40 text-sm ${
                          errors.email ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="tu@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                      )}
                    </div>

                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleInputChange}
                          className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm ${
                            errors.firstName ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="Juan"
                        />
                        {errors.firstName && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleInputChange}
                          className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm ${
                            errors.lastName ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="Pérez"
                        />
                        {errors.lastName && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Telefono y DNI/CUIT */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          Teléfono (opcional)
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm"
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          DNI/CUIT *
                        </label>
                        <input
                          type="text"
                          name="document"
                          value={shippingInfo.document}
                          onChange={handleInputChange}
                          className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm ${
                            errors.document ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="12345678"
                        />
                        {errors.document && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.document}</p>
                        )}
                      </div>
                    </div>

                    {/* Direccion */}
                    <div>
                      <label className="block text-xs font-bold mb-2 text-white/80">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="address1"
                        value={shippingInfo.address1}
                        onChange={handleInputChange}
                        className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm ${
                          errors.address1 ? 'border-red-500' : 'border-white/10'
                        }`}
                        placeholder="Calle y número"
                      />
                      {errors.address1 && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.address1}</p>
                      )}
                    </div>

                    {/* Direccion 2 */}
                    <div>
                      <label className="block text-xs font-bold mb-2 text-white/80">
                        Departamento, piso (opcional)
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={shippingInfo.address2}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm"
                        placeholder="Ej: 3B"
                      />
                    </div>

                    {/* Ciudad, Provincia, CP */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm ${
                            errors.city ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="Buenos Aires"
                        />
                        {errors.city && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          Provincia *
                        </label>
                        <select
                          name="province"
                          value={shippingInfo.province}
                          onChange={handleInputChange}
                          className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white text-sm ${
                            errors.province ? 'border-red-500' : 'border-white/10'
                          }`}
                        >
                          <option value="" className="bg-black">Seleccionar</option>
                          <option value="Buenos Aires" className="bg-black">Buenos Aires</option>
                          <option value="CABA" className="bg-black">CABA</option>
                          <option value="Catamarca" className="bg-black">Catamarca</option>
                          <option value="Chaco" className="bg-black">Chaco</option>
                          <option value="Chubut" className="bg-black">Chubut</option>
                          <option value="Córdoba" className="bg-black">Córdoba</option>
                          <option value="Corrientes" className="bg-black">Corrientes</option>
                          <option value="Entre Ríos" className="bg-black">Entre Ríos</option>
                          <option value="Formosa" className="bg-black">Formosa</option>
                          <option value="Jujuy" className="bg-black">Jujuy</option>
                          <option value="La Pampa" className="bg-black">La Pampa</option>
                          <option value="La Rioja" className="bg-black">La Rioja</option>
                          <option value="Mendoza" className="bg-black">Mendoza</option>
                          <option value="Misiones" className="bg-black">Misiones</option>
                          <option value="Neuquén" className="bg-black">Neuquén</option>
                          <option value="Río Negro" className="bg-black">Río Negro</option>
                          <option value="Salta" className="bg-black">Salta</option>
                          <option value="San Juan" className="bg-black">San Juan</option>
                          <option value="San Luis" className="bg-black">San Luis</option>
                          <option value="Santa Cruz" className="bg-black">Santa Cruz</option>
                          <option value="Santa Fe" className="bg-black">Santa Fe</option>
                          <option value="Santiago del Estero" className="bg-black">Santiago del Estero</option>
                          <option value="Tierra del Fuego" className="bg-black">Tierra del Fuego</option>
                          <option value="Tucumán" className="bg-black">Tucumán</option>
                        </select>
                        {errors.province && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.province}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-2 text-white/80">
                          CP *
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={shippingInfo.zip}
                          onChange={handleInputChange}
                          className={`w-full p-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#DAF10D]/50 outline-none text-white placeholder-white/40 text-sm ${
                            errors.zip ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="1000"
                        />
                        {errors.zip && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.zip}</p>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Shipping Method Selection */}
                <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5">
                  <h2 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#DAF10D]" />
                    Método de Envío
                  </h2>

                  <div className="space-y-3">
                    {/* Free Shipping Option */}
                    <label
                      className={`block cursor-pointer transition-all duration-200 ${
                        shippingMethod === 'free'
                          ? 'ring-2 ring-[#DAF10D]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-4 rounded-xl border ${
                        shippingMethod === 'free'
                          ? 'border-[#DAF10D] bg-[#DAF10D]/5'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="free"
                            checked={shippingMethod === 'free'}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="mt-1 w-4 h-4 accent-[#DAF10D]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-white text-sm">Correo Argentino</p>
                                <p className="text-white/50 text-xs mt-0.5">5 a 15 días hábiles</p>
                              </div>
                              <span className="text-green-400 font-bold text-sm">GRATIS</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-white/60">Seguimiento en tiempo real</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Express Shipping Option */}
                    <label
                      className={`block cursor-pointer transition-all duration-200 ${
                        shippingMethod === 'express'
                          ? 'ring-2 ring-[#DAF10D]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-4 rounded-xl border ${
                        shippingMethod === 'express'
                          ? 'border-[#DAF10D] bg-[#DAF10D]/5'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={shippingMethod === 'express'}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="mt-1 w-4 h-4 accent-[#DAF10D]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-white text-sm">Transporte Privado UltraExpress</p>
                                <p className="text-white/50 text-xs mt-0.5">2 a 7 días hábiles</p>
                              </div>
                              <span className="text-[#DAF10D] font-bold text-sm">{formatARS(EXPRESS_SHIPPING_COST)}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-white/60">Seguimiento en tiempo real</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleShippingSubmit}
                    className="w-full bg-[#DAF10D] text-black py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-yellow-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#DAF10D]/20 mt-5"
                  >
                    Continuar al Pago
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#DAF10D]" />
                    Método de Pago
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[#DAF10D] hover:underline text-xs font-semibold"
                  >
                    Editar envío
                  </button>
                </div>

                {/* Resumen de envio */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">Enviar a:</h3>
                    <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                      {shippingMethod === 'express' ? 'UltraExpress 2-7 días' : 'Correo 5-15 días'}
                    </span>
                  </div>
                  <p className="text-white/70 text-xs">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p className="text-white/70 text-xs">
                    {shippingInfo.address1}
                    {shippingInfo.address2 && `, ${shippingInfo.address2}`}
                  </p>
                  <p className="text-white/70 text-xs">
                    {shippingInfo.city}, {shippingInfo.province} {shippingInfo.zip}
                  </p>
                  <p className="text-white/70 text-xs">{shippingInfo.email}</p>
                </div>

                {/* dlocal Go - Argentina Payment Button */}
                <div className="mb-6">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#DAF10D]" />
                    Pago Argentina
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    Tarjetas de crédito/débito argentinas, transferencia bancaria o efectivo (Rapi Pago, Pago Fácil y más)
                  </p>
                  <DLocalRedirectButton
                    shippingInfo={shippingInfo}
                    promotionalTotal={subtotalWithPack}
                    promotionalSavings={savings}
                    hasPack={hasPack}
                    shippingCost={shippingCost}
                    shippingMethod={shippingMethod}
                    onError={(error) => {
                      console.error('dlocal error:', error);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-[#DAF10D]" />
                <h3 className="font-bold text-white text-sm">
                  Tu Pedido ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
                </h3>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#DAF10D] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-white/50">
                        Talle: {item.size}
                      </p>
                      <p className="text-xs font-bold text-[#DAF10D] mt-0.5">
                        {formatARS(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                {hasPack && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/50">Subtotal</span>
                      <span className="text-white/40 line-through">{formatARS(subtotalNormal)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400 flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        PACK FOLTZ (4x{formatARS(PACK_PRICE)})
                      </span>
                      <span className="text-green-400 font-semibold">-{formatARS(savings)}</span>
                    </div>
                  </>
                )}
                {!hasPack && (
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white font-semibold">{formatARS(subtotalNormal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Envío</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-400 font-semibold">GRATIS</span>
                  ) : (
                    <span className="text-white font-semibold">{formatARS(shippingCost)}</span>
                  )}
                </div>
                <div className="flex justify-between font-extrabold pt-3 border-t border-white/10">
                  <span className="text-white text-sm">Total</span>
                  <span className="text-[#DAF10D] text-lg font-extrabold">{formatARS(finalTotal)}</span>
                </div>
                {hasPack && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 mt-2">
                    <p className="text-green-400 text-[10px] font-semibold flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      ¡Ahorraste {formatARS(savings)} con PACK FOLTZ!
                    </p>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-white/50 text-[10px]">
                  <Shield className="w-3.5 h-3.5 text-[#DAF10D]" />
                  <span>Pago 100% seguro con encriptación SSL</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-[10px]">
                  <Truck className="w-3.5 h-3.5 text-[#DAF10D]" />
                  <span>
                    {shippingMethod === 'express'
                      ? 'Envío express 2-7 días hábiles'
                      : 'Envío estándar 5-15 días hábiles'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
