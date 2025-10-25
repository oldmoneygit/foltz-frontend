import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import BackButton from '@/components/product/BackButton'
import { getProductBySlug, getAllProductSlugs, parseSizes } from '@/utils/shopifyData'

// Generate static params for all products
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs
}

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Producto no encontrado - Foltz Fanwear',
    }
  }

  return {
    title: `${product.name} - Foltz Fanwear`,
    description: `Compra ${product.name} en Foltz Fanwear. Jerseys exclusivos y auténticos.`,
    openGraph: {
      title: product.name,
      description: `AR$${product.price.toLocaleString()}`,
      images: [
        {
          url: product.gallery?.[0],
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
  }
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Producto no encontrado</h1>
          <p className="text-gray-400 mb-8">El producto que buscás no existe.</p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-brand-yellow text-black font-black uppercase tracking-wide rounded-full hover:bg-yellow-400 transition-colors"
          >
            Volver a la tienda
          </a>
        </div>
      </div>
    )
  }

  // Format images paths (prepend /)
  const galleryImages = product.images && product.images.length > 0
    ? product.images.map((img) => `/${img}`)
    : ['/images/placeholder-product.jpg']

  // Parse sizes from string like "Size S-XXL" to array ["S", "M", "L", "XL", "XXL"]
  const sizesArray = parseSizes(product.sizes)

  // Enhanced product with parsed sizes
  const enhancedProduct = {
    ...product,
    gallery: galleryImages,
    sizes: sizesArray,
    description: `
      <h2>${product.name}</h2>
      <p>Jersey original de alta calidad. Tela premium con tecnología de secado rápido.</p>
      <h3>Características:</h3>
      <ul>
        <li>Material: Poliéster de alta calidad</li>
        <li>Tecnología Dri-FIT</li>
        <li>Diseño oficial de la temporada</li>
        <li>Tallas disponibles: ${product.sizes}</li>
        <li>Calidad Premium 1:1</li>
      </ul>
      <h3>Información de la Liga:</h3>
      <p>Liga: ${product.league.name} (${product.league.country})</p>
    `,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-6 md:pt-8 pb-4 md:pb-6">
          <BackButton />
        </div>

        {/* Product Section */}
        <div className="container mx-auto px-4 pb-8 md:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Left Column - Gallery */}
            <div>
              <ProductGallery images={galleryImages} productName={enhancedProduct.name} />
            </div>

            {/* Right Column - Product Info */}
            <div>
              <ProductInfo product={enhancedProduct} />
            </div>
          </div>
        </div>

        {/* Description Section */}
        {enhancedProduct.description && (
          <div className="container mx-auto px-4 pb-8 md:pb-12">
            <div className="bg-white/5 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
              <div
                className="text-white/80 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: enhancedProduct.description }}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
