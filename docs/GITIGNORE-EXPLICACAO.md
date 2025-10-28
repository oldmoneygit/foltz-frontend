# 📝 Explicação do .gitignore - Foltz

Este documento explica o que está sendo ignorado no Git e por quê.

---

## 🗂️ Categorias de Arquivos Ignorados

### 1. Dependencies (node_modules)
```
/node_modules
/.pnp
.pnp.js
/.yarn/cache
```

**Por quê?**
- `node_modules/` pode ter 300MB+ e centenas de milhares de arquivos
- Sempre pode ser recriado com `npm install`
- **Economia**: ~300-500MB

---

### 2. Build & Output
```
/.next/
/out/
/build
/dist
```

**Por quê?**
- Arquivos gerados durante build
- Recriados automaticamente em cada deploy
- **Economia**: ~50-100MB

---

### 3. Environment Variables (.env)
```
.env
.env*.local
.env.development.local
.env.test.local
.env.production.local
```

**Por quê?**
- Contém **TOKENS SECRETOS** da Shopify
- **NUNCA** deve ser público
- ⚠️ **SEGURANÇA CRÍTICA**

**O que pode acontecer se .env for commitado?**
- Qualquer pessoa pode acessar sua loja Shopify
- Podem criar/deletar/modificar produtos
- Podem acessar dados de clientes
- **SEMPRE mantenha .env no .gitignore!**

---

### 4. IDE / Editor
```
.vscode/
.idea/
*.sublime-project
*.sublime-workspace
```

**Por quê?**
- Configurações pessoais de cada desenvolvedor
- Podem conter caminhos absolutos do seu PC
- **Economia**: ~5-10MB

---

### 5. OS Files (Sistema Operacional)
```
.DS_Store         # macOS
Thumbs.db         # Windows
desktop.ini       # Windows
._*               # macOS
```

**Por quê?**
- Arquivos automáticos do sistema
- Não têm utilidade no projeto
- Poluem o repositório

---

### 6. ⭐ FOLTZ SPECIFIC - Imagens de Produtos

```
# Leagues/  (comentado por enquanto)
```

