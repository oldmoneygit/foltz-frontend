#!/usr/bin/env python3
"""
Script para adicionar hover effects em todas as páginas institucionais
Para torná-las 100% idênticas ao Next.js
"""

import re
import os

# Diretório das páginas
SECTIONS_DIR = r"C:\Users\PC\Desktop\Foltz\shopify-theme-foltz\sections"

# Arquivos para processar
FILES = [
    "guia-talles-page.liquid",
    "politica-cambios-page.liquid",
    "privacidade-page.liquid",
    "plazos-entrega-page.liquid",
    "seguimiento-page.liquid"
]

def add_hover_to_card(content, card_class):
    """
    Adiciona hover effect a um card se ele ainda não existir
    """
    # Verificar se já existe hover
    hover_pattern = rf'{card_class}:hover\s*{{'
    if re.search(hover_pattern, content):
        return content, False  # Já existe

    # Procurar pelo bloco do card
    card_pattern = rf'(\.{card_class}\s*{{[^}}]+transition:\s*all\s+[^}}]+}})'

    def replace_card(match):
        card_block = match.group(1)
        # Adicionar hover logo após o bloco
        hover_block = f"\n\n.{card_class}:hover {{\n  border-color: rgba(218, 241, 13, 0.3);\n}}"
        return card_block + hover_block

    new_content = re.sub(card_pattern, replace_card, content)
    return new_content, (new_content != content)

def process_file(filepath):
    """
    Processa um arquivo e adiciona hovers onde necessário
    """
    print(f"\nProcessando {os.path.basename(filepath)}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes = []

    # Padrão para encontrar cards com transition: all mas sem hover
    # Procurar por classes que terminam com __card, __item, __question-item, etc
    card_pattern = r'\.([a-z-]+__(?:card|item|question-item|box|container))\s*{[^}]*transition:\s*all[^}]*}'

    cards = re.findall(card_pattern, content)

    for card_class in set(cards):  # usar set para evitar duplicatas
        new_content, changed = add_hover_to_card(content, card_class)
        if changed:
            content = new_content
            changes.append(card_class)
            print(f"  [OK] Adicionado hover em .{card_class}")

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [SAVE] Arquivo salvo com {len(changes)} alteracoes")
        return True
    else:
        print(f"  [INFO] Nenhuma alteracao necessaria")
        return False

def main():
    print("Adicionando hover effects nas paginas institucionais...")

    total_changes = 0

    for filename in FILES:
        filepath = os.path.join(SECTIONS_DIR, filename)
        if os.path.exists(filepath):
            if process_file(filepath):
                total_changes += 1
        else:
            print(f"[ERRO] Arquivo nao encontrado: {filename}")

    print(f"\nConcluido! {total_changes} arquivos modificados.")

if __name__ == "__main__":
    main()
