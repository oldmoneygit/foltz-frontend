#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para aplicar padronização de nomes nos produtos
ATENÇÃO: Este script renomeia pastas físicas!
"""

import sys
import os
import json
import shutil
from pathlib import Path
from datetime import datetime

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def create_backup():
    """Cria backup do leagues_data.json antes de modificar"""
    leagues_data_file = Path('public/leagues_data.json')

    if not leagues_data_file.exists():
        print("⚠️  leagues_data.json não encontrado em public/")
        return False

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = Path(f'public/leagues_data_backup_{timestamp}.json')

    try:
        shutil.copy2(leagues_data_file, backup_file)
        print(f"✅ Backup criado: {backup_file}")
        return True
    except Exception as e:
        print(f"❌ Erro ao criar backup: {e}")
        return False

def apply_renames(mapping_file='name_standardization_mapping.json', dry_run=True):
    """
    Aplica as renomeações de acordo com o mapeamento
    """
    if not Path(mapping_file).exists():
        print(f"❌ Arquivo {mapping_file} não encontrado!")
        print("Execute primeiro: python standardize_names.py")
        return False

    # Carrega mapeamento
    with open(mapping_file, 'r', encoding='utf-8') as f:
        mapping = json.load(f)

    # Filtra apenas os que precisam mudança
    to_rename = [item for item in mapping if item['needs_change']]

    print("="*70)
    print("🔄 APLICANDO PADRONIZAÇÃO DE NOMES")
    print("="*70)

    if dry_run:
        print("🔍 MODO DRY-RUN (simulação - nenhuma mudança será feita)")
    else:
        print("⚠️  MODO REAL - As pastas serão realmente renomeadas!")

    print(f"\nTotal de itens a renomear: {len(to_rename)}")
    print("="*70)

    success_count = 0
    error_count = 0
    errors = []

    for i, item in enumerate(to_rename, 1):
        old_path = Path(item['path'])

        # Calcula novo caminho
        parent_dir = old_path.parent
        new_path = parent_dir / item['new_name']

        # Mostra progresso
        if i % 20 == 0 or i == 1:
            print(f"\n[{i}/{len(to_rename)}] Processando...")

        if dry_run:
            # Modo simulação - apenas mostra o que faria
            if old_path.exists():
                print(f"  ✓ Renomearia: {old_path.name}")
                print(f"    Para: {new_path.name}")
                success_count += 1
            else:
                print(f"  ⚠️  Não encontrado: {old_path}")
                error_count += 1
        else:
            # Modo real - realmente renomeia
            try:
                if not old_path.exists():
                    print(f"  ⚠️  Pasta não encontrada: {old_path.name}")
                    errors.append(f"Não encontrado: {old_path}")
                    error_count += 1
                    continue

                if new_path.exists():
                    print(f"  ⚠️  Destino já existe: {new_path.name}")
                    errors.append(f"Destino existe: {new_path}")
                    error_count += 1
                    continue

                # Renomeia
                old_path.rename(new_path)
                success_count += 1

                if i <= 10:  # Mostra primeiros 10
                    print(f"  ✅ {old_path.name}")
                    print(f"     → {new_path.name}")

            except Exception as e:
                print(f"  ❌ Erro ao renomear {old_path.name}: {e}")
                errors.append(f"{old_path.name}: {e}")
                error_count += 1

    # Resumo final
    print("\n" + "="*70)
    print("📊 RESUMO")
    print("="*70)
    print(f"✅ Sucesso: {success_count}")
    print(f"❌ Erros: {error_count}")

    if errors and not dry_run:
        print(f"\n⚠️  ERROS ENCONTRADOS ({len(errors)}):")
        for error in errors[:10]:
            print(f"   - {error}")
        if len(errors) > 10:
            print(f"   ... e mais {len(errors) - 10} erros")

    if dry_run:
        print("\n💡 Para aplicar as mudanças de verdade, execute:")
        print("   python apply_name_standardization.py --apply")
    else:
        print("\n✅ Renomeação concluída!")
        print("⏭️  Próximo passo: Regenerar leagues_data.json")
        print("   python organize_leagues.py")

    return success_count > 0

def main():
    import sys

    # Verifica se é modo dry-run ou apply
    dry_run = True
    if len(sys.argv) > 1 and sys.argv[1] in ['--apply', '--real', '-a']:
        dry_run = False

        # Pede confirmação
        print("⚠️  ATENÇÃO!")
        print("Você está prestes a renomear 254 pastas de produtos.")
        print("Um backup do leagues_data.json será criado automaticamente.")
        print("\nTem certeza que deseja continuar? (sim/não): ", end='')

        try:
            resposta = input().strip().lower()
            if resposta not in ['sim', 's', 'yes', 'y']:
                print("❌ Operação cancelada pelo usuário.")
                return
        except (EOFError, KeyboardInterrupt):
            print("\n❌ Operação cancelada.")
            return

        # Cria backup
        if not create_backup():
            print("❌ Não foi possível criar backup. Operação cancelada.")
            return

    # Aplica renomeação
    apply_renames(dry_run=dry_run)

if __name__ == "__main__":
    main()
