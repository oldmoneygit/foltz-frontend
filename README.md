# 🏆 Foltz Fanwear - E-commerce de Camisas de Futebol

**Loja oficial de camisas de futebol retro e atuais** - Argentina

![Status](https://img.shields.io/badge/Status-Ativo-success)
![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)
![Shopify](https://img.shields.io/badge/Shopify-Integrado-96bf48)

---

## 📋 Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Documentação](#documentação)
- [Produtos](#produtos)
- [Deploy](#deploy)

---

## 🎯 Sobre

Foltz Fanwear é uma plataforma de e-commerce especializada em camisas de futebol de todas as ligas mundiais, oferecendo:

- ✅ **500+ produtos** de todas as ligas principais
- ✅ **Integração com Shopify** para gestão de inventário
- ✅ **Design responsivo** otimizado para mobile
- ✅ **Preços diferenciados** por tipo de produto
- ✅ **Sistema de cache inteligente** para performance

### 💰 Preços Atuais

| Tipo | Preço | Comparado | Desconto |
|------|-------|-----------|----------|
| 👕 **Jerseys Normais** | ARS 35.900 | ~~ARS 53.850~~ | 33% OFF |
| 👔 **Manga Longa** | ARS 39.900 | ~~ARS 59.850~~ | 33% OFF |

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 14.2.0** - Framework React
- **React 18.3.1** - Biblioteca UI
- **Tailwind CSS 3.4.1** - Styling
- **Framer Motion 11.0.0** - Animações
- **Embla Carousel** - Carrosséis de produtos

### Backend & Integrações
- **Shopify Admin API** - Gestão de produtos
- **Shopify Storefront API** - Dados do cliente
- **Python 3.x** - Scripts de processamento
- **Node.js** - Automações e scripts

### Ferramentas
- **ESLint** - Qualidade de código
- **PostCSS** - Processamento CSS
- **dotenv** - Variáveis de ambiente

---

## 📁 Estrutura do Projeto

```
Foltz/
├── 📄 README.md                    # Este arquivo
├── 📦 package.json                 # Dependências Node.js
├── 🐍 requirements.txt             # Dependências Python
│
├── 📂 src/                         # Código-fonte da aplicação
│   ├── app/                        # Páginas Next.js
│   ├── components/                 # Componentes React
│   ├── contexts/                   # Context API
│   ├── hooks/                      # Custom Hooks
│   ├── lib/                        # Bibliotecas e utilitários
│   └── utils/                      # Funções auxiliares
│
├── 📂 scripts/                     # Scripts de automação
│   ├── python/                     # Scripts Python
│   ├── *.mjs                       # Scripts Node.js (ESM)
│   └── *.js                        # Scripts Node.js (CommonJS)
│
├── 📂 data/                        # Dados dos produtos
│   ├── leagues_data.json           # Dados das ligas
│   ├── leagues_summary.json        # Resumo das ligas
│   └── *.csv                       # CSVs para Shopify
│
├── 📂 public/                      # Arquivos públicos estáticos
│   ├── images/                     # Imagens da loja
│   └── Leagues/                    # Imagens dos produtos
│
├── 📂 leagues/                     # Imagens organizadas por liga
│
├── 📂 docs/                        # Documentação completa
│   ├── precos/                     # Docs sobre preços
│   ├── ux-ui/                      # Docs sobre design
│   ├── deploy/                     # Guias de deploy
│   ├── shopify/                    # Integração Shopify
│   └── historico/                  # Documentos antigos
│
├── 📂 references/                  # Material de referência
│   ├── inspiration/                # Sites de inspiração
│   ├── id_visual/                  # Identidade visual
│   └── seedream/                   # Referências de design
│
├── 📂 shopify-themes/              # Temas Shopify
│   ├── impact/                     # Tema Impact
│   └── shopify-theme-foltz/        # Tema customizado
│
└── 📂 archive/                     # Arquivos históricos

```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ 
- Python 3.7+
- NPM ou Yarn
- Conta Shopify (para integração)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/foltz-fanwear.git
cd foltz-fanwear
```

2. **Instale as dependências Node.js**
```bash
npm install
```

3. **Instale as dependências Python**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz:

```env
# Shopify
SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx

# Next.js
NEXT_PUBLIC_SITE_URL=https://seu-site.com
```

5. **Execute o projeto**
```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint
```

### Shopify

```bash
# Atualizar preços no Shopify
npm run update-shopify-prices

# Gerar CSV de produtos
npm run generate-csv

# Upload de imagens
npm run upload-images-all

# Testar conexão
npm run test-shopify
```

### Processamento de Dados

```bash
# Atualizar preços em CSVs
npm run update-prices-by-type

# Processar imagens
python scripts/python/process_images_claude.py

# Organizar ligas
python scripts/python/organize_leagues.py
```

---

## 📚 Documentação

### Guias Principais

| Documento | Descrição |
|-----------|-----------|
| [🏷️ Atualização de Preços](docs/precos/EXECUTAR-ATUALIZACAO-SHOPIFY.md) | Como atualizar preços no Shopify |
| [🎨 Guia de UX/UI](docs/ux-ui/) | Documentação de design e melhorias |
| [🚀 Deploy no Vercel](docs/deploy/) | Como fazer deploy da aplicação |
| [🛒 Integração Shopify](docs/shopify/) | Setup e configuração do Shopify |

### Documentação Técnica Completa

Acesse a pasta [`docs/`](docs/) para documentação completa organizada por categoria.

---

## 🎽 Produtos

### Ligas Disponíveis

- ⚽ **Premier League** (Inglaterra)
- ⚽ **La Liga** (Espanha)
- ⚽ **Serie A** (Itália)
- ⚽ **Bundesliga** (Alemanha)
- ⚽ **Ligue 1** (França)
- ⚽ **Brasileirão** (Brasil)
- ⚽ **Seleções Nacionais**
- 👔 **Manga Longa** (Especial)

### Total

- **500+ produtos**
- **1.600+ variantes** (tamanhos S-4XL)
- **15+ ligas** mundiais

---

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

Ver guia completo: [docs/deploy/](docs/deploy/)

### Shopify

Os produtos podem ser gerenciados diretamente pelo Shopify Admin ou via scripts de automação.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é proprietário da Foltz Fanwear.

---

## 📞 Contato

**Foltz Fanwear**
- 🌐 Website: [em breve]
- 📧 Email: [contato]
- 🛒 Loja: [sua-loja.myshopify.com]

---

## 🎯 Status do Projeto

- ✅ Frontend completo e responsivo
- ✅ Integração Shopify funcional
- ✅ Sistema de preços automatizado
- ✅ 500+ produtos catalogados
- ✅ Performance otimizada
- 🔄 Em produção

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0  
**Mantenedor:** Equipe Foltz Fanwear

---

<div align="center">

### ⚽ Feito com paixão pelo futebol ⚽

</div>
