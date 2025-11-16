'use client'

/**
 * StructuredData Component
 * Adiciona schema.org JSON-LD para SEO melhorado
 *
 * @param {string} type - 'organization' | 'product' | 'website'
 * @param {object} data - Dados customizados para o schema
 */
export default function StructuredData({ type = 'organization', data = {} }) {
  const schemas = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Foltz Fanwear',
      url: 'https://foltz.com.ar',
      logo: 'https://foltz.com.ar/images/logo/logo-white.png',
      description: 'Los mejores jerseys de fútbol importados. Argentina, Brasil, Europa. Envío a toda Argentina.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AR',
        addressRegion: 'Argentina',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Spanish'],
      },
      sameAs: [
        'https://instagram.com/foltzfanwear',
        'https://facebook.com/foltzfanwear',
      ],
      ...data,
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Foltz Fanwear',
      url: 'https://foltz.com.ar',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://foltz.com.ar/buscar?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      ...data,
    },
    product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      ...data,
    },
    store: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Foltz Fanwear',
      url: 'https://foltz.com.ar',
      description: 'Tienda de jerseys de fútbol importados premium',
      currenciesAccepted: 'ARS',
      paymentAccepted: 'Credit Card, Debit Card, Cash',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AR',
      },
      ...data,
    },
  }

  const schema = schemas[type] || schemas.organization

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
