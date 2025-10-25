#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TESTE RÁPIDO - Valida que tudo está funcionando
"""

import os
import sys
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("="*70)
print("TESTE RÁPIDO - VALIDAÇÃO DO SISTEMA".center(70))
print("="*70)

checks = []

# 1. Verificar dependências
print("\n1. Verificando dependências...")
try:
    import anthropic
    import PIL
    from dotenv import load_dotenv
    print("  ✓ Todas as dependências instaladas")
    checks.append(True)
except ImportError as e:
    print(f"  ✗ Falta instalar: {e}")
    checks.append(False)

# 2. Verificar API Key
print("\n2. Verificando API Key...")
load_dotenv()
api_key = os.environ.get("ANTHROPIC_API_KEY")
if api_key and api_key.startswith("sk-ant-"):
    print("  ✓ API Key configurada")
    checks.append(True)
else:
    print("  ✗ API Key não encontrada ou inválida")
    checks.append(False)

# 3. Verificar pastas de imagens
print("\n3. Verificando pastas de imagens...")
folders = ["seedream", "id_visual"]
total_images = 0
for folder in folders:
    folder_path = Path(folder)
    if folder_path.exists():
        count = len(list(folder_path.glob("*.jpg"))) + len(list(folder_path.glob("*.png")))
        print(f"  ✓ {folder}: {count} imagens")
        total_images += count
        checks.append(True)
    else:
        print(f"  ✗ Pasta não encontrada: {folder}")
        checks.append(False)

# 4. Verificar scripts
print("\n4. Verificando scripts...")
scripts = [
    "analyze_products.py",
    "analyze_products_complete.py",
    "extract_colors.py",
    "generate_seo_content.py",
    "run_all_analysis.py"
]

for script in scripts:
    if Path(script).exists():
        print(f"  ✓ {script}")
        checks.append(True)
    else:
        print(f"  ✗ {script} não encontrado")
        checks.append(False)

# 5. Verificar documentação
print("\n5. Verificando documentação...")
docs = ["QUICK_START.md", "GUIA_DE_USO.md", "SCRIPTS_INDEX.txt"]
for doc in docs:
    if Path(doc).exists():
        print(f"  ✓ {doc}")
        checks.append(True)
    else:
        print(f"  ✗ {doc} não encontrado")
        checks.append(False)

# Resumo
print("\n" + "="*70)
print("RESUMO".center(70))
print("="*70)

passed = sum(checks)
total = len(checks)
percentage = (passed / total) * 100

print(f"\nTestes passados: {passed}/{total} ({percentage:.1f}%)")
print(f"Total de imagens encontradas: {total_images}")

if percentage == 100:
    print("\n✅ SISTEMA 100% PRONTO!")
    print("\nPróximo passo:")
    print("  python run_all_analysis.py")
elif percentage >= 80:
    print("\n⚠️  Sistema quase pronto (alguns avisos)")
    print("\nVocê pode executar:")
    print("  python analyze_products.py")
else:
    print("\n❌ Sistema com problemas")
    print("\nVerifique:")
    print("  1. pip install -r requirements.txt")
    print("  2. Arquivo .env com ANTHROPIC_API_KEY")
    print("  3. Pastas seedream/ e id_visual/")

print("\n" + "="*70)
