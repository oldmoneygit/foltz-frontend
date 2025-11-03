'use client'

import { motion } from 'framer-motion'
import { Check, X, CreditCard, Package, Clock, AlertCircle } from 'lucide-react'
import { usePayOnDelivery } from '@/contexts/PayOnDeliveryContext'

export default function PayOnDeliveryCard() {
  const { payOnDeliveryEnabled, enablePayOnDelivery, disablePayOnDelivery, SHIPPING_FEE } = usePayOnDelivery()

  const handleToggle = () => {
    if (payOnDeliveryEnabled) {
      disablePayOnDelivery()
    } else {
      enablePayOnDelivery()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-4 md:p-6 my-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black text-white uppercase">
            💳 PROMOÇÃO BLACK FRIDAY
          </h3>
          <p className="text-yellow-400 font-bold text-sm md:text-base">
            PAGUE NA ENTREGA
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-3 mb-5">
        <p className="text-white font-bold mb-2">Como funciona:</p>

        <div className="flex items-start gap-2 text-sm text-white/90">
          <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-black rounded-full font-black text-xs shrink-0">
            1
          </span>
          <p>
            Pague apenas o frete agora:{' '}
            <span className="text-yellow-400 font-bold">ARS {SHIPPING_FEE.toLocaleString('es-AR')}</span>
          </p>
        </div>

        <div className="flex items-start gap-2 text-sm text-white/90">
          <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-black rounded-full font-black text-xs shrink-0">
            2
          </span>
          <p>Receba em até 10 dias úteis</p>
        </div>

        <div className="flex items-start gap-2 text-sm text-white/90">
          <span className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-black rounded-full font-black text-xs shrink-0">
            3
          </span>
          <p>Pague o restante na entrega (todas as formas)</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Check className="w-4 h-4 text-green-400" />
          <span>Até 6 jerseys</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Package className="w-4 h-4 text-blue-400" />
          <span>Pode recusar</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <CreditCard className="w-4 h-4 text-purple-400" />
          <span>Todos métodos</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span>10 dias úteis</span>
        </div>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-black/30 rounded-lg mb-4">
        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-white/70">
          Não gostou? Recuse! (Frete não reembolsável)
        </p>
      </div>

      {/* Toggle Checkbox */}
      <motion.label
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl cursor-pointer transition-all"
      >
        <input
          type="checkbox"
          checked={payOnDeliveryEnabled}
          onChange={handleToggle}
          className="w-5 h-5 rounded border-2 border-white/40 bg-transparent checked:bg-yellow-500 checked:border-yellow-500 cursor-pointer"
        />
        <div className="flex-1">
          <p className="text-white font-bold text-sm">
            {payOnDeliveryEnabled ? '✅ Ativado!' : '☑️ Ativar pagamento na entrega'}
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            {payOnDeliveryEnabled
              ? 'Você pagará só o frete no checkout'
              : 'Clique para pagar só quando receber'}
          </p>
        </div>
      </motion.label>

      {payOnDeliveryEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            <p className="text-green-300 text-xs font-medium">
              Pagamento na entrega ativado! Adicione até 6 jerseys ao carrinho.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
