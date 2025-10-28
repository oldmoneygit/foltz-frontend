#!/bin/bash

# ============================================
# SCRIPT DE VALIDAÇÃO FINAL
# Responsividade - Tema Shopify Foltz
# ============================================

echo "╔════════════════════════════════════════════╗"
echo "║  VALIDAÇÃO: Responsividade Mobile         ║"
echo "║  Tema: Shopify Foltz                      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0
WARNINGS=0

# Função para teste
test_check() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    echo -n "Verificando $name... "
    
    result=$(eval "$command")
    
    if [ "$result" == "$expected" ]; then
        echo -e "${GREEN}✓ PASSOU${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FALHOU${NC}"
        echo "  Esperado: $expected"
        echo "  Obtido: $result"
        ((FAILED++))
        return 1
    fi
}

# Função para warning
test_warning() {
    local name="$1"
    local command="$2"
    local threshold="$3"
    
    echo -n "Verificando $name... "
    
    result=$(eval "$command")
    
    if [ "$result" -le "$threshold" ]; then
        echo -e "${GREEN}✓ OK ($result)${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ ATENÇÃO ($result)${NC}"
        ((WARNINGS++))
    fi
}

echo "════════════════════════════════════════════"
echo "  TESTE 1: VIEWPORT META TAG"
echo "════════════════════════════════════════════"

