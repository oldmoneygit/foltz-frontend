# ⚡ QUICK START - Comece em 5 minutos

**Seu tema Shopify Foltz não está responsivo no mobile?**  
**Este guia resolve em 30-40 minutos!**

---

## 🎯 O QUE FAZER (3 Passos Simples)

### PASSO 1: Copie o Prompt (30 segundos)

1. Abra o arquivo `prompt-claude-code-responsividade.md`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Vá para o Claude Code

---

### PASSO 2: Cole no Claude Code (30 minutos)

1. Cole o prompt completo no Claude Code
2. Ele vai fazer análise automática
3. Aguarde as correções em 4 fases
4. Revise cada fase antes de continuar

**O Claude Code vai:**
- ✅ Adicionar viewport tag
- ✅ Converter media queries para mobile-first
- ✅ Corrigir tamanhos de botões
- ✅ Ajustar font-size em inputs
- ✅ Implementar imagens responsivas
- ✅ Adicionar tipografia fluida

---

### PASSO 3: Valide (2 minutos)

```bash
bash validacao-final.sh
```

**Resultado esperado:** Score 80%+ ✅

---

## 🔥 ATALHO AINDA MAIS RÁPIDO

Cole isto direto no Claude Code:

```
Analise o tema Shopify Foltz e corrija a responsividade mobile seguindo estas prioridades:

FASE 1 - ANÁLISE:
1. Verifique se existe viewport tag em layout/theme.liquid
2. Liste todas as media queries em sections/ e snippets/
3. Identifique font-size < 16px em inputs/selects/buttons
4. Mostre resumo dos problemas encontrados

FASE 2 - CORREÇÕES CRÍTICAS:
1. Adicione viewport tag se não existir
2. Converta TODAS media queries de max-width para min-width (mobile-first)
3. Use breakpoints: 750px e 990px (padrão Shopify)
4. Corrija TODOS font-size em inputs/selects para >= 16px
5. Ajuste TODOS botões para min-height: 48px
6. Substitua img_url por image_tag com srcset em product-gallery.liquid

FASE 3 - VALIDAÇÃO:
Execute estes comandos e me mostre os resultados:
- grep -n "viewport" layout/theme.liquid
- grep -rn "@media.*max-width" sections/ snippets/ | wc -l
- grep -rn "font-size.*1[0-5]px" snippets/
- grep -rn "min-height.*4[8-9]px" snippets/buy-buttons.liquid

REGRAS CRÍTICAS:
- SEMPRE use min-width (mobile-first)
- SEMPRE font-size >= 16px em inputs
- SEMPRE min-height: 48px em botões
- SEMPRE use clamp() para tipografia
- SEMPRE especificidade igual nas media queries
```

---

## ✅ CHECKLIST VISUAL

```
┌─────────────────────────────────┐
│ ☐ Fiz backup do tema            │
│ ☐ Copiei o prompt                │
│ ☐ Colei no Claude Code           │
│ ☐ Aguardei as 4 fases            │
│ ☐ Executei validacao-final.sh   │
│ ☐ Score 80%+                     │
│ ☐ Testei em iPhone/Android      │
└─────────────────────────────────┘
```

---

## 📱 TESTE RÁPIDO

Após as correções, abra o tema no mobile e verifique:

✅ Layout em 1 coluna (não 2)  
✅ Botões fáceis de tocar  
✅ Inputs não causam zoom  
✅ Imagens carregam rápido  
✅ Sem scroll horizontal  

**Se algum item falhar:** Execute `bash validacao-final.sh` para identificar o problema.

---

## 🆘 PROBLEMAS COMUNS

### "Viewport tag não funciona"
**Solução:** Deve estar dentro de `<head>`, ANTES de qualquer CSS

### "Media queries não aplicam"
**Solução:** Verifique especificidade CSS (use o mesmo seletor na media query)

### "Inputs causam zoom no iOS"
**Solução:** font-size deve ser >= 16px (nunca 14px ou 15px)

### "Botões muito pequenos"
**Solução:** Use min-height: 48px (não height: 40px)

---

## 📞 PRECISA DE MAIS DETALHES?

Consulte estes arquivos na ordem:

1. **INDICE-COMPLETO.md** - Visão geral de tudo
2. **mapa-correcoes.md** - Onde fazer cada correção
3. **exemplos-antes-depois.md** - Como deve ficar
4. **cheat-sheet-1-pagina.md** - Referência rápida

---

## ⏱️ TEMPO TOTAL

- Copiar prompt: **30 seg**
- Claude Code corrige: **30 min**
- Validação: **2 min**
- Teste mobile: **5 min**

**TOTAL: ~40 minutos para tema 100% responsivo!**

---

## 🎯 RESULTADO

### ANTES ❌
```
[ Desktop Layout ]
    ┌─────────┐
    │ 2 cols  │
    │ grande  │
    └─────────┘
```

### DEPOIS ✅
```
[ Mobile Layout ]
  ┌───────┐
  │1 col  │
  │adapt. │
  └───────┘
```

---

## 🚀 COMECE AGORA!

1. Abra `prompt-claude-code-responsividade.md`
2. Copie tudo (Ctrl+A, Ctrl+C)
3. Cole no Claude Code
4. Aguarde 30 minutos
5. Execute `bash validacao-final.sh`

**Simples assim! ⚡**

---

**IMPORTANTE:** Este é um guia de início rápido. Para instruções detalhadas, consulte README.md ou INDICE-COMPLETO.md.

**Boa sorte! 🎉**
