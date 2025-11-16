#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verificação dos novos preços por tipo"""

import csv
import sys
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

base_dir = Path(__file__).parent.parent.parent
csv_file = base_dir / 'data' / 'shopify-products-import.csv'

print('\n' + '='*70)
print('🔍 VERIFICAÇÃO DE PREÇOS POR TIPO')
print('='*70 + '\n')

jersey_samples = []
long_sleeve_samples = []

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        if not row['Title']:
            continue
            
        price = float(row['Variant Price'])
        compare = float(row['Variant Compare At Price'])
        product_type = row['Type']
        
        if product_type == 'Manga Longa' and len(long_sleeve_samples) < 2:
            long_sleeve_samples.append({
                'title': row['Title'],
                'type': product_type,
                'price': price,
                'compare': compare
            })
        elif product_type != 'Manga Longa' and len(jersey_samples) < 2:
            jersey_samples.append({
                'title': row['Title'],
                'type': product_type,
                'price': price,
                'compare': compare
            })
        
        if len(jersey_samples) >= 2 and len(long_sleeve_samples) >= 2:
            break

print('👕 JERSEYS NORMAIS:')
print('─' * 70)
for i, sample in enumerate(jersey_samples, 1):
    correct_price = sample['price'] == 35900.00
    correct_compare = sample['compare'] == 53850.00
    status = '✅' if correct_price and correct_compare else '❌'
    
    print(f'\n{status} Exemplo {i}: {sample["title"]}')
    print(f'   Liga: {sample["type"]}')
    print(f'   Preço: ARS {sample["price"]:,.2f} {"✓" if correct_price else "✗ (esperado: 35.900)"}')
    print(f'   Comparado: ARS {sample["compare"]:,.2f} {"✓" if correct_compare else "✗ (esperado: 53.850)"}')

print('\n' + '─' * 70)
print('\n👔 MANGA LONGA:')
print('─' * 70)
for i, sample in enumerate(long_sleeve_samples, 1):
    correct_price = sample['price'] == 39900.00
    correct_compare = sample['compare'] == 59850.00
    status = '✅' if correct_price and correct_compare else '❌'
    
    print(f'\n{status} Exemplo {i}: {sample["title"]}')
    print(f'   Liga: {sample["type"]}')
    print(f'   Preço: ARS {sample["price"]:,.2f} {"✓" if correct_price else "✗ (esperado: 39.900)"}')
    print(f'   Comparado: ARS {sample["compare"]:,.2f} {"✓" if correct_compare else "✗ (esperado: 59.850)"}')

print('\n' + '='*70)
print('✨ Verificação concluída!')
print('='*70 + '\n')

