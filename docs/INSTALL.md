# Guia de Instalação - Foltz Fanwear

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn instalado
- Git instalado (opcional)

## Passo a Passo

### 1. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso irá instalar todas as dependências necessárias:
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Lucide React
- E outras...

### 2. Configurar Variáveis de Ambiente (Opcional no momento)

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` quando tiver as credenciais do Shopify.

### 3. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor irá iniciar em [http://localhost:3000](http://localhost:3000)

### 4. Visualizar o Site

Abra seu navegador e acesse:
```
http://localhost:3000
```

Você deverá ver a homepage completa da Foltz Fanwear com:
- Header amarelo limão com logo centralizada
- Hero section com imagem seedream
- Best Sellers carousel
- Seção "Por Qué Foltz?"
- Grid de Categorias
- Newsletter signup
- Footer azul marinho

## Build para Produção

```bash
# Criar build otimizado
npm run build

# Executar build de produção
npm start
```

## Comandos Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build otimizado para produção
- `npm start` - Inicia servidor com build de produção
- `npm run lint` - Verifica erros de código

## Estrutura de Componentes

### Header
- Fundo: Amarelo limão (#DAF10D)
- Logo centralizada
- Menu com categorias
- Busca
- Wishlist e Carrinho

### Hero Section
- Imagem de fundo (seedream jersey Argentina)
- Gradientes para legibilidade
- CTAs: "Explorar Colección" e "Más Vendidos"
- Stats: 500+ Jerseys, 100% Auténticos, 24/7 Soporte

### Best Sellers
- Grid responsivo de produtos
- Cards com imagem, nome, preço
- Botão wishlist e add to cart
- Badge "Best Seller"

### How It Works
- 6 cards de diferenciais:
  1. Importación Directa
  2. 100% Auténticos
  3. Envío Nacional
  4. Compra Segura
  5. Calidad Premium
  6. Soporte 24/7
- Stats: 15K+ Clientes, 500+ Jerseys, 4.9★, 100% Satisfacción

### Categories
- Grid masonry responsivo
- 6 categorías principales:
  - Argentina (featured)
  - Brasil
  - Premier League
  - La Liga
  - Serie A
  - Retro Collection (featured)
- Hover effects com glow amarelo

### Newsletter
- Fundo amarelo limão
- Form de signup
- 3 benefícios: 10% Desconto, 24H Acceso Anticipado, VIP Ofertas

### Footer
- Fundo azul marinho (#02075E)
- 4 colunas: Logo, Empresa, Comprar, Ayuda
- Redes sociais
- Informações de contato
- Métodos de pagamento
- Copyright

## Cores da Marca

```css
/* Amarelo Limão */
#DAF10D
RGB(218, 241, 13)

/* Azul Marinho Profundo */
#02075E
RGB(2, 7, 94)

/* Preto */
#000000

/* Branco */
#FFFFFF
```

## Tipografia

- Fonte principal: Inter (temporária, substituir por Sink)
- Pesos: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)
- Tracking amplo em títulos
- Uppercase em textos importantes

## Responsividade

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Grid de Produtos
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 4 colunas

## Problemas Comuns

### Erro: "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port 3000 already in use"
```bash
# Use outra porta
npm run dev -- -p 3001
```

### Imagens não carregam
- Verifique se as imagens estão na pasta `/public/images/`
- Verifique os caminhos no código

## Próximos Passos

1. **Integrar Shopify:**
   - Criar conta Shopify
   - Habilitar Storefront API
   - Adicionar credenciais em `.env.local`

2. **Adicionar Produtos:**
   - Criar produtos no Shopify
   - Configurar coleções
   - Adicionar imagens dos produtos

3. **Implementar Funcionalidades:**
   - Carrinho de compras
   - Wishlist/Favoritos
   - Páginas de produto individual
   - Checkout Shopify
   - Busca funcional

4. **Deploy:**
   - Conectar repositório ao Vercel
   - Configurar variáveis de ambiente
   - Deploy automático

## Suporte

Se tiver problemas, verifique:
1. Versão do Node.js (deve ser 18+)
2. Logs do terminal para erros específicos
3. Console do navegador para erros de frontend

---

Bom desenvolvimento! 🚀⚽
