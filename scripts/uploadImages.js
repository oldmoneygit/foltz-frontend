const {
  getProductByHandle,
  addProductImage,
  deleteProductImage
} = require('../src/lib/shopifyAdmin.js')

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('\n🛍️  FOLTZ - Gerenciar Imagens de Produtos\n')
    console.log('Adicionar imagem:')
    console.log('  npm run upload-image add <handle> <url-da-imagem> [texto-alt]\n')
    console.log('Exemplo:')
    console.log('  npm run upload-image add barcelona-09-10-home-size-s-xxl https://exemplo.com/img.jpg "Barcelona Home"\n')
    console.log('Remover imagem:')
    console.log('  npm run upload-image remove <handle> <image-id>\n')
    console.log('Listar imagens:')
    console.log('  npm run upload-image list <handle>\n')
    process.exit(0)
  }

  const command = args[0]
  const handle = args[1]

  try {
    console.log('\n⏳ Buscando produto...')
    const product = await getProductByHandle(handle)

    if (!product) {
      console.error(`❌ Erro: Produto "${handle}" não encontrado!`)
      process.exit(1)
    }

    console.log(`✅ Produto encontrado: ${product.title}\n`)

    switch (command) {
      case 'add':
        const imageUrl = args[2]
        const altText = args[3] || product.title

        if (!imageUrl) {
          console.error('❌ Erro: URL da imagem não fornecida!')
          process.exit(1)
        }

        console.log('⏳ Adicionando imagem...')
        const result = await addProductImage(product.id, imageUrl, altText)

        if (result.userErrors && result.userErrors.length > 0) {
          console.error('❌ Erros ao adicionar imagem:')
          result.userErrors.forEach(err => {
            console.error(`   - ${err.field}: ${err.message}`)
          })
        } else {
          console.log('✅ Imagem adicionada com sucesso!')
          console.log(`   URL: ${imageUrl}`)
          console.log(`   Alt Text: ${altText}`)
        }
        break

      case 'remove':
        const imageId = args[2]

        if (!imageId) {
          console.error('❌ Erro: ID da imagem não fornecido!')
          console.error('💡 Use "npm run upload-image list <handle>" para ver os IDs das imagens')
          process.exit(1)
        }

        console.log('⏳ Removendo imagem...')
        const deleteResult = await deleteProductImage(product.id, imageId)

        if (deleteResult.userErrors && deleteResult.userErrors.length > 0) {
          console.error('❌ Erros ao remover imagem:')
          deleteResult.userErrors.forEach(err => {
            console.error(`   - ${err.field}: ${err.message}`)
          })
        } else {
          console.log('✅ Imagem removida com sucesso!')
        }
        break

      case 'list':
        console.log('📷 Imagens do produto:\n')

        if (product.images.edges.length === 0) {
          console.log('   (Nenhuma imagem encontrada)')
        } else {
          product.images.edges.forEach((img, idx) => {
            console.log(`${idx + 1}. ID: ${img.node.id}`)
            console.log(`   URL: ${img.node.url}`)
            console.log(`   Alt: ${img.node.altText || '(sem texto alternativo)'}`)
            console.log('')
          })
        }
        break

      default:
        console.error(`❌ Erro: Comando "${command}" não reconhecido!`)
        console.error('   Comandos válidos: add, remove, list')
        process.exit(1)
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    if (error.message.includes('Shopify API Error')) {
      console.error('\n💡 Dica: Verifique se o SHOPIFY_ADMIN_ACCESS_TOKEN está configurado corretamente no .env.local')
    }
    process.exit(1)
  }
}

main()
