import { getCachedProducts } from '@/lib/productCache'
import ProductosContent from './ProductosContent'

export const metadata = {
  title: 'Todos los Productos | Foltz Fanwear',
  description: 'Explora nuestra colección completa de camisetas de fútbol. Camisetas retro y actuales de las mejores ligas del mundo.',
}

// Revalidar a cada 1 hora
export const revalidate = 3600

export default async function ProductosPage() {
  // Fetch all products (cached)
  const products = await getCachedProducts()

  return <ProductosContent products={products} />
}
