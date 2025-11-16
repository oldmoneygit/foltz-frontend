#!/bin/bash

# Script para corrigir estilos das páginas institucionais
# Para torná-las 100% idênticas ao Next.js

cd /c/Users/PC/Desktop/Foltz/shopify-theme-foltz/sections

# Lista de arquivos para corrigir
FILES="faq-page.liquid guia-talles-page.liquid politica-cambios-page.liquid privacidade-page.liquid plazos-entrega-page.liquid seguimiento-page.liquid careers-page.liquid"

echo "🔧 Aplicando correções de estilo..."

# 1. Adicionar hover:border-brand-yellow/30 após transition em cards
# Isso vai adicionar o efeito hover em TODOS os cards

for file in $FILES; do
  # Procurar por transition: border-color e adicionar hover logo depois
  sed -i '/transition: border-color 0\.3s ease;/a\
}\
\
.CLASSNAME:hover {\
  border-color: rgba(218, 241, 13, 0.3);\
  transform: translateY(-2px);' "$file"
done

echo "✅ Hover effects adicionados"

# 2. Trocar transition: border-color por transition: all
for file in $FILES; do
  sed -i 's/transition: border-color 0\.3s ease/transition: all 0.3s ease/g' "$file"
done

echo "✅ Transitions atualizadas para 'all'"

# 3. Corrigir gradientes de achievement cards (135deg → to bottom right)
for file in $FILES; do
  sed -i 's/background: linear-gradient(135deg, rgba(218, 241, 13, 0\.1) 0%, rgba(218, 241, 13, 0\.05) 100%)/background: linear-gradient(to bottom right, rgba(218, 241, 13, 0.1), rgba(218, 241, 13, 0.05))/g' "$file"
done

echo "✅ Gradientes de achievement cards corrigidos"

# 4. Adicionar hover:bg-yellow-400 nos botões CTA
for file in $FILES; do
  # Procurar botões com background: #DAF10D e adicionar hover
  sed -i '/background: #DAF10D;/,/}/ {
    /}/i\
}\
\
.BTNCLASS:hover {\
  background: #e5ff33;
  }' "$file"
done

echo "✅ Hover effects dos botões adicionados"

echo ""
echo "🎉 Todas as correções aplicadas com sucesso!"
