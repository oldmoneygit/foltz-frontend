'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Truck, AlertTriangle, Check, X } from 'lucide-react'
import { usePayOnDelivery } from '@/contexts/PayOnDeliveryContext'
import { useCart } from '@/contexts/CartContext'

export default function PayOnDeliveryCartOption() {
  const { payOnDeliveryEnabled, enablePayOnDelivery, disablePayOnDelivery, calculatePayOnDeliveryTotals } =
    usePayOnDelivery()
  const { items } = useCart()

  // Calculate cart subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate pay on delivery totals
  const podTotals = calculatePayOnDeliveryTotals(items, subtotal)

  const handleToggle = () => {
    if (podTotals.maxItemsReached) {
      alert('⚠️ Máximo 6 jerseys para pagamento na entrega!')
      return
    }

    if (payOnDeliveryEnabled) {
      disablePayOnDelivery()
    } else {
      enablePayOnDelivery()
    }
  }

  // Format price
  const formatPrice = (value) => {
    return `AR$ ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-orange-500/30 rounded-2xl p-4 md:p-6">
      {/* Header with Checkbox */}
      <motion.label
        whileHover={{ scale: podTotals.maxItemsReached ? 1 : 1.01 }}
        whileTap={{ scale: podTotals.maxItemsReached ? 1 : 0.99 }}
        className={`flex items-start gap-3 cursor-pointer ${
          podTotals.maxItemsReached ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={payOnDeliveryEnabled}
          onChange={handleToggle}
          disabled={podTotals.maxItemsReached}
          className="w-5 h-5 mt-1 rounded border-2 border-orange-500 bg-transparent checked:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-orange-500" />
            <h3 className="text-white font-black text-base md:text-lg">
              Pagar na Entrega (Black Friday)
            </h3>
          </div>
          <p className="text-white/60 text-xs md:text-sm">
            Pague só o frete agora, o resto quando receber
          </p>
        </div>
      </motion.label>

      {/* Max Items Warning */}
      {podTotals.maxItemsReached && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 text-sm font-bold">Limite de 6 jerseys!</p>
              <p className="text-red-300/80 text-xs mt-1">
                Você tem {podTotals.itemCount} itens. Remova {podTotals.itemCount - 6} para ativar.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activated State */}
      <AnimatePresence>
        {payOnDeliveryEnabled && podTotals.isValid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {/* Success Message */}
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-green-300 font-bold text-sm">
                    💡 Pagamento na Entrega Ativado!
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-3">
              {/* Pay Now */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-bold text-sm">Você pagará AGORA</p>
                    <p className="text-white/60 text-xs">Só o frete</p>
                  </div>
                </div>
                <p className="text-yellow-400 font-black text-lg">{formatPrice(podTotals.shipping)}</p>
              </div>

              {/* Pay on Delivery */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-white font-bold text-sm">Você pagará NA ENTREGA</p>
                    <p className="text-white/60 text-xs">Valor dos produtos</p>
                  </div>
                </div>
                <p className="text-orange-500 font-black text-lg">{formatPrice(podTotals.payOnDelivery)}</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="text-white/80 text-xs font-bold mb-2">Formas aceitas na entrega:</p>
              <div className="flex flex-wrap gap-2 text-[10px] md:text-xs">
                <span className="px-2 py-1 bg-white/10 rounded text-white/80">💳 Cartão</span>
                <span className="px-2 py-1 bg-white/10 rounded text-white/80">📱 Mercado Pago</span>
                <span className="px-2 py-1 bg-white/10 rounded text-white/80">💵 Dinheiro</span>
                <span className="px-2 py-1 bg-white/10 rounded text-white/80">🏦 Transferência</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-xs">
                <strong>Prazo:</strong> até 10 dias úteis
                <br />
                <X className="w-3 h-3 inline mr-1" />
                Pode recusar se não gostar (frete não reembolsável)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
