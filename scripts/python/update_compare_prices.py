#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para atualizar o preço comparado (preço riscado) para ser 50% maior que o preço promocional
Autor: Foltz Fanwear
Data: 29/10/2025
"""

import csv
import os
import sys
from pathlib import Path

# Configurar encoding UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def update_csv_compare_prices(input_file, output_file=None):
    """
    Atualiza o preço comparado para ser 1.5x o preço promocional
    
    Args:
        input_file: Caminho do arquivo CSV de entrada
        output_file: Caminho do arquivo CSV de saída (opcional, sobrescreve se None)
    """
    if output_file is None:
        output_file = input_file
    
    print(f"\n📊 Processando: {input_file}")
    
    # Ler o CSV
    rows = []
    header = None
    updated_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        # Encontrar índices das colunas de preço
        try:
            price_idx = header.index('Variant Price')
            compare_price_idx = header.index('Variant Compare At Price')
        except ValueError as e:
            print(f"❌ Erro: Coluna não encontrada - {e}")
            return
        
        print(f"✅ Colunas encontradas:")
        print(f"   - Variant Price: coluna {price_idx}")
        print(f"   - Variant Compare At Price: coluna {compare_price_idx}")
        
        # Processar cada linha
        for row in reader:
            try:
                # Obter o preço promocional
                price_str = row[price_idx]
                
                if price_str and price_str.strip():
                    # Converter para float
                    price = float(price_str)
                    
                    # Calcular novo preço comparado (50% mais caro)
                    new_compare_price = price * 1.5
                    
                    # Atualizar a linha
                    old_compare = row[compare_price_idx]
                    row[compare_price_idx] = f"{new_compare_price:.2f}"
                    
                    updated_count += 1
                    
                    # Mostrar exemplo da primeira atualização
                    if updated_count == 1:
                        print(f"\n💰 Exemplo de atualização:")
                        print(f"   Preço promocional: {price:.2f}")
                        print(f"   Preço comparado ANTIGO: {old_compare}")
                        print(f"   Preço comparado NOVO: {new_compare_price:.2f}")
                        print(f"   Diferença: +{((new_compare_price / price - 1) * 100):.1f}%")
            
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
    print(f"🔄 Linhas atualizadas: {updated_count}")
    print(f"📦 Total de linhas: {len(rows)}")

def main():
    # Diretório base do projeto
    base_dir = Path(__file__).parent.parent.parent
    data_dir = base_dir / 'data'
    
    print("\n" + "="*60)
    print("🏷️  ATUALIZAÇÃO DE PREÇOS COMPARADOS - FOLTZ FANWEAR")
    print("="*60)
    print("\n📌 Nova regra: Preço Comparado = Preço Promocional × 1.5")
    print("   (50% mais caro que o preço promocional)")
    
    # Arquivos para processar
    files_to_process = [
        data_dir / 'shopify-products-import.csv',
        data_dir / 'shopify-products-TEST.csv'
    ]
    
    total_updated = 0
    
    for file_path in files_to_process:
        if file_path.exists():
            print(f"\n{'─'*60}")
            update_csv_compare_prices(file_path)
            total_updated += 1
        else:
            print(f"\n⚠️  Arquivo não encontrado: {file_path}")
    
    print("\n" + "="*60)
    print(f"✨ CONCLUÍDO! {total_updated} arquivo(s) processado(s)")
    print("="*60)
    
    print("\n📋 Próximos passos:")
    print("   1. Verifique os arquivos CSV atualizados em data/")
    print("   2. Reimporte para o Shopify ou atualize via API")
    print("   3. O script de geração também foi atualizado para novos produtos")
    print()

if __name__ == '__main__':
    main()

