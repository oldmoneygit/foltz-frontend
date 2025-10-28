# ⚡ QUICK START - Começar em 30 Segundos

## Opção 1: EXECUTAR TUDO (Recomendado)

```bash
python run_all_analysis.py
```

**Isso vai:**
- ✅ Extrair cores de todas as imagens
- ✅ Gerar conteúdo SEO
- ✅ Analisar todos os produtos
- ✅ Salvar tudo em arquivos organizados

**Tempo:** 10-30 minutos

---

## Opção 2: ANÁLISE RÁPIDA (5 imagens)

```bash
python analyze_products.py
```

**Tempo:** 1-2 minutos

---

## Opção 3: ANÁLISE DETALHADA

```bash
python analyze_products_complete.py
```

**Configuração padrão:**
- 10 imagens por lote
- 50 imagens no total
- Análise super detalhada

**Tempo:** 5-15 minutos

---

## Ver Arquivos Gerados

```bash
# Ver análise completa
notepad analise_produtos_completa.txt

# Ver cores
notepad cores_dominantes.json

# Ver SEO
notepad conteudo_seo_*.txt
```

---

## Personalizar

Edite [analyze_products_complete.py](analyze_products_complete.py):

```python
# Linha 19-21
IMAGES_PER_BATCH = 10    # Quantas por lote
TOTAL_IMAGES = 50        # Total (None = todas)
```

---

## ✅ Pronto!

Todos os scripts estão prontos para uso.
Basta executar e aguardar os resultados!

**Dúvidas?** Veja [GUIA_DE_USO.md](GUIA_DE_USO.md)
