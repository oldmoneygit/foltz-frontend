const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const SHOPIFY_API_VERSION = '2024-10'

/**
 * Core GraphQL function to query Shopify Storefront API
 */
async function ShopifyData(query, variables = {}) {
  const URL = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`

  const options = {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables })
  }

  try {
    const response = await fetch(URL, options)
    const data = await response.json()

    if (data.errors) {
      console.error('Shopify GraphQL Errors:', data.errors)
      throw new Error(data.errors[0].message)
    }

    return data
  } catch (error) {
    console.error('Shopify API Error:', error)
    throw new Error(`Failed to fetch from Shopify: ${error.message}`)
  }
}

/**
 * Get all products with pagination support
 * @param {number} limit - Number of products to fetch (max 250)
 * @param {string|null} after - Cursor for pagination
 */
export async function getAllProducts(limit = 250, after = null) {
  const query = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            options {
              id
              name
              values
            }
            variants(first: 25) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await ShopifyData(query, { first: limit, after })

  return response.data.products
}

/**
 * Get products by tag (e.g., league name)
 * @param {string} tag - Tag to filter by
 * @param {number} limit - Number of products to fetch
 */
export async function getProductsByTag(tag, limit = 100) {
  const query = `
    query getProductsByTag($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            options {
              id
              name
              values
            }
            variants(first: 25) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    query: `tag:${tag}`,
    first: limit
  })

  return response.data.products.edges
}

/**
 * Get products by productType OR tag (flexible search)
 * @param {string} searchTerm - Term to search by (will try both productType and tag)
 * @param {number} limit - Number of products to fetch
 */
export async function getProductsByTypeOrTag(searchTerm, limit = 100) {
  const query = `
    query getProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            options {
              id
              name
              values
            }
            variants(first: 25) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  // Try productType first, then tag, then title
  let response = await ShopifyData(query, {
    query: `product_type:${searchTerm}`,
    first: limit
  })

  // If no results, try by tag
  if (!response.data.products.edges || response.data.products.edges.length === 0) {
    response = await ShopifyData(query, {
      query: `tag:${searchTerm}`,
      first: limit
    })
  }

  // If still no results, try by title (for cases like "Argentina Legends")
  if (!response.data.products.edges || response.data.products.edges.length === 0) {
    response = await ShopifyData(query, {
      query: `title:${searchTerm}`,
      first: limit
    })
  }

  return response.data.products.edges
}

/**
 * Get single product by handle with all images
 * @param {string} handle - Product handle (slug)
 */
export async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        productType
        tags
        images(first: 20) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 25) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `

  const response = await ShopifyData(query, { handle })

  return response.data.product
}

/**
 * Get product recommendations (based on Shopify's algorithm)
 * @param {string} productId - Product GID
 */
export async function getProductRecommendations(productId) {
  const query = `
    query getProductRecommendations($productId: ID!) {
      productRecommendations(productId: $productId) {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  `

  const response = await ShopifyData(query, { productId })

  return response.data.productRecommendations || []
}

/**
 * Search products
 * @param {string} searchQuery - Search term
 * @param {number} limit - Number of results
 */