if grep -q "viewport" layout/theme.liquid; then
    viewport_content=$(grep "viewport" layout/theme.liquid | grep -o 'content="[^"]*"' | sed 's/content="\(.*\)"/\1/')
    
    if [[ "$viewport_content" == *"width=device-width"* ]] && [[ "$viewport_content" == *"initial-scale=1"* ]]; then
        echo -e "${GREEN}✓ Viewport tag presente e correta${NC}"
        echo "  Conteúdo: $viewport_content"
        ((PASSED++))
    else
        echo -e "${RED}✗ Viewport tag presente mas INCORRETA${NC}"
        echo "  Conteúdo: $viewport_content"
        echo "  Esperado: width=device-width, initial-scale=1"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ CRÍTICO: Viewport tag NÃO ENCONTRADA${NC}"
    echo "  Adicione em layout/theme.liquid:"
    echo "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
    ((FAILED++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 2: MEDIA QUERIES"
echo "════════════════════════════════════════════"

# Conta max-width (desktop-first - ruim)
max_width_count=$(grep -r "@media.*max-width" sections/ snippets/ 2>/dev/null | wc -l)
# Conta min-width (mobile-first - bom)
min_width_count=$(grep -r "@media.*min-width" sections/ snippets/ 2>/dev/null | wc -l)

echo "Media queries com max-width (desktop-first): $max_width_count"
echo "Media queries com min-width (mobile-first): $min_width_count"

if [ "$max_width_count" -eq 0 ]; then
    echo -e "${GREEN}✓ Nenhuma media query desktop-first (perfeito!)${NC}"
    ((PASSED++))
elif [ "$max_width_count" -le 3 ]; then
    echo -e "${YELLOW}⚠ Algumas media queries desktop-first ainda presentes${NC}"
    echo "  Recomendação: Converter para mobile-first"
    ((WARNINGS++))
else
    echo -e "${RED}✗ Muitas media queries desktop-first${NC}"
    echo "  Ação necessária: Converter TODAS para mobile-first"
    ((FAILED++))
fi

if [ "$min_width_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Media queries mobile-first encontradas: $min_width_count${NC}"
    ((PASSED++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 3: FONT-SIZE < 16PX (CRÍTICO)"
echo "════════════════════════════════════════════"

# Procura font-size de 10-15px em inputs/selects/buttons
small_fonts=$(grep -rn "font-size.*1[0-5]px" snippets/ sections/ 2>/dev/null | grep -iE "(input|select|button|form)" | wc -l)

if [ "$small_fonts" -eq 0 ]; then
    echo -e "${GREEN}✓ Nenhum input/select/button com font-size < 16px${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ CRÍTICO: $small_fonts ocorrências de font-size < 16px${NC}"
    echo "  Isso causa zoom automático no iOS!"
    echo ""
    echo "  Locais encontrados:"
    grep -rn "font-size.*1[0-5]px" snippets/ sections/ 2>/dev/null | grep -iE "(input|select|button|form)"
    ((FAILED++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 4: TOUCH TARGETS (BOTÕES)"
echo "════════════════════════════════════════════"

# Procura botões muito pequenos
if [ -f "snippets/buy-buttons.liquid" ]; then
    # Procura min-height >= 44px
    adequate_buttons=$(grep -n "min-height.*4[4-9]px\|min-height.*[5-9][0-9]px" snippets/buy-buttons.liquid 2>/dev/null | wc -l)
    
    if [ "$adequate_buttons" -gt 0 ]; then
        echo -e "${GREEN}✓ Botões com altura adequada encontrados (≥44px)${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ Nenhum min-height ≥44px encontrado em buy-buttons.liquid${NC}"
        echo "  Recomendação: Adicionar min-height: 48px em botões"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠ Arquivo buy-buttons.liquid não encontrado${NC}"
    ((WARNINGS++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 5: IMAGENS RESPONSIVAS"
echo "════════════════════════════════════════════"

# Procura uso de image_tag (bom) vs img_url (ruim)
if [ -f "snippets/product-gallery.liquid" ]; then
    image_tag_count=$(grep -c "image_tag" snippets/product-gallery.liquid 2>/dev/null)
    img_url_count=$(grep -c "img_url" snippets/product-gallery.liquid 2>/dev/null)
    
    echo "image_tag (responsivo): $image_tag_count ocorrências"
    echo "img_url (fixo): $img_url_count ocorrências"
    
    if [ "$image_tag_count" -gt 0 ]; then
        echo -e "${GREEN}✓ Usando image_tag para imagens responsivas${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ Nenhum image_tag encontrado${NC}"
        echo "  Recomendação: Usar image_tag com widths e sizes"
        ((WARNINGS++))
    fi
    
    # Verifica se tem widths e sizes
    if grep -q "widths:" snippets/product-gallery.liquid && grep -q "sizes:" snippets/product-gallery.liquid; then
        echo -e "${GREEN}✓ image_tag com widths e sizes configurados${NC}"
        ((PASSED++))
    elif [ "$image_tag_count" -gt 0 ]; then
        echo -e "${YELLOW}⚠ image_tag sem widths/sizes completos${NC}"
        ((WARNINGS++))
    fi
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 6: ESPECIFICIDADE CSS"
echo "════════════════════════════════════════════"

# Procura por seletores muito específicos que podem causar problemas
complex_selectors=$(grep -rn "^\s*\.[a-z_-]*\s\+\.[a-z_-]*\s\+\.[a-z_-]*" sections/main-product.liquid 2>/dev/null | wc -l)

if [ "$complex_selectors" -gt 0 ]; then
    echo -e "${YELLOW}⚠ $complex_selectors seletores com 3+ classes encontrados${NC}"
    echo "  Isso pode dificultar override em media queries"
    echo "  Certifique-se que media queries usam mesma especificidade"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓ Especificidade CSS parece controlada${NC}"
    ((PASSED++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 7: BREAKPOINTS SHOPIFY"
echo "════════════════════════════════════════════"

# Verifica uso dos breakpoints corretos (750px e 990px)
bp_750=$(grep -r "min-width.*750px\|max-width.*749px" sections/ snippets/ 2>/dev/null | wc -l)
bp_990=$(grep -r "min-width.*990px\|max-width.*989px" sections/ snippets/ 2>/dev/null | wc -l)

echo "Breakpoint 750px: $bp_750 ocorrências"
echo "Breakpoint 990px: $bp_990 ocorrências"

if [ "$bp_750" -gt 0 ] || [ "$bp_990" -gt 0 ]; then
    echo -e "${GREEN}✓ Usando breakpoints Shopify padrão${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Breakpoints Shopify (750px, 990px) não encontrados${NC}"
    echo "  Pode estar usando breakpoints customizados"
    ((WARNINGS++))
fi

# Verifica breakpoints não-padrão
bp_768=$(grep -r "768px" sections/ snippets/ 2>/dev/null | wc -l)
bp_1024=$(grep -r "1024px" sections/ snippets/ 2>/dev/null | wc -l)

if [ "$bp_768" -gt 0 ] || [ "$bp_1024" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Breakpoints não-padrão encontrados (768px ou 1024px)${NC}"
    echo "  Recomendação: Usar 750px e 990px (padrão Shopify)"
    ((WARNINGS++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 8: TIPOGRAFIA FLUIDA"
echo "════════════════════════════════════════════"

# Verifica uso de clamp()
clamp_count=$(grep -r "clamp(" sections/ snippets/ 2>/dev/null | wc -l)

if [ "$clamp_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Tipografia fluida com clamp() encontrada ($clamp_count)${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Nenhum clamp() encontrado${NC}"
    echo "  Recomendação: Usar clamp() para font-sizes responsivos"
    ((WARNINGS++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 9: Z-INDEX ISSUES"
echo "════════════════════════════════════════════"

# Verifica z-index extremos
high_zindex=$(grep -rn "z-index.*[0-9][0-9][0-9][0-9]" sections/ snippets/ 2>/dev/null | wc -l)

if [ "$high_zindex" -eq 0 ]; then
    echo -e "${GREEN}✓ Nenhum z-index muito alto (>1000)${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ $high_zindex z-index muito altos encontrados (>999)${NC}"
    echo "  Recomendação: Usar CSS custom properties para z-index"
    ((WARNINGS++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  TESTE 10: LARGURAS FIXAS"
echo "════════════════════════════════════════════"

# Procura larguras fixas sem max-width
fixed_widths=$(grep -rn "width:\s*[0-9]\+px" sections/main-product.liquid snippets/product-gallery.liquid 2>/dev/null | grep -v "max-width" | wc -l)

if [ "$fixed_widths" -eq 0 ]; then
    echo -e "${GREEN}✓ Nenhuma largura fixa problemática encontrada${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ $fixed_widths larguras fixas em pixels encontradas${NC}"
    echo "  Recomendação: Usar porcentagens ou max-width"
    ((WARNINGS++))
fi

echo ""
echo "════════════════════════════════════════════"
echo "  RESUMO FINAL"
echo "════════════════════════════════════════════"

total=$((PASSED + FAILED + WARNINGS))

echo ""
echo -e "${GREEN}✓ PASSOU:   $PASSED testes${NC}"
echo -e "${YELLOW}⚠ AVISOS:   $WARNINGS itens${NC}"
echo -e "${RED}✗ FALHOU:   $FAILED testes${NC}"
echo "────────────────────────────────────────────"
echo "  TOTAL:    $total verificações"
echo ""

# Pontuação
score=$((PASSED * 100 / (PASSED + FAILED)))

echo "PONTUAÇÃO DE RESPONSIVIDADE: $score%"
echo ""

if [ "$FAILED" -eq 0 ]; then
    if [ "$WARNINGS" -eq 0 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  🎉 PERFEITO! Tema 100% responsivo!       ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    else
        echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✓ APROVADO! Tema responsivo              ║${NC}"
        echo -e "${GREEN}║  Alguns itens podem ser melhorados        ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    fi
else
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ REPROVADO - Correções necessárias      ║${NC}"
    echo -e "${RED}║  Revise os itens que falharam acima       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
fi

echo ""
echo "════════════════════════════════════════════"
echo "  PRÓXIMOS PASSOS"
echo "════════════════════════════════════════════"
echo ""

if [ "$FAILED" -gt 0 ]; then
    echo "1. Corrija os itens que FALHARAM (marcados com ✗)"
    echo "2. Execute este script novamente"
    echo "3. Continue até todos os testes passarem"
fi

if [ "$WARNINGS" -gt 0 ]; then
    echo "• Considere corrigir os AVISOS (marcados com ⚠)"
    echo "  Não são críticos, mas melhoram a qualidade"
fi

if [ "$FAILED" -eq 0 ]; then
    echo "✓ Teste em dispositivos reais (iPhone, Android)"
    echo "✓ Execute Google Lighthouse para score mobile"
    echo "✓ Valide todas as páginas do tema"
    echo "✓ Faça backup antes de publicar"
fi

echo ""
echo "════════════════════════════════════════════"
echo ""

# Exit code baseado em falhas
if [ "$FAILED" -gt 0 ]; then
    exit 1
else
    exit 0
fi
