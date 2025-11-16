#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar preços diferenciados por tipo de produto
- Jerseys normais: ARS 35.900 (comparado: ARS 53.850)
- Manga longa: ARS 39.900 (comparado: ARS 59.850)

Autor: Foltz Fanwear
Data: 29/10/2025
"""

import csv
import sys
import json
from pathlib import Path

# Configurar encoding UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Novos preços
JERSEY_PRICE = 35900.00
JERSEY_COMPARE_PRICE = JERSEY_PRICE * 1.5  # 53850.00

LONG_SLEEVE_PRICE = 39900.00
LONG_SLEEVE_COMPARE_PRICE = LONG_SLEEVE_PRICE * 1.5  # 59850.00

def load_leagues_data():
    """Carrega dados das ligas para identificar produtos de manga longa"""
    base_dir = Path(__file__).parent.parent.parent
    leagues_file = base_dir / 'data' / 'leagues_data.json'
    
    with open(leagues_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def is_long_sleeve_product(handle, leagues_data):
    """Verifica se um produto é de manga longa baseado no handle"""
    # Verificar na liga long-sleeve
    if 'long-sleeve' in leagues_data:
        long_sleeve_products = leagues_data['long-sleeve'].get('products', [])
        for product in long_sleeve_products:
            if product['id'] == handle:
                return True
    
    # Verificar se o nome contém indicadores de manga longa
    if 'long-sleeve' in handle.lower():
        return True
    
    return False

def update_csv_prices(input_file, leagues_data, output_file=None):
    """
    Atualiza preços no CSV baseado no tipo de produto
    
    Args:
        input_file: Caminho do arquivo CSV de entrada
        leagues_data: Dados das ligas
        output_file: Caminho do arquivo CSV de saída (opcional)
    """
    if output_file is None:
        output_file = input_file
    
    print(f"\n📊 Processando: {input_file}")
    
    # Ler o CSV
    rows = []
    header = None
    jersey_count = 0
    long_sleeve_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        # Encontrar índices das colunas
        try:
            handle_idx = header.index('Handle')
            price_idx = header.index('Variant Price')
            compare_price_idx = header.index('Variant Compare At Price')
            type_idx = header.index('Type')
        except ValueError as e:
            print(f"❌ Erro: Coluna não encontrada - {e}")
            return
        
        print(f"✅ Colunas encontradas:")
        print(f"   - Handle: coluna {handle_idx}")
        print(f"   - Type: coluna {type_idx}")
        print(f"   - Variant Price: coluna {price_idx}")
        print(f"   - Variant Compare At Price: coluna {compare_price_idx}")
        
        current_handle = None
        is_long_sleeve = False
        shown_examples = {'jersey': False, 'long_sleeve': False}
        
        # Processar cada linha
        for row in reader:
            try:
                # Pegar handle (se estiver na linha, ou usar o último)
                if row[handle_idx]:
                    current_handle = row[handle_idx]
                    # Verificar se é manga longa
                    is_long_sleeve = is_long_sleeve_product(current_handle, leagues_data)
                    
                    # Também verificar pela coluna Type
                    if row[type_idx] == 'Manga Longa':
                        is_long_sleeve = True
                
                # Aplicar preço apropriado
                if is_long_sleeve:
                    new_price = LONG_SLEEVE_PRICE
                    new_compare = LONG_SLEEVE_COMPARE_PRICE
                    long_sleeve_count += 1
                    
                    # Mostrar exemplo da primeira manga longa
                    if not shown_examples['long_sleeve'] and row[handle_idx]:
                        print(f"\n💰 Exemplo MANGA LONGA:")
                        print(f"   Produto: {current_handle}")
                        print(f"   Preço NOVO: ARS {new_price:,.2f}")
                        print(f"   Comparado NOVO: ARS {new_compare:,.2f}")
                        print(f"   Desconto aparente: {((new_compare - new_price) / new_compare * 100):.1f}%")
                        shown_examples['long_sleeve'] = True
                else:
                    new_price = JERSEY_PRICE
                    new_compare = JERSEY_COMPARE_PRICE
                    jersey_count += 1
                    
                    # Mostrar exemplo do primeiro jersey
                    if not shown_examples['jersey'] and row[handle_idx]:
                        print(f"\n💰 Exemplo JERSEY:")
                        print(f"   Produto: {current_handle}")
                        print(f"   Preço NOVO: ARS {new_price:,.2f}")
                        print(f"   Comparado NOVO: ARS {new_compare:,.2f}")
                        print(f"   Desconto aparente: {((new_compare - new_price) / new_compare * 100):.1f}%")
                        shown_examples['jersey'] = True
                
                # Atualizar preços
                row[price_idx] = f"{new_price:.2f}"
                row[compare_price_idx] = f"{new_compare:.2f}"
            
            except (ValueError, IndexError) as e:
                # Manter linha como está se houver erro
                pass
            
            rows.append(row)
    
    # Escrever CSV atualizado
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
    
    print(f"\n✅ Arquivo atualizado com sucesso!")
    print(f"📁 Arquivo: {output_file}")
    print(f"👕 Jerseys normais: {jersey_count} variantes")
    print(f"👔 Manga longa: {long_sleeve_count} variantes")
    print(f"📦 Total de linhas: {len(rows)}")

def main():
    # Diretório base do projeto
    base_dir = Path(__file__).parent.parent.parent
    data_dir = base_dir / 'data'
    
    print("\n" + "="*70)
    print("🏷️  ATUALIZAÇÃO DE PREÇOS POR TIPO - FOLTZ FANWEAR")
    print("="*70)
    print(f"\n📌 Novos preços:")
    print(f"   👕 Jerseys: ARS {JERSEY_PRICE:,.2f} (comparado: ARS {JERSEY_COMPARE_PRICE:,.2f})")
    print(f"   👔 Manga Longa: ARS {LONG_SLEEVE_PRICE:,.2f} (comparado: ARS {LONG_SLEEVE_COMPARE_PRICE:,.2f})")
    print(f"   📊 Ambos com 50% de desconto aparente")
    
    # Carregar dados das ligas
    print(f"\n⏳ Carregando dados das ligas...")
    leagues_data = load_leagues_data()
    long_sleeve_count = leagues_data.get('long-sleeve', {}).get('product_count', 0)
    print(f"✅ Dados carregados: {long_sleeve_count} produtos de manga longa identificados")
    
    # Arquivos para processar
    files_to_process = [
        data_dir / 'shopify-products-import.csv',
        data_dir / 'shopify-products-TEST.csv'
    ]
    
    total_updated = 0
    
    for file_path in files_to_process:
        if file_path.exists():
            print(f"\n{'─'*70}")
            update_csv_prices(file_path, leagues_data)
            total_updated += 1
        else:
            print(f"\n⚠️  Arquivo não encontrado: {file_path}")
    
    print("\n" + "="*70)
    print(f"✨ CONCLUÍDO! {total_updated} arquivo(s) processado(s)")
    print("="*70)
    
    print("\n📋 Resumo dos preços:")
    print(f"   👕 Jersey normal:")
    print(f"      Preço: ARS {JERSEY_PRICE:,.2f}")
    print(f"      Comparado: ARS {JERSEY_COMPARE_PRICE:,.2f}")
    print(f"      Desconto: 33%")
    print(f"\n   👔 Manga longa:")
    print(f"      Preço: ARS {LONG_SLEEVE_PRICE:,.2f}")
    print(f"      Comparado: ARS {LONG_SLEEVE_COMPARE_PRICE:,.2f}")
    print(f"      Desconto: 33%")
    
    print("\n📋 Próximos passos:")
    print("   1. Verifique os arquivos CSV atualizados em data/")
    print("   2. Reimporte para o Shopify ou atualize via API")
    print("   3. Atualize também o script generateShopifyCSV.js")
    print()

if __name__ == '__main__':
    main()