**ATENÇÃO**: Esta linha está **comentada** (#) por enquanto.

**Quando descomentar?**
- ✅ DEPOIS de importar todos os produtos para Shopify
- ✅ DEPOIS de confirmar que as imagens estão no CDN da Shopify
- ✅ DEPOIS de atualizar os componentes para usar Shopify API

**Por quê ignorar?**
- A pasta `Leagues/` tem **MILHARES** de imagens
- Tamanho estimado: **500MB - 2GB+**
- GitHub tem limite de 100MB por arquivo
- Torna push/pull extremamente lento
- **Economia**: ~1-2GB

**Como descomentar:**
```bash
# Abra .gitignore e remova o # da linha:
# De:
# Leagues/

# Para:
Leagues/
```

---

### 7. Generated Files
```
shopify-products-import.csv
/scripts/output/
```

**Por quê?**
- `shopify-products-import.csv` é gerado pelo comando `npm run generate-csv`
- Sempre pode ser recriado dos dados originais
- Evita conflitos de versão

---

### 8. Temporary & Backup Files
```
*.tmp
*.temp
*.bak
*.backup
*.old
/public/temp/
```

**Por quê?**
- Arquivos temporários de editores
- Backups manuais
- Não são necessários no repositório

---

## ✅ Arquivos que DEVEM estar no repositório

Estes arquivos **NÃO** estão no .gitignore e **DEVEM** ser commitados:

✅ **Código fonte**:
- `src/` - Todo o código do projeto
- `public/images/` - Imagens estáticas (logo, hero, etc.)
- `scripts/` - Scripts de automação

✅ **Configuração**:
- `package.json` - Dependências do projeto
- `package-lock.json` - Versões exatas das dependências
- `next.config.js` - Configuração do Next.js
- `tailwind.config.js` - Configuração do Tailwind
- `.env.example` - **Exemplo** de variáveis (sem valores reais)

✅ **Documentação**:
- `README.md`
- `SHOPIFY-SETUP.md`
- `DEPLOY-VERCEL.md`
- Todos os arquivos `.md`

✅ **Dados**:
- `src/data/leagues_data.json` - Dados dos produtos (até migrar para Shopify)

---

## 🚀 Workflow Recomendado

### Antes do Primeiro Commit:

1. **Verificar .env**:
   ```bash
   # Certifique-se que .env está no .gitignore
   git check-ignore .env.local
   # Deve retornar: .env.local
   ```

2. **Verificar node_modules**:
   ```bash
   git check-ignore node_modules
   # Deve retornar: node_modules
   ```

3. **Ver o que vai ser commitado**:
   ```bash
   git status
   # NÃO deve aparecer: node_modules, .env, .next, etc.
   ```

### Depois de Migrar para Shopify:

1. **Descomentar Leagues/ no .gitignore**:
   ```bash
   # Editar .gitignore e remover o # da linha Leagues/
   ```

2. **Remover Leagues/ do Git** (se já foi commitado):
   ```bash
   git rm -r --cached Leagues/
   git commit -m "Remove Leagues folder from repository"
   ```

3. **Push**:
   ```bash
   git push origin main
   ```

---

## 📊 Economia de Espaço

Com este .gitignore otimizado:

| Item | Tamanho | Ignorado? |
|------|---------|-----------|
| node_modules | ~300-500MB | ✅ Sim |
| .next (build) | ~50-100MB | ✅ Sim |
| Leagues/ (produtos) | ~1-2GB | ⚠️ Comentado* |
| .env (tokens) | ~1KB | ✅ Sim |
| IDE configs | ~5-10MB | ✅ Sim |
| **TOTAL ECONOMIZADO** | **~2-3GB** | |

*Descomentar após migração para Shopify

**Tamanho final do repositório**: ~20-50MB (apenas código e assets necessários)

---

## ⚠️ Avisos Importantes

### 1. NUNCA Commit Tokens/Senhas

Se acidentalmente você fez commit do `.env`:

```bash
# 1. Remover do histórico do Git
git rm --cached .env
git commit -m "Remove sensitive .env file"

# 2. IMPORTANTE: Trocar TODOS os tokens na Shopify
# Os tokens antigos estão expostos no histórico do Git!
```

### 2. GitHub File Size Limit

O GitHub não aceita arquivos > 100MB:
- Imagens grandes de produtos devem ir para Shopify
- Vídeos devem ir para CDN externo (Cloudflare, Vimeo, etc.)

### 3. Branches

O .gitignore funciona em **todas as branches**:
- Não precisa recriar para cada branch
- Modificações no .gitignore afetam todas as branches

---

## 🔍 Comandos Úteis

### Ver o que está sendo ignorado:
```bash
git status --ignored
```

### Testar se um arquivo será ignorado:
```bash
git check-ignore -v <arquivo>

# Exemplo:
git check-ignore -v .env.local
# Saída: .gitignore:42:.env*.local	.env.local
```

### Forçar adicionar arquivo ignorado (cuidado!):
```bash
git add -f <arquivo>
# ⚠️ Use apenas se tiver certeza!
```

### Ver tamanho do repositório:
```bash
git count-objects -vH
```

---

## ✅ Checklist Final

Antes de fazer push para o GitHub:

- [ ] `.env.local` está no .gitignore?
- [ ] `node_modules/` está no .gitignore?
- [ ] Pasta `Leagues/` será ignorada após migração Shopify?
- [ ] Arquivos de build (`.next/`, `out/`) estão ignorados?
- [ ] Executou `git status` para verificar o que será commitado?
- [ ] Nenhum arquivo > 100MB será enviado?
- [ ] Tokens/senhas não estão em nenhum arquivo commitado?

---

**Dúvidas?** Leia os comentários no próprio arquivo `.gitignore`!
