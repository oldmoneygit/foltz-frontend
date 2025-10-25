const readline = require('readline')
const {
  listAllProducts,
  getProductByHandle,
  updateProductPrice,
  updateProductTitle,
  updateProductDescription,
  addProductImage,
  deleteProductImage,
  buildGid
} = require('../src/lib/shopifyAdmin.js')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('\n🛍️  FOLTZ - Gerenciador de Produtos Shopify\n')

  try {
    // Listar produtos
    console.log('📦 Carregando produtos...\n')
    const products = await listAllProducts()

    console.log('Produtos disponíveis:\n')
    products.forEach((product, index) => {
      const price = product.variants?.edges[0]?.node?.price || 'N/A'
      console.log(`${index + 1}. ${product.title} (${product.handle}) - ARS ${price}`)
    })

    console.log('\n')
    const productIndex = await question('Digite o número do produto que deseja editar: ')
    const selectedProduct = products[parseInt(productIndex) - 1]

    if (!selectedProduct) {
      console.log('❌ Produto não encontrado!')
      rl.close()
      return
    }

    console.log(`\n✅ Produto selecionado: ${selectedProduct.title}\n`)

    // Menu de opções
    console.log('O que você deseja fazer?\n')
    console.log('1. Atualizar preço')
    console.log('2. Atualizar título')
    console.log('3. Atualizar descrição')
    console.log('4. Adicionar imagem')
    console.log('5. Remover imagem')
    console.log('0. Sair\n')

    const option = await question('Escolha uma opção: ')

    switch (option) {
      case '1':
        // Atualizar preço
        const newPrice = await question('Digite o novo preço: ')
        const newCompareAt = await question('Digite o preço comparativo (ou deixe vazio): ')

        console.log('\n⏳ Atualizando preço...')
        await updateProductPrice(
          selectedProduct.id,
          parseFloat(newPrice),
          newCompareAt ? parseFloat(newCompareAt) : null
        )
        console.log('✅ Preço atualizado com sucesso!')
        break

      case '2':
        // Atualizar título
        const newTitle = await question('Digite o novo título: ')

        console.log('\n⏳ Atualizando título...')
        await updateProductTitle(selectedProduct.id, newTitle)
        console.log('✅ Título atualizado com sucesso!')
        break

      case '3':
        // Atualizar descrição
        console.log('Digite a nova descrição (formato HTML permitido):')
        const newDescription = await question('')

        console.log('\n⏳ Atualizando descrição...')
        await updateProductDescription(selectedProduct.id, newDescription)
        console.log('✅ Descrição atualizada com sucesso!')
        break

      case '4':
        // Adicionar imagem
        const imageUrl = await question('Digite a URL da imagem: ')
        const altText = await question('Digite o texto alternativo (alt): ')

        console.log('\n⏳ Adicionando imagem...')
        await addProductImage(selectedProduct.id, imageUrl, altText)
        console.log('✅ Imagem adicionada com sucesso!')
        break

      case '5':
        // Remover imagem
        console.log('\nImagens atuais:')
        const productDetails = await getProductByHandle(selectedProduct.handle)
        productDetails.images.edges.forEach((img, idx) => {
          console.log(`${idx + 1}. ${img.node.url}`)
        })

        const imgIndex = await question('\nDigite o número da imagem a remover: ')
        const selectedImage = productDetails.images.edges[parseInt(imgIndex) - 1]

        if (selectedImage) {
          console.log('\n⏳ Removendo imagem...')
          await deleteProductImage(selectedProduct.id, selectedImage.node.id)
          console.log('✅ Imagem removida com sucesso!')
        } else {
          console.log('❌ Imagem não encontrada!')
        }
        break

      case '0':
        console.log('\n👋 Até logo!')
        break

      default:
        console.log('\n❌ Opção inválida!')
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    if (error.message.includes('Shopify API Error')) {
      console.error('\n💡 Dica: Verifique se o SHOPIFY_ADMIN_ACCESS_TOKEN está configurado corretamente no .env.local')
    }
  } finally {
    rl.close()
  }
}

main()
