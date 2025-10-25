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
 * Create a checkout
 * @param {string} variantId - Variant GID
 * @param {number} quantity - Quantity
 */
export async function createCheckout(variantId, quantity = 1) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 5) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `

  const response = await ShopifyData(query, {
    input: {
      lineItems: [{ variantId, quantity }]
    }
  })

  if (response.data.checkoutCreate.checkoutUserErrors.length > 0) {
    throw new Error(response.data.checkoutCreate.checkoutUserErrors[0].message)
  }

  return response.data.checkoutCreate.checkout
}

/**
 * Update checkout line items
 * @param {string} checkoutId - Checkout GID
 * @param {Array} lineItems - Array of {variantId, quantity}
 */
export async function updateCheckout(checkoutId, lineItems) {
  const formattedLineItems = lineItems.map(item => ({
    variantId: item.variantId,
    quantity: item.quantity
  }))

  const query = `
    mutation checkoutLineItemsReplace($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          lineItems(first: 25) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  price {
                    amount
                  }
                }
              }
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
    checkoutId,
    lineItems: formattedLineItems
  })

  if (response.data.checkoutLineItemsReplace.userErrors.length > 0) {
    throw new Error(response.data.checkoutLineItemsReplace.userErrors[0].message)
  }

  return response.data.checkoutLineItemsReplace.checkout
}

/**
 * Helper function to get league data from product tags
 * Returns league info based on productType field
 */
export function getLeagueFromProduct(product) {
  // The productType in Shopify contains the league name
  const leagueName = product.productType || 'Other'

  // Map league names to colors and countries (based on your leagues_data.json)
  const leagueMap = {
    'Bundesliga': { color: '#D20515', country: 'Alemanha' },
    'Eredivisie': { color: '#FF6C00', country: 'Holanda' },
    'La Liga': { color: '#FF0000', country: 'Espanha' },
    'Liga MX': { color: '#006847', country: 'México' },
    'Ligue 1': { color: '#0055A4', country: 'França' },
    'Manga Longa': { color: '#1a1a1a', country: 'Internacional' },
    'MLS': { color: '#C8102E', country: 'EUA' },
    'Premier League': { color: '#3D195B', country: 'Inglaterra' },
    'Primeira Liga': { color: '#00843D', country: 'Portugal' },
    'Sul-Americana': { color: '#009639', country: 'América do Sul' },
    'Serie A': { color: '#008FD7', country: 'Itália' },
  }

  const leagueInfo = leagueMap[leagueName] || { color: '#000000', country: 'Internacional' }

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
  const leagues = new Set()

  allProducts.edges.forEach(({ node: product }) => {
    if (product.productType) {
      leagues.add(product.productType)
    }
  })

  return Array.from(leagues).map(name => {
    const leagueInfo = getLeagueFromProduct({ productType: name })
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      ...leagueInfo
    }
  })
}
