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
            <h4 className="text-white font-bold text-sm mb-3">¿Necesitas ayuda?</h4>
            <p className="text-white/60 text-xs leading-relaxed mb-3">
              Si tienes alguna pregunta sobre tu pedido o necesitas asistencia, no dudes en contactarnos por email.
            </p>
            <a
              href="mailto:contacto@foltz.com"
              className="text-[#DAF10D] hover:text-yellow-400 text-xs font-semibold underline"
            >
              contacto@foltz.com
            </a>
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
