'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-white/60 hover:text-brand-yellow transition-colors text-sm md:text-base"
    >
      <ChevronLeft className="w-4 h-4" />
      Volver a la tienda
    </Link>
  )
}