export async function searchProducts(searchQuery, limit = 20) {
  const query = `
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    query: searchQuery,
    first: limit
  })

  return response.data.products.edges
}

/**
 * Create a cart with multiple items (Nova Cart API - substituiu Checkout API)
 * @param {Array} lineItems - Array of {variantId, quantity}
 * @returns {Promise<Object>} Cart object with checkoutUrl
 */
export async function createCheckoutWithItems(lineItems) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    input: {
      lines: lineItems.map(item => {
        const line = {
          merchandiseId: item.variantId,
          quantity: item.quantity
        }

        // Adicionar custom attributes se existirem (personalização)
        if (item.attributes && item.attributes.length > 0) {
          line.attributes = item.attributes
        }

        return line
      })
    }
  })

  if (response.data.cartCreate.userErrors.length > 0) {
    throw new Error(response.data.cartCreate.userErrors[0].message)
  }

  // Adaptar resposta para manter compatibilidade com código existente
  const cart = response.data.cartCreate.cart
  return {
    id: cart.id,
    webUrl: cart.checkoutUrl, // Mapear checkoutUrl para webUrl
    lineItems: cart.lines, // Mapear lines para lineItems
    subtotalPrice: cart.cost.subtotalAmount,
    totalPrice: cart.cost.totalAmount
  }
}

/**
 * Create a cart (legacy - single item)
 * @param {string} variantId - Variant GID
 * @param {number} quantity - Quantity
 */
export async function createCheckout(variantId, quantity = 1) {
  return createCheckoutWithItems([{ variantId, quantity }])
}

/**
 * Update cart line items (Nova Cart API)
 * @param {string} cartId - Cart GID
 * @param {Array} lineItems - Array of {variantId, quantity}
 */
export async function updateCheckout(cartId, lineItems) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 50) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    cartId,
    lines: lineItems.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity
    }))
  })

  if (response.data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.data.cartLinesUpdate.userErrors[0].message)
  }

  const cart = response.data.cartLinesUpdate.cart
  return {
    id: cart.id,
    webUrl: cart.checkoutUrl,
    lineItems: cart.lines,
    subtotalPrice: cart.cost.subtotalAmount,
    totalPrice: cart.cost.totalAmount
  }
}

/**
 * Helper function to get league data from product tags
 * Returns league info based on productType field
 */
export function getLeagueFromProduct(product) {
  // The productType in Shopify contains the league name
  const leagueName = product.productType || 'Other'

  // Map league names to colors, countries, flags and images
  const leagueMap = {
    'Bundesliga': {
      color: '#D20515',
      country: 'Alemanha',
      flag: '🇩🇪',
      image: '/images/leagues/bundesliga.jpg'
    },
    'Eredivisie': {
      color: '#FF6C00',
      country: 'Holanda',
      flag: '🇳🇱',
      image: '/images/leagues/eredivisie.jpg'
    },
    'La Liga': {
      color: '#FF0000',
      country: 'Espanha',
      flag: '🇪🇸',
      image: '/images/leagues/la liga.jpg'
    },
    'Liga MX': {
      color: '#006847',
      country: 'México',
      flag: '🇲🇽',
      image: '/images/leagues/liga mx.jpg'
    },
    'Ligue 1': {
      color: '#0055A4',
      country: 'França',
      flag: '🇫🇷',
      image: '/images/leagues/Ligue 1.jpg'
    },
    'Manga Longa': {
      color: '#1a1a1a',
      country: 'Internacional',
      flag: '🌍',
      image: '/images/leagues/manga longa.jpg'
    },
    'MLS': {
      color: '#C8102E',
      country: 'EUA',
      flag: '🇺🇸',
      image: '/images/leagues/mls.jpg'
    },
    'Premier League': {
      color: '#3D195B',
      country: 'Inglaterra',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      image: '/images/leagues/premier league.jpg'
    },
    'Primeira Liga': {
      color: '#00843D',
      country: 'Portugal',
      flag: '🇵🇹',
      image: '/images/leagues/primeira liga.jpg'
    },
    'Sul-Americana': {
      color: '#009639',
      country: 'América do Sul',
      flag: '🌎',
      image: '/images/leagues/sul-americana.jpg'
    },
    'Serie A': {
      color: '#008FD7',
      country: 'Itália',
      flag: '🇮🇹',
      image: '/images/leagues/serie A.jpg'
    },
  }

  const leagueInfo = leagueMap[leagueName] || {
    color: '#000000',
    country: 'Internacional',
    flag: '🌍',
    image: '/images/leagues/default.jpg'
  }

  return {
    name: leagueName,
    ...leagueInfo
  }
}

/**
 * Get all unique leagues from products
 */
export async function getAllLeagues() {
  const allProducts = await getAllProducts(250)
  const leagues = new Map() // Changed to Map to store count

  allProducts.edges.forEach(({ node: product }) => {
    if (product.productType) {
      const currentCount = leagues.get(product.productType) || 0
      leagues.set(product.productType, currentCount + 1)
    }
  })

  const dynamicLeagues = Array.from(leagues.entries()).map(([name, count]) => {
    const leagueInfo = getLeagueFromProduct({ productType: name })
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    return {
      id: slug,
      slug: slug,
      name,
      productCount: count, // Add product count
      ...leagueInfo
    }
  })

  // Adicionar coleções especiais manualmente
  const specialCollections = [
    {
      id: 'national-teams',
      slug: 'national-teams',
      name: 'National Teams',
      productCount: 0, // Será calculado dinamicamente na página
      country: 'Internacional',
      color: '#DAF10D',
      image: '/images/leagues/national teams.jpg'
    },
    {
      id: 'argentina-legends',
      slug: 'argentina-legends',
      name: 'Argentina Legends',
      productCount: 0,
      country: 'Argentina',
      color: '#75AADB',
      image: '/images/leagues/argentina legends.jpg'
    },
    {
      id: 'retro',
      slug: 'retro',
      name: 'Retro Collection',
      productCount: 0,
      country: 'Clássicos',
      color: '#8B7355',
      image: '/images/leagues/retro.jpg'
    }
  ]

  return [...dynamicLeagues, ...specialCollections]
}

/**
 * Helper function to find variant ID by size
 * @param {Array} variants - Product variants from Shopify
 * @param {string} size - Size to search for (e.g., 'M', 'L', 'XL')
 * @returns {string|null} Variant GID or null if not found
 */
export function findVariantBySize(variants, size) {
  if (!variants || !variants.edges) return null

  const variant = variants.edges.find(({ node }) => {
    if (!node) return false

    // Handle nested node.node structure (from some cart data formats)
    const variantData = node.node || node

    // First check selectedOptions (most reliable for Storefront API)
    if (variantData.selectedOptions) {
      const sizeOption = variantData.selectedOptions.find(opt =>
        opt.name === 'Size' || opt.name === 'Tamanho' || opt.name === 'Talla'
      )
      if (sizeOption && sizeOption.value === size) return true
    }

    // Fallback to title check (if title exists)
    if (variantData.title) {
      return variantData.title === size || variantData.title.includes(size)
    }

    return false
  })

  if (!variant) return null
  // Handle nested node.node structure for ID
  return variant.node.node?.id || variant.node.id
}
