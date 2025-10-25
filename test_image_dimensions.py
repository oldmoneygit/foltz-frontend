#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de teste para verificar dimensões das imagens
"""

import sys
from pathlib import Path
from PIL import Image

# Configurar encoding UTF-8 no Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

MAX_DIMENSION = 2000
IMAGE_FOLDERS = ["seedream", "id_visual"]

def check_images():
    print("="*70)
    print("VERIFICANDO DIMENSOES DAS IMAGENS")
    print("="*70)
    print(f"Limite máximo por dimensão: {MAX_DIMENSION}px\n")

    total_images = 0
    images_need_resize = 0

    for folder in IMAGE_FOLDERS:
        folder_path = Path(folder)

        if not folder_path.exists():
            print(f"[!] Pasta nao encontrada: {folder}")
            continue

        print(f"[PASTA] {folder}")
        print("-" * 70)

        for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp']:
            for img_path in folder_path.glob(ext):
                try:
                    with Image.open(img_path) as img:
                        width, height = img.size
                        total_images += 1

                        needs_resize = width > MAX_DIMENSION or height > MAX_DIMENSION

                        if needs_resize:
                            images_need_resize += 1
                            # Calcula novas dimensões
                            if width > height:
                                new_width = MAX_DIMENSION
                                new_height = int((MAX_DIMENSION / width) * height)
                            else:
                                new_height = MAX_DIMENSION
                                new_width = int((MAX_DIMENSION / height) * width)

                            print(f"[X] {img_path.name}")
                            print(f"    Original: {width}x{height}px")
                            print(f"    Redimensionada: {new_width}x{new_height}px")
                            print()
                        else:
                            print(f"[OK] {img_path.name} ({width}x{height}px)")

                except Exception as e:
                    print(f"[!] Erro ao processar {img_path.name}: {e}")

        print()

    print("="*70)
    print(f"RESUMO")
    print("="*70)
    print(f"Total de imagens: {total_images}")
    print(f"Precisam redimensionamento: {images_need_resize} ({(images_need_resize/total_images*100) if total_images > 0 else 0:.1f}%)")
    print(f"Ja estao OK: {total_images - images_need_resize} ({((total_images-images_need_resize)/total_images*100) if total_images > 0 else 0:.1f}%)")
    print("="*70)

    if images_need_resize > 0:
        print("\nUse 'python process_images_claude.py' para processar as imagens")
        print("O script ira redimensionar automaticamente as imagens grandes.")
    else:
        print("\nTodas as imagens estao dentro do limite!")

if __name__ == "__main__":
    check_images()
