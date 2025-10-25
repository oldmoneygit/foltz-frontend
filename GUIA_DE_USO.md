# 🚀 GUIA COMPLETO DE USO - ANÁLISE DE PRODUTOS FOLTZ

Este guia mostra como usar todos os scripts de análise de produtos com a API do Claude.

---

## 📋 ÍNDICE

1. [Instalação Rápida](#instalação-rápida)
2. [Scripts Disponíveis](#scripts-disponíveis)
3. [Uso Básico](#uso-básico)
4. [Uso Avançado](#uso-avançado)
5. [Configurações](#configurações)
6. [Solução de Problemas](#solução-de-problemas)

---

## ⚡ INSTALAÇÃO RÁPIDA

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Configurar API Key (já configurado no .env)
# A chave já está em .env e pronta para uso!

# 3. Testar instalação
python test_image_dimensions.py
```

**✅ Pronto! Você já pode usar os scripts.**

---

## 📦 SCRIPTS DISPONÍVEIS

### 🎯 **run_all_analysis.py** (RECOMENDADO)
**Execute TUDO de uma vez**

```bash
python run_all_analysis.py
```

Este é o **script master** que executa automaticamente:
1. Extração de cores dominantes
2. Geração de conteúdo SEO
3. Análise completa de produtos

**Tempo estimado:** 10-30 minutos (dependendo do número de imagens)

---

### 🔍 **analyze_products_complete.py**
**Análise detalhada de produtos**

Gera análise completa para e-commerce com:
- Identificação do time/seleção
- Descrição visual detalhada
- Nome e descrição para produto
- Categorias e tags SEO
- Preço sugerido
- Produtos relacionados

```bash
python analyze_products_complete.py
```

**Configuração:**
```python
# Edite estas linhas no arquivo:
IMAGES_PER_BATCH = 10    # Imagens por lote (recomendado: 10)
TOTAL_IMAGES = 50        # Total a processar (None = todas)
```

**Saída:**
- `analise_lote_1_YYYYMMDD_HHMMSS.txt` - Análise de cada lote
- `analise_produtos_completa.txt` - Todas as análises consolidadas

---

### 🎨 **extract_colors.py**
**Extrai cores dominantes de cada jersey**

Analisa as cores principais e gera arquivo JSON com:
- RGB e HEX de cada cor
- Nome da cor
- Porcentagem na imagem

```bash
python extract_colors.py
```

**Saída:**
- `cores_dominantes.json`

**Exemplo de uso do JSON:**
```python
import json

with open('cores_dominantes.json', 'r') as f:
    colors = json.load(f)

# Pegar cores da primeira imagem
first_image = list(colors.keys())[0]
print(f"Cores de {first_image}:")
for color in colors[first_image][:3]:
    print(f"  {color['name']}: {color['hex']} ({color['percentage']}%)")
```

---

### 📝 **generate_seo_content.py**
**Gera conteúdo SEO otimizado**

Cria conteúdo completo para SEO incluindo:
- Title tags e meta descriptions
- URLs amigáveis
- Palavras-chave principais e secundárias
- Long-tail keywords
- Texto SEO de 300-500 palavras
- Schema markup JSON-LD
- Alt texts para imagens

```bash
python generate_seo_content.py
```

**Saída:**
- `conteudo_seo_YYYYMMDD_HHMMSS.txt`

---

### 🔬 **test_image_dimensions.py**
**Verifica dimensões das imagens**

Útil para diagnóstico. Mostra quais imagens precisam redimensionamento.

```bash
python test_image_dimensions.py
```

---

## 🎮 USO BÁSICO

### Cenário 1: Primeira Análise (Começar Pequeno)

```bash
# 1. Testar com poucas imagens primeiro
# Edite analyze_products_complete.py:
# IMAGES_PER_BATCH = 5
# TOTAL_IMAGES = 5

# 2. Execute
python analyze_products_complete.py

# 3. Verifique o resultado
notepad analise_lote_1_*.txt
```

### Cenário 2: Análise Completa

```bash
# Executar tudo automaticamente
python run_all_analysis.py
```

Espere 10-30 minutos e tenha:
- ✅ Cores de todas as imagens
- ✅ Conteúdo SEO
- ✅ Análise completa de produtos

---

## ⚙️ USO AVANÇADO

### Personalizar Análise de Produtos

Edite [analyze_products_complete.py](analyze_products_complete.py):

```python
# Linha 19-21: Configure quantas imagens processar
IMAGES_PER_BATCH = 10    # Recomendado: 5-15
TOTAL_IMAGES = 50        # None = todas

# Linha 161: Personalize o prompt
prompt = """
Seu prompt personalizado aqui...
Você pode pedir análises específicas,
focar em determinados aspectos, etc.
"""
```

### Processar Pastas Específicas

```python
# Linha 17: Edite as pastas
IMAGE_FOLDERS = ["seedream"]  # Apenas seedream
# ou
IMAGE_FOLDERS = ["id_visual"]  # Apenas id_visual
# ou
IMAGE_FOLDERS = ["seedream", "id_visual", "nova_pasta"]
```

### Usar Modelo Específico

Edite a linha 174-178:

```python
models_to_try = [
    "claude-3-opus-20240229",     # Melhor qualidade (mais caro)
    # "claude-3-sonnet-20240229", # Equilibrado
    # "claude-3-haiku-20240307"   # Mais rápido (mais barato)
]
```

---

## 🔧 CONFIGURAÇÕES

### Variáveis de Ambiente (.env)

```bash
# Arquivo .env já configurado com:
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**⚠️ IMPORTANTE:** Nunca commitar o arquivo `.env` no Git!

### Custos da API

Estimativas aproximadas:

| Script | Imagens | Modelo | Custo Estimado |
|--------|---------|--------|----------------|
| Cores | Todas | Nenhum | R$ 0 (local) |
| SEO | 5 | Haiku | ~R$ 0.50 |
| Análise Completa | 10 | Opus | ~R$ 5-10 |
| Análise Completa | 50 | Haiku | ~R$ 10-20 |
| Análise Completa | 121 | Haiku | ~R$ 25-40 |

**💡 Dica:** Use Haiku para grandes volumes e Opus para análises críticas.

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "API Error 400: image dimensions exceed"

**Causa:** Imagem muito grande
**Solução:** O script já redimensiona automaticamente! Se persistir:

```bash
python test_image_dimensions.py
```

### Erro: "ANTHROPIC_API_KEY não encontrada"

**Solução:**
```bash
# Verifique se o arquivo .env existe
dir .env

# Se não existir, crie:
echo ANTHROPIC_API_KEY=sua-chave-aqui > .env
```

### Erro: "ModuleNotFoundError"

**Solução:**
```bash
pip install -r requirements.txt
```

### Script muito lento

**Soluções:**
1. Reduza `IMAGES_PER_BATCH` para 5
2. Use modelo "haiku" em vez de "opus"
3. Reduza `TOTAL_IMAGES`

### Análise de baixa qualidade

**Soluções:**
1. Use modelo "opus" em vez de "haiku"
2. Personalize o prompt com mais detalhes
3. Processe menos imagens por lote (IMAGES_PER_BATCH = 5)

### Erro de encoding no Windows

**Solução:** Já está resolvido! Todos os scripts têm:
```python
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
```

---

## 📊 FLUXO DE TRABALHO RECOMENDADO

### Para Começar (Teste)
```bash
# 1. Configurar para 5 imagens
# Editar: TOTAL_IMAGES = 5

# 2. Executar análise completa
python analyze_products_complete.py

# 3. Revisar resultado
notepad analise_lote_1_*.txt

# 4. Se bom, aumentar para 50 ou todas
```

### Para Produção (Análise Completa)
```bash
# 1. Executar tudo
python run_all_analysis.py

# 2. Aguardar conclusão (10-30 min)

# 3. Verificar arquivos gerados:
#    - cores_dominantes.json
#    - conteudo_seo_*.txt
#    - analise_produtos_completa.txt

# 4. Importar dados para seu sistema
```

---

## 📁 ARQUIVOS GERADOS

Após executar os scripts, você terá:

```
Foltz/
├── cores_dominantes.json              ← Cores de todas imagens
├── conteudo_seo_20241024_120000.txt  ← Conteúdo SEO
├── analise_lote_1_20241024_120500.txt ← Análise lote 1
├── analise_lote_2_20241024_121000.txt ← Análise lote 2
└── analise_produtos_completa.txt      ← TUDO consolidado
```

---

## 🎯 PRÓXIMOS PASSOS

Após gerar as análises:

1. **Revisar conteúdo** manualmente
2. **Ajustar preços** conforme estratégia
3. **Importar para Shopify** ou seu sistema
4. **Usar SEO content** nas páginas de produto
5. **Aplicar cores** no design dos cards de produto

---

## 💡 DICAS PROFISSIONAIS

### Dica 1: Análise em Lotes
Processe em lotes pequenos primeiro para validar qualidade.

### Dica 2: Backup dos Resultados
```bash
# Criar pasta backup
mkdir backup_analises
copy analise_*.txt backup_analises/
copy *.json backup_analises/
```

### Dica 3: Automatizar
Agende execução semanal para novos produtos:
```bash
# Windows Task Scheduler
# Executar: python run_all_analysis.py
# Frequência: Toda segunda às 9h
```

### Dica 4: Integração
Use os arquivos JSON para integração automática:
```python
import json

# Carregar análise
with open('cores_dominantes.json') as f:
    colors = json.load(f)

# Integrar com sistema
for product_image, color_data in colors.items():
    # Criar produto no sistema
    create_product(
        image=product_image,
        primary_color=color_data[0]['hex'],
        colors=color_data
    )
```

---

## 📞 SUPORTE

Problemas ou dúvidas? Verifique:

1. Este guia
2. [IMAGE_PROCESSING_README.md](IMAGE_PROCESSING_README.md)
3. Comentários nos scripts
4. [Documentação Claude API](https://docs.anthropic.com/)

---

**✨ Boa sorte com suas análises! ⚽🏆**

---

**Última atualização:** 24/10/2024
**Versão:** 1.0.0
