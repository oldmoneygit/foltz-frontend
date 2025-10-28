#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRIPT MASTER - EXECUTA TODAS AS ANÁLISES
Roda todos os scripts de análise de produtos automaticamente
"""

import os
import sys
import subprocess
from datetime import datetime

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def run_script(script_name, description):
    """Executa um script Python e retorna sucesso/falha"""
    print("\n" + "="*80)
    print(f" {description} ".center(80, "="))
    print("="*80)

    try:
        result = subprocess.run(
            [sys.executable, script_name],
            capture_output=False,
            text=True,
            check=True
        )
        print(f"\n✓ {description} - CONCLUÍDO")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n✗ {description} - FALHOU")
        print(f"Erro: {e}")
        return False
    except Exception as e:
        print(f"\n✗ {description} - ERRO")
        print(f"Erro: {e}")
        return False

def main():
    print("="*80)
    print(" ANÁLISE COMPLETA DE PRODUTOS - FOLTZ FANWEAR ".center(80, "="))
    print(" EXECUTANDO TODOS OS SCRIPTS ".center(80, "="))
    print("="*80)

    start_time = datetime.now()
    print(f"\nInício: {start_time.strftime('%d/%m/%Y %H:%M:%S')}")

    results = {}

    # Lista de scripts para executar
    scripts = [
        ("extract_colors.py", "1/3 - EXTRAÇÃO DE CORES DOMINANTES"),
        ("generate_seo_content.py", "2/3 - GERAÇÃO DE CONTEÚDO SEO"),
        ("analyze_products_complete.py", "3/3 - ANÁLISE COMPLETA DE PRODUTOS")
    ]

    # Executa cada script
    for script, description in scripts:
        if os.path.exists(script):
            results[script] = run_script(script, description)
        else:
            print(f"\n✗ Script não encontrado: {script}")
            results[script] = False

    # Resumo final
    end_time = datetime.now()
    duration = end_time - start_time

    print("\n" + "="*80)
    print(" RESUMO DA EXECUÇÃO ".center(80, "="))
    print("="*80)

    print(f"\nInício: {start_time.strftime('%H:%M:%S')}")
    print(f"Fim: {end_time.strftime('%H:%M:%S')}")
    print(f"Duração: {duration}")

    print("\nResultados:")
    for script, success in results.items():
        status = "✓ SUCESSO" if success else "✗ FALHOU"
        print(f"  {status} - {script}")

    successful = sum(results.values())
    total = len(results)

    print(f"\n{successful}/{total} scripts executados com sucesso")

    print("\nArquivos gerados:")
    output_files = [
        "cores_dominantes.json",
        "conteudo_seo_*.txt",
        "analise_lote_*.txt",
        "analise_produtos_completa.txt"
    ]

    for pattern in output_files:
        print(f"  • {pattern}")

    print("\n" + "="*80)
    if successful == total:
        print(" TODAS AS ANÁLISES CONCLUÍDAS COM SUCESSO! ".center(80, "="))
    else:
        print(" ALGUMAS ANÁLISES FALHARAM ".center(80, "="))
    print("="*80)

if __name__ == "__main__":
    main()
