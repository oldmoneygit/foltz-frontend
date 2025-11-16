#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verificação rápida dos preços atualizados"""

import csv
import sys
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

base_dir = Path(__file__).parent.parent.parent
csv_file = base_dir / 'data' / 'shopify-products-TEST.csv'

print('\n' + '='*60)
print('🔍 VERIFICAÇÃO DE PREÇOS ATUALIZADOS')
print('='*60 + '\n')

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = [r for r in reader if r['Title']][:3]
    
    for i, row in enumerate(rows, 1):
        price = float(row['Variant Price'])
        compare = float(row['Variant Compare At Price'])
        expected = price * 1.5
        correct = abs(compare - expected) < 0.01
        
        print(f'📦 Produto {i}: {row["Title"]}')
        print(f'   Preço: ARS {price:,.2f}')
        print(f'   Comparado: ARS {compare:,.2f}')
        print(f'   Esperado (×1.5): ARS {expected:,.2f}')
        print(f'   Status: {"✅ CORRETO" if correct else "❌ ERRO"}')
        print()

print('='*60)
print('✨ Verificação concluída!')
print('='*60 + '\n')

