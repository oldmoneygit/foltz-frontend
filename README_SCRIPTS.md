# 📚 SCRIPTS DE ANÁLISE - FOLTZ FANWEAR

Sistema completo de análise de produtos com Claude API.

## 🎯 Scripts Principais

### 1. **run_all_analysis.py** ⭐
**Execute este para rodar tudo automaticamente**

```bash
python run_all_analysis.py
```

### 2. **analyze_products_complete.py**
Análise detalhada de produtos para e-commerce

### 3. **extract_colors.py**
Extrai cores dominantes (RGB, HEX, nomes)

### 4. **generate_seo_content.py**
Gera conteúdo SEO otimizado

### 5. **analyze_products.py**
Análise rápida (script original)

## 📖 Documentação

- **[QUICK_START.md](QUICK_START.md)** ← Comece aqui!
- **[GUIA_DE_USO.md](GUIA_DE_USO.md)** ← Guia completo
- **[IMAGE_PROCESSING_README.md](IMAGE_PROCESSING_README.md)** ← Detalhes técnicos

## ⚡ Uso Rápido

```bash
# 1. Instalar dependências (já instalado)
pip install -r requirements.txt

# 2. Executar análise completa
python run_all_analysis.py

# 3. Ver resultados
notepad analise_produtos_completa.txt
```

## 📊 Arquivos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `analise_produtos_completa.txt` | Todas as análises consolidadas |
| `analise_lote_*.txt` | Análise de cada lote |
| `cores_dominantes.json` | Cores de todas as imagens |
| `conteudo_seo_*.txt` | Conteúdo SEO otimizado |

## ⚙️ Configuração

Todos os scripts estão pré-configurados e prontos para uso!

Para personalizar, edite:

```python
# analyze_products_complete.py - Linhas 19-21
IMAGES_PER_BATCH = 10    # Imagens por lote
TOTAL_IMAGES = 50        # Total a processar
```

## 🔒 Segurança

✅ API Key configurada em `.env`
✅ `.env` está no `.gitignore`
✅ Credenciais seguras

## 📝 O Que Foi Resolvido

### Problema Original:
```
API Error 400: "image dimensions exceed max allowed size: 2000 pixels"
```

### Solução Implementada:
✅ Redimensionamento automático de imagens
✅ Processamento em lotes
✅ Fallback de modelos
✅ Scripts especializados
✅ Documentação completa

## 🎉 Resultado

**121 imagens** prontas para análise sem erros de API!

---

**Criado em:** 24/10/2024
**Status:** ✅ Pronto para uso
