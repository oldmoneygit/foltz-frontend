# Foltz Fanwear - E-commerce de Jerseys Importados

Loja online de jerseys de fútbol importados para el mercado argentino.

## 🎨 Identidad Visual

- **Colores:**
  - Amarillo Limão: `#DAF10D` (RGB 218, 241, 13)
  - Azul Marinho Profundo: `#02075E` (RGB 2, 7, 94)

- **Tipografía:** Sink (bold, streetwear)
- **Estética:** Underground, streetwear, neon, moderna

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **E-commerce:** Shopify Storefront API
- **Icons:** Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## 🛠️ Configuración

1. Crear una cuenta en Shopify
2. Habilitar Shopify Storefront API
3. Copiar las credenciales al archivo `.env.local`
4. Configurar productos en Shopify

## 📄 Estructura del Proyecto

```
foltz-fanwear/
├── src/
│   ├── app/
│   │   ├── page.jsx           # Homepage
│   │   ├── layout.jsx         # Layout principal
│   │   └── globals.css        # Estilos globales
│   └── components/
│       ├── Header.jsx         # Header con fondo amarillo limão
│       ├── Hero.jsx           # Hero section
│       ├── BestSellers.jsx    # Carrossel de best sellers
│       ├── HowItWorks.jsx     # Diferenciales
│       ├── Categories.jsx     # Grid de categorías
│       ├── Newsletter.jsx     # CTA Newsletter
│       └── Footer.jsx         # Footer azul marinho
├── public/
│   └── images/
│       ├── logo/              # Logo Foltz
│       ├── hero/              # Imágenes hero
│       └── seedream/          # Productos lifestyle
└── tailwind.config.js         # Configuración Tailwind
```

## 🎯 Funcionalidades

- ✅ Homepage completa con diseño único
- ✅ Header amarillo limão con logo centralizada
- ✅ Hero section con CTA
- ✅ Grid de Best Sellers
- ✅ Sección de Diferenciales
- ✅ Categorías (Argentina, Brasil, Europa)
- ✅ Newsletter signup
- ✅ Footer completo
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Animaciones suaves con Framer Motion
- ⏳ Integración Shopify (próximamente)
- ⏳ Carrito de compras
- ⏳ Wishlist
- ⏳ Páginas de producto
- ⏳ Checkout

## 🌐 Deploy

```bash
# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📝 Próximos Pasos

1. Integrar Shopify Storefront API
2. Crear páginas de producto individual
3. Implementar carrito de compras
4. Agregar wishlist/favoritos
5. Crear páginas institucionales (FAQ, Contacto, etc.)
6. Implementar sistema de búsqueda
7. Configurar checkout de Shopify
8. Optimizar SEO
9. Deploy en Vercel

## 📧 Contacto

- **Email:** contacto@foltzfanwear.com
- **Instagram:** @foltzfanwear
- **WhatsApp:** +54 9 11 1234-5678

---

© 2025 Foltz Fanwear - Hecho con ⚽ en Argentina
