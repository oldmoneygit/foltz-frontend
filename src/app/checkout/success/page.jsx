'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, Mail, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const status = searchParams.get('status'); // 'confirmed' ou 'pending'

  const isConfirmed = status === 'confirmed';

  useEffect(() => {
    // Clear cart from localStorage on success
    if (typeof window !== 'undefined') {
      localStorage.removeItem('foltz_cart');
      localStorage.removeItem('foltz-pack-items');
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className={`absolute inset-0 ${isConfirmed ? 'bg-[#DAF10D]/20' : 'bg-blue-500/20'} rounded-full blur-2xl animate-pulse`} />
              <div className={`relative w-24 h-24 md:w-32 md:h-32 ${isConfirmed ? 'bg-[#DAF10D]' : 'bg-blue-600'} rounded-full flex items-center justify-center`}>
                {isConfirmed ? (
                  <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-black" strokeWidth={3} />
                ) : (
                  <Package className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
                )}
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 uppercase">
              {isConfirmed ? '¡Pedido Confirmado!' : '¡Pedido Recibido!'}
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-2">
              {isConfirmed
                ? 'Tu pago fue procesado exitosamente'
                : 'Tu pedido está siendo procesado'}
            </p>
            {orderNumber && (
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-3">
                <span className="text-white/50 text-sm">Número de pedido:</span>
                <span className={`${isConfirmed ? 'text-[#DAF10D]' : 'text-blue-400'} font-bold text-lg`}>{orderNumber}</span>
              </div>
            )}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-10"
          >
            {/* Email Confirmation */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${isConfirmed ? 'bg-[#DAF10D]/10 border-[#DAF10D]/20' : 'bg-blue-500/10 border-blue-500/20'} border rounded-xl flex items-center justify-center`}>
                  <Mail className={`w-6 h-6 ${isConfirmed ? 'text-[#DAF10D]' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">
                    {isConfirmed ? 'Confirmación por Email' : 'Procesando tu Pedido'}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {isConfirmed
                      ? 'Te enviamos un email de confirmación con los detalles de tu pedido y el número de seguimiento.'
                      : 'Tu pedido aún no ha sido confirmado. Una vez que el pago sea aprobado, te enviaremos un email de confirmación con todos los detalles.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 ${isConfirmed ? 'bg-[#DAF10D]/10 border-[#DAF10D]/20' : 'bg-blue-500/10 border-blue-500/20'} border rounded-xl flex items-center justify-center`}>
                  <Package className={`w-6 h-6 ${isConfirmed ? 'text-[#DAF10D]' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">Envío y Seguimiento</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {isConfirmed
                      ? 'Tu pedido será preparado y enviado pronto. Recibirás un email con el código de seguimiento cuando sea despachado.'
                      : 'Una vez confirmado el pago, prepararemos tu pedido para el envío y te enviaremos el código de seguimiento por email.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-[#DAF10D] text-black px-6 py-4 rounded-xl font-bold text-base uppercase tracking-wide hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#DAF10D]/20"
            >
              <Home className="w-5 h-5" />
              Volver a la Tienda
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 p-5 bg-white/5 border border-white/10 rounded-xl"
          >
            <h4 className="text-white font-bold text-sm mb-4">¿Necesitas ayuda?</h4>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Si tienes alguna pregunta sobre tu pedido o necesitas asistencia, estamos aquí para ayudarte:
            </p>

            {/* Contact Options */}
            <div className="space-y-3">
              {/* Live Chat */}
              <div className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5 hover:border-[#DAF10D]/30 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-[#DAF10D]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#DAF10D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-xs mb-1">Chat en Vivo</h5>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Haz clic en el ícono de chat en la esquina inferior derecha de la pantalla para hablar con nosotros al instante.
                  </p>
                </div>
              </div>

              {/* Instagram */}
              <a
                href="https://instagram.com/foltz.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5 hover:border-[#DAF10D]/30 transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-xs mb-1 group-hover:text-[#DAF10D] transition-colors">Instagram Direct</h5>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Envíanos un mensaje directo a <span className="text-pink-400 font-semibold">@foltz.oficial</span> en Instagram.
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:contacto@foltz.com"
                className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5 hover:border-[#DAF10D]/30 transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#DAF10D]/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#DAF10D]" />
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-xs mb-1 group-hover:text-[#DAF10D] transition-colors">Email</h5>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Escríbenos a <span className="text-[#DAF10D] font-semibold">contacto@foltz.com</span> y te responderemos pronto.
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 text-center"
          >
            <p className="text-white/40 text-sm">
              Gracias por tu compra en <span className="text-[#DAF10D] font-bold">FOLTZ</span>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-[#DAF10D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
