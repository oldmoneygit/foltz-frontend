/**
 * Shopify Image URL Optimizer
 * Adiciona parâmetros de transformação para carregar imagens menores e mais rápidas
 */

/**
 * Otimiza URL de imagem Shopify adicionando parâmetros de tamanho
 * @param {string} url - URL original da Shopify (cdn.shopify.com)
 * @param {number} width - Largura desejada
 * @param {number} height - Altura desejada (opcional)
 * @param {string} crop - Tipo de crop ('center', 'top', 'bottom', 'left', 'right')
 * @returns {string} URL otimizada
 */
export function optimizeShopifyImageUrl(url, width = 400, height = null, crop = 'center') {
  if (!url) return ''

  // Se não for URL da Shopify, retorna como está
  if (!url.includes('cdn.shopify.com')) return url

  // Remove parâmetros existentes
  const baseUrl = url.split('?')[0]

  // Adiciona parâmetros de transformação Shopify
  // Formato: _WIDTHx ou _WIDTHxHEIGHT_crop_CROP
  const fileName = baseUrl.substring(0, baseUrl.lastIndexOf('.'))
  const extension = baseUrl.substring(baseUrl.lastIndexOf('.'))

  // Se já tem transformação, remove
  const cleanFileName = fileName.replace(/_\d+x\d*(_crop_\w+)?$/, '')

  // Cria nova transformação
  let transformation = `_${width}x`
  if (height) {
    transformation += `${height}_crop_${crop}`
  }

  return `${cleanFileName}${transformation}${extension}`
}

/**
 * Gera URL otimizada para thumbnail (cards de produto)
 * @param {string} url - URL original
 * @returns {string} URL para thumbnail (400px)
 */
export function getThumbnailUrl(url) {
  return optimizeShopifyImageUrl(url, 400)
}

/**
 * Gera URL otimizada para preview médio (quick view)
 * @param {string} url - URL original
 * @returns {string} URL para preview (600px)
 */
export function getMediumUrl(url) {
  return optimizeShopifyImageUrl(url, 600)
}

/**
 * Gera URL otimizada para imagem grande (página do produto)
 * @param {string} url - URL original
 * @returns {string} URL para imagem grande (1000px)
 */
export function getLargeUrl(url) {
  return optimizeShopifyImageUrl(url, 1000)
}

/**
 * Gera placeholder blur em base64 (cinza escuro)
 * @returns {string} Base64 data URL
 */
export function getBlurPlaceholder() {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTgxODE4Ii8+PC9zdmc+'
}

/**
 * Preconnect ao CDN da Shopify (chamar no head)
 * @returns {string[]} Array de URLs para preconnect
 */
export function getPreconnectUrls() {
  return [
    'https://cdn.shopify.com',
  ]
}

/**
 * Gera srcSet responsivo para diferentes tamanhos de tela
 * @param {string} url - URL original
 * @returns {string} srcSet string
 */
export function getResponsiveSrcSet(url) {
  if (!url) return ''

  const sizes = [200, 400, 600, 800]

  return sizes
    .map(size => `${optimizeShopifyImageUrl(url, size)} ${size}w`)
    .join(', ')
}
