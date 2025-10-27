'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const Footer = () => {
  const { isDark } = useTheme()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { name: 'Nuestra Historia', href: '/historia' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Trabaja con Nosotros', href: '/careers' },
    ],
    shop: [
      { name: 'Argentina', href: '/ligas/argentina' },
      { name: 'Brasil', href: '/ligas/brasil' },
      { name: 'Europa', href: '/ligas/europa' },
      { name: 'La Liga', href: '/liga/la-liga' },
      { name: 'Premier League', href: '/liga/premier-league' },
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
    <footer className="bg-gradient-to-b from-black via-zinc-950 to-black text-white border-t-4 border-brand-yellow relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/5 via-transparent to-transparent pointer-events-none" />
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="relative w-40 h-20">
              <Image
                src={isDark ? "/images/logo/logo-white.png" : "/images/logo/logo.png"}
                alt="Foltz Fanwear"
                fill
                className={`object-contain ${isDark ? '' : 'brightness-0 invert'}`}
              />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Los mejores jerseys de fútbol importados. Autenticidad garantizada, envío a toda Argentina.
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/foltzfanwear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-brand-yellow text-black rounded-full hover:bg-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/foltzfanwear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-brand-yellow text-black rounded-full hover:bg-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/foltzfanwear"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-brand-yellow text-black rounded-full hover:bg-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-brand-yellow font-black text-lg mb-4 uppercase tracking-wider">
              Empresa
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-yellow transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-brand-yellow font-black text-lg mb-4 uppercase tracking-wider">
              Comprar
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-yellow transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-brand-yellow font-black text-lg mb-4 uppercase tracking-wider">
              Ayuda
            </h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-brand-yellow transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-brand-yellow/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="text-brand-yellow flex-shrink-0" size={20} />
              <a href="mailto:contacto@foltzfanwear.com" className="hover:text-brand-yellow transition-colors">
                contacto@foltzfanwear.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Phone className="text-brand-yellow flex-shrink-0" size={20} />
              <a href="tel:+5491112345678" className="hover:text-brand-yellow transition-colors">
                +54 9 11 1234-5678
              </a>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <MapPin className="text-brand-yellow flex-shrink-0" size={20} />
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-brand-yellow/30">
          <p className="text-center text-sm text-gray-400 mb-4">Métodos de pago aceptados</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="bg-white px-4 py-2 rounded text-black font-bold text-xs">VISA</div>
            <div className="bg-white px-4 py-2 rounded text-black font-bold text-xs">MASTERCARD</div>
            <div className="bg-white px-4 py-2 rounded text-black font-bold text-xs">AMEX</div>
            <div className="bg-white px-4 py-2 rounded text-black font-bold text-xs">MERCADO PAGO</div>
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
