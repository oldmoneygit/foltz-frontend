// Helper functions to format Shopify data for our components

export function formatShopifyProduct(shopifyProduct) {
  const {
    id,
    title,
    handle,
    images,
    variants,
    priceRange,
    compareAtPriceRange,
    collections,
    tags,
    description,
    descriptionHtml,
    options
  } = shopifyProduct

  // Get main image
  const mainImage = images.edges[0]?.node?.url || '/images/placeholder.jpg'

  // Get all images
  const allImages = images.edges.map(edge => edge.node.url)

  // Get price info
  const price = parseFloat(priceRange.minVariantPrice.amount)
  const compareAtPrice = compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(compareAtPriceRange.minVariantPrice.amount)
    : null

  // Get variants
  const productVariants = variants.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: parseFloat(edge.node.price.amount),
    compareAtPrice: edge.node.compareAtPrice
      ? parseFloat(edge.node.compareAtPrice.amount)
      : null,
    availableForSale: edge.node.availableForSale,
    selectedOptions: edge.node.selectedOptions,
    image: edge.node.image?.url || mainImage
  }))

  // Get sizes from options
  const sizeOption = options?.find(opt => opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'tamanho')
  const sizes = sizeOption ? sizeOption.values : []

  // Get league/collection info
  const league = collections?.edges[0]?.node ? {
    name: collections.edges[0].node.title,
    handle: collections.edges[0].node.handle
  } : null

  return {
    id: id.split('/').pop(), // Get just the ID number
    shopifyId: id,
    name: title,
    slug: handle,
    image: mainImage,
    main_image: mainImage,
    images: allImages,
    gallery: allImages,
    price: price,
    regularPrice: compareAtPrice,
    compareAtPrice: compareAtPrice,
    variants: productVariants,
    sizes: sizes,
    stock: productVariants.some(v => v.availableForSale) ? 'available' : 'soldout',
    tags: tags || [],
    league: league,
    description: description || '',
    descriptionHtml: descriptionHtml || '',
    options: options || []
  }
}

export function formatShopifyProducts(shopifyProducts) {
  return shopifyProducts.map(edge => formatShopifyProduct(edge.node))
}

// Format price to ARS currency
export function formatPrice(amount, locale = 'es-AR', currency = 'ARS') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

// Get variant by selected options
export function getVariantByOptions(variants, selectedOptions) {
  return variants.find(variant => {
    return variant.selectedOptions.every(option => {
      return selectedOptions[option.name] === option.value
    })
  })
}

// Check if product has discount
export function hasDiscount(product) {
  return product.compareAtPrice && product.compareAtPrice > product.price
}

// Calculate discount percentage
export function getDiscountPercentage(product) {
  if (!hasDiscount(product)) return 0

  const discount = ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
  return Math.round(discount)
}

// Extract Shopify ID from GID
export function extractShopifyId(gid) {
  return gid.split('/').pop()
}

// Build Shopify GID
export function buildShopifyGid(type, id) {
  return `gid://shopify/${type}/${id}`
}
