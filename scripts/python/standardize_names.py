#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para padronizar nomes de produtos de camisas
Padrão: [Time] [Ano] [Tipo] [Extras]
"""

import sys
import os
import json
import re
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def extract_components(folder_name):
    """
    Extrai componentes do nome da pasta
    Retorna: (team, year, type, extras, size)
    """
    # Remove (Size ...) do final
    size_match = re.search(r'\(Size ([^)]+)\)', folder_name)
    size = size_match.group(1) if size_match else None
    name_without_size = re.sub(r'\s*\(Size [^)]+\)', '', folder_name).strip()

    # PRIMEIRO: Detecta extras que podem conter números (para não confundir com anos)
    extras = []
    extra_patterns = [
        r'\b\d+Th Anniversary\b',
        r'\b\d+th Anniversary\b',
        r'\bLong Sleeve\b',
        r'\bComm?em+orative Edition\b',
        r'\bSpecial Edition\b',
        r'\bBaseball\b',
        r'\bAdicolor Classics\b',
        r'\b3-Stripes\b',
        r'\bGame\b',
    ]

    for pattern in extra_patterns:
        match = re.search(pattern, name_without_size, re.IGNORECASE)
        if match:
            extra_text = match.group(0).title()
            extras.append(extra_text)
            name_without_size = re.sub(pattern, '|||EXTRA|||', name_without_size, flags=re.IGNORECASE, count=1)

    # SEGUNDO: Padrões de ano
    year_patterns = [
        r'\b(\d{2})_(\d{2})\b',  # 25_26 ou 07_08
        r'\b(\d{4})\b',           # 1989 ou 2014
    ]

    year = None
    year_format = None
    for pattern in year_patterns:
        year_match = re.search(pattern, name_without_size)
        if year_match:
            if len(year_match.groups()) == 2:  # formato XX_XX
                # Usa hífen ao invés de barra (Windows não permite / em nomes de pasta)
                year = f"{year_match.group(1)}-{year_match.group(2)}"
                year_format = "short"
            else:  # formato YYYY
                year = year_match.group(1)
                year_format = "full"
            # Remove ano do texto
            name_without_size = re.sub(pattern, '|||YEAR|||', name_without_size, count=1)
            break

    # TERCEIRO: Tipos - processa na ordem: Third, Fourth, Away, Home (mais específico primeiro)
    types_ordered = ['Third', 'Fourth', 'Away', 'Home', 'GK', 'Goalkeeper', 'Training', 'Pre-Match']
    type_found = None

    for t in types_ordered:
        if re.search(rf'\b{t}\b', name_without_size, re.IGNORECASE):
            type_found = t.title()
            # Remove tipo do texto
            name_without_size = re.sub(rf'\b{t}\b', '|||TYPE|||', name_without_size, flags=re.IGNORECASE, count=1)
            break

    # Se encontrou Third ou Fourth, remove Away/Home (redundante)
    if type_found in ['Third', 'Fourth']:
        name_without_size = re.sub(r'\b(Away|Home)\b', '', name_without_size, flags=re.IGNORECASE)

    # QUARTO: Detecta cores e outras palavras extras restantes
    color_patterns = [
        r'\bRed\b',
        r'\bBlue\b',
        r'\bBlack\b',
        r'\bWhite\b',
        r'\bGreen\b',
        r'\bYellow\b',
        r'\bAnniversary\b',
    ]

    for pattern in color_patterns:
        match = re.search(pattern, name_without_size, re.IGNORECASE)
        if match:
            extra_text = match.group(0).title()
            if extra_text not in extras:  # Evita duplicatas
                extras.append(extra_text)
            name_without_size = re.sub(pattern, '', name_without_size, flags=re.IGNORECASE, count=1)

    # O que sobrou é o nome do time (removendo markers)
    team = name_without_size.replace('|||YEAR|||', '').replace('|||TYPE|||', '').replace('|||EXTRA|||', '').strip()
    team = re.sub(r'\s+', ' ', team)  # Remove espaços múltiplos
    team = team.strip('_- ')

    return {
        'team': team,
        'year': year,
        'year_format': year_format,
        'type': type_found,
        'extras': extras,
        'size': size,
        'original': folder_name
    }

def standardize_name(components):
    """
    Cria nome padronizado: Time Ano Tipo Extras
    """
    parts = []

    # 1. Time (obrigatório)
    if components['team']:
        parts.append(components['team'])

    # 2. Ano (obrigatório se existir)
    if components['year']:
        parts.append(components['year'])

    # 3. Tipo (Home/Away/Third)
    if components['type']:
        parts.append(components['type'])
    elif components['year']:  # Se tem ano mas não tem tipo, assume Home
        parts.append('Home')

    # 4. Extras
    if components['extras']:
        parts.extend(components['extras'])

    standardized = ' '.join(parts)

    return standardized

def analyze_all_products():
    """
    Analisa todos os produtos e sugere padronizações
    """
    leagues_path = Path('Leagues')

    if not leagues_path.exists():
        print("❌ Pasta Leagues não encontrada!")
        return

    analysis = []
    issues = []

    print("🔍 Analisando 271 produtos...\n")

    # Percorre todas as pastas de produtos
    for league_folder in leagues_path.iterdir():
        if not league_folder.is_dir():
            continue

        for product_folder in league_folder.iterdir():
            if not product_folder.is_dir():
                continue

            original_name = product_folder.name

            # Extrai componentes
            components = extract_components(original_name)

            # Gera nome padronizado
            new_name = standardize_name(components)

            # Adiciona tamanho se existir
            if components['size']:
                new_name += f" (Size {components['size']})"

            # Verifica se precisa mudar
            needs_change = original_name != new_name

            item = {
                'league': league_folder.name,
                'original_name': original_name,
                'new_name': new_name,
                'needs_change': needs_change,
                'components': components,
                'path': str(product_folder)
            }

            analysis.append(item)

            # Identifica problemas
            if not components['team']:
                issues.append(f"⚠️  Sem time identificado: {original_name}")
            if not components['year']:
                issues.append(f"⚠️  Sem ano identificado: {original_name}")
            if not components['type']:
                issues.append(f"⚠️  Sem tipo identificado: {original_name}")

    return analysis, issues

def main():
    print("="*70)
    print("📝 PADRONIZAÇÃO DE NOMES DE PRODUTOS")
    print("="*70)
    print("Padrão: [Time] [Ano] [Tipo] [Extras]")
    print("Exemplo: Everton 25/26 Home Commemorative Edition")
    print("="*70)
    print()

    # Analisa todos os produtos
    analysis, issues = analyze_all_products()

    if not analysis:
        print("❌ Nenhum produto encontrado!")
        return

    # Estatísticas
    needs_change = [item for item in analysis if item['needs_change']]
    already_good = [item for item in analysis if not item['needs_change']]

    print(f"\n📊 ESTATÍSTICAS:")
    print(f"   Total de produtos: {len(analysis)}")
    print(f"   ✅ Já padronizados: {len(already_good)}")
    print(f"   🔄 Precisam mudança: {len(needs_change)}")

    if issues:
        print(f"\n⚠️  PROBLEMAS ENCONTRADOS ({len(issues)}):")
        for issue in issues[:10]:  # Mostra primeiros 10
            print(f"   {issue}")
        if len(issues) > 10:
            print(f"   ... e mais {len(issues) - 10} problemas")

    # Mostra exemplos de mudanças
    print(f"\n🔄 EXEMPLOS DE MUDANÇAS (primeiros 20):")
    for i, item in enumerate(needs_change[:20], 1):
        print(f"\n{i}. Liga: {item['league']}")
        print(f"   ANTES: {item['original_name']}")
        print(f"   DEPOIS: {item['new_name']}")
        print(f"   Componentes identificados:")
        print(f"      - Time: {item['components']['team']}")
        print(f"      - Ano: {item['components']['year']}")
        print(f"      - Tipo: {item['components']['type']}")
        if item['components']['extras']:
            print(f"      - Extras: {', '.join(item['components']['extras'])}")

    if len(needs_change) > 20:
        print(f"\n   ... e mais {len(needs_change) - 20} mudanças")

    # Salva análise completa em JSON
    output_file = 'name_standardization_mapping.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Análise completa salva em: {output_file}")
    print("\n" + "="*70)
    print("⏭️  PRÓXIMOS PASSOS:")
    print("1. Revise o arquivo JSON gerado")
    print("2. Ajuste os nomes manualmente se necessário")
    print("3. Execute o script de renomeação (será criado a seguir)")
    print("="*70)

if __name__ == "__main__":
    main()
