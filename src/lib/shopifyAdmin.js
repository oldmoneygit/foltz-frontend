// Shopify Admin API Service
// Permite gerenciar produtos, preços, imagens e inventário

// Carregar variáveis de ambiente
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

const SHOPIFY_API_VERSION = '2024-01'

async function shopifyAdminRequest(query, variables = {}) {
  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await response.json()

  if (data.errors) {
    throw new Error(`Shopify API Error: ${JSON.stringify(data.errors)}`)
  }

  return data
}

// ========== PRODUTOS ==========

/**
 * Lista todos os produtos
 */
export async function listAllProducts() {
  const query = `
    query {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            status
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                  compareAtPrice
                }
              }
            }
            featuredImage {
              url
            }
            totalInventory
          }
        }
      }
    }
  `

  const response = await shopifyAdminRequest(query)
  return response.data.products.edges.map(edge => edge.node)
}

/**
 * Busca produto por handle ou ID
 */
export async function getProductByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        status
        variants(first: 25) {
          edges {
            node {
              id
              title
              price
              compareAtPrice
              inventoryQuantity
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
      }
    }
  `

  const response = await shopifyAdminRequest(query, { handle })
  return response.data.productByHandle
}

/**
 * Atualiza preço de um produto (todas as variantes)
 */
export async function updateProductPrice(productId, newPrice, newCompareAtPrice = null) {
  // Primeiro, buscar as variantes do produto
  const query = `
    query getProductVariants($id: ID!) {
      product(id: $id) {
        variants(first: 25) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `

  const productData = await shopifyAdminRequest(query, { id: productId })
  const variants = productData.data.product.variants.edges.map(edge => edge.node)

  // Atualizar cada variante
  const updatePromises = variants.map(variant => {
    const mutation = `
      mutation updateVariant($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
            compareAtPrice
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const input = {
      id: variant.id,
      price: String(newPrice),
    }

    if (newCompareAtPrice) {
      input.compareAtPrice = String(newCompareAtPrice)
    }

    return shopifyAdminRequest(mutation, { input })
  })

  return await Promise.all(updatePromises)
}

/**
 * Atualiza título do produto
 */
export async function updateProductTitle(productId, newTitle) {
  const mutation = `
    mutation updateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const input = {
    id: productId,
    title: newTitle,
  }

  const response = await shopifyAdminRequest(mutation, { input })
  return response.data.productUpdate
}

/**
 * Atualiza descrição do produto
 */
export async function updateProductDescription(productId, newDescription) {
  const mutation = `
    mutation updateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          description
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const input = {
    id: productId,
    descriptionHtml: newDescription,
  }

  const response = await shopifyAdminRequest(mutation, { input })
  return response.data.productUpdate
}

/**
 * Adiciona imagem ao produto
 */
export async function addProductImage(productId, imageUrl, altText = '') {
  // Se imageUrl é data URI (base64), usar REST API
  // Se é URL pública, usar GraphQL

  if (imageUrl.startsWith('data:')) {
    // Usar REST API para base64
    return await addProductImageREST(productId, imageUrl, altText)
  }

  // Usar GraphQL para URLs públicas
  const mutation = `
    mutation createProductImage($productId: ID!, $src: String!, $altText: String) {
      productCreateMedia(productId: $productId, media: [{
        originalSource: $src,
        alt: $altText,
        mediaContentType: IMAGE
      }]) {
        media {
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await shopifyAdminRequest(mutation, {
    productId,
    src: imageUrl,
    altText: altText
  })
  return response.data.productCreateMedia
}

/**
 * Adiciona imagem usando REST API (suporta base64)
 */
async function addProductImageREST(productId, base64DataUri, altText = '') {
  // Extrair ID numérico do GID
  const numericId = extractId(productId)

  // Extrair apenas o base64 (remover "data:image/jpeg;base64,")
  const base64Data = base64DataUri.split(',')[1]

  const url = `https://${shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/products/${numericId}/images.json`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({
      image: {
        attachment: base64Data,
        alt: altText
      }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`REST API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // Retornar formato similar ao GraphQL para compatibilidade
  return {
    media: data.image ? [{ image: { url: data.image.src } }] : [],
    userErrors: []
  }
}

/**
 * Remove imagem do produto
 */
export async function deleteProductImage(productId, imageId) {
  const mutation = `
    mutation deleteProductImage($productId: ID!, $imageIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $imageIds) {
        deletedMediaIds
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await shopifyAdminRequest(mutation, {
    productId,
    imageIds: [imageId]
  })
  return response.data.productDeleteMedia
}

/**
 * Atualiza inventário/estoque de uma variante
 */
export async function updateInventory(inventoryItemId, locationId, availableQuantity) {
  const mutation = `
    mutation inventoryAdjustQuantity($input: InventoryAdjustQuantityInput!) {
      inventoryAdjustQuantity(input: $input) {
        inventoryLevel {
          id
          available
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const input = {
    inventoryItemId,
    availableDelta: availableQuantity,
    locationId,
  }

  const response = await shopifyAdminRequest(mutation, { input })
  return response.data.inventoryAdjustQuantity
}

/**
 * Atualiza múltiplos preços em massa
 */
export async function bulkUpdatePrices(updates) {
  // updates = [{ productId, price, compareAtPrice }]
  const promises = updates.map(update =>
    updateProductPrice(update.productId, update.price, update.compareAtPrice)
  )

  return await Promise.all(promises)
}

/**
 * Busca ID da localização padrão (para gerenciar inventário)
 */
export async function getDefaultLocation() {
  const query = `
    query {
      locations(first: 1) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `

  const response = await shopifyAdminRequest(query)
  return response.data.locations.edges[0]?.node
}

// ========== UTILIDADES ==========

/**
 * Extrai ID numérico do GID da Shopify
 */
export function extractId(gid) {
  return gid.split('/').pop()
}

/**
 * Constrói GID da Shopify
 */
export function buildGid(type, id) {
  return `gid://shopify/${type}/${id}`
}

// ES modules - funções já exportadas individualmente com 'export' acima
