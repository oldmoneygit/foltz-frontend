'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useStoreMode } from '@/contexts/StoreModeContext'

const Footer = () => {
  const { isDark } = useTheme()
  const { isRetro, isAtuais } = useStoreMode()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { name: 'Nuestra Historia', href: '/historia' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Trabaja con Nosotros', href: '/careers' },
    ],
    shop: [
      { name: 'Premier League', href: '/liga/premier-league' },
      { name: 'La Liga', href: '/liga/la-liga' },
      { name: 'Serie A', href: '/liga/serie-a' },
      { name: 'Ligue 1', href: '/liga/ligue-1' },
      { name: 'Bundesliga', href: '/liga/bundesliga' },
    ],
    help: [
      { name: 'Preguntas Frecuentes', href: '/faq' },
      { name: 'Seguimiento de Pedido', href: '/seguimiento' },
      { name: 'Guía de Tallas', href: '/guia-de-tallas' },
      { name: 'Cambios y Devoluciones', href: '/politica-cambios' },
      { name: 'Política de Privacidad', href: '/privacidade' },
    ],
  }

  return (
    <footer className="bg-black text-white border-t border-white/10 relative">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="relative w-40 h-20">
              <Image
                src="/images/logo/logo-white.png"
                alt="Foltz Fanwear"
                fill
                className={`object-contain ${isRetro ? 'brightness-0 invert sepia saturate-[10] hue-rotate-[5deg]' : ''}`}
              />
              {isRetro && (
                <p className="absolute -bottom-1 left-0 text-[#D4AF37]/60 text-xs">Colección Retro</p>
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {isRetro
                ? 'Camisetas retro históricas. Revive los momentos legendarios del fútbol con réplicas auténticas.'
                : 'Los mejores jerseys de fútbol importados. Réplicas 1:1 Premium, envío a toda Argentina.'
              }
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/foltz.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/foltzfanwear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/foltzfanwear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-black text-base mb-4 uppercase tracking-wider">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-black text-base mb-4 uppercase tracking-wider">
              Comprar
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-white font-black text-base mb-4 uppercase tracking-wider">
              Ayuda
            </h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              <Mail className="text-white/60 flex-shrink-0" size={18} />
              <a href="mailto:contacto@foltzoficial.com" className="hover:text-white transition-colors">
                contacto@foltzoficial.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <Phone className="text-white/60 flex-shrink-0" size={18} />
              <a href="tel:+5592991620674" className="hover:text-white transition-colors">
                +55 92 99162-0674
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <MapPin className="text-white/60 flex-shrink-0" size={18} />
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} Foltz Fanwear. Todos los derechos reservados. | Hecho con ⚽ en Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
