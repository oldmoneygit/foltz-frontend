#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EXTRATOR DE CORES DOMINANTES
Analisa cores principais de cada jersey
"""

import os
import sys
from pathlib import Path
from PIL import Image
from collections import Counter
import json

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

IMAGE_FOLDERS = ["seedream", "id_visual"]

def rgb_to_hex(rgb):
    """Converte RGB para HEX"""
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_color_name(rgb):
    """Retorna nome aproximado da cor"""
    r, g, b = rgb

    # Cores básicas
    if r > 200 and g > 200 and b > 200:
        return "Branco"
    elif r < 50 and g < 50 and b < 50:
        return "Preto"
    elif r > 200 and g < 100 and b < 100:
        return "Vermelho"
    elif r < 100 and g > 200 and b < 100:
        return "Verde"
    elif r < 100 and g < 100 and b > 200:
        return "Azul"
    elif r > 200 and g > 200 and b < 100:
        return "Amarelo"
    elif r > 200 and g > 100 and b < 100:
        return "Laranja"
    elif r > 150 and g < 100 and b > 150:
        return "Roxo"
    elif r < 100 and g > 150 and b > 150:
        return "Ciano"
    elif r > 100 and g > 100 and b > 100:
        return "Cinza"
    else:
        return "Misto"

def extract_dominant_colors(image_path, num_colors=5):
    """Extrai cores dominantes da imagem"""
    try:
        with Image.open(image_path) as img:
            # Redimensiona para processar mais rápido
            img = img.resize((150, 150))
            img = img.convert('RGB')

            # Pega todos os pixels
            pixels = list(img.getdata())

            # Conta cores mais comuns
            color_counter = Counter(pixels)
            most_common = color_counter.most_common(num_colors)

            # Formata resultado
            colors = []
            for color, count in most_common:
                percentage = (count / len(pixels)) * 100
                colors.append({
                    'rgb': color,
                    'hex': rgb_to_hex(color),
                    'name': get_color_name(color),
                    'percentage': round(percentage, 2)
                })

            return colors

    except Exception as e:
        print(f"Erro ao processar {image_path.name}: {e}")
        return None

def analyze_all_images():
    """Analisa cores de todas as imagens"""
    print("="*70)
    print("EXTRATOR DE CORES DOMINANTES".center(70))
    print("="*70)

    results = {}

    for folder in IMAGE_FOLDERS:
        folder_path = Path(folder)
        if not folder_path.exists():
            continue

        print(f"\nProcessando: {folder}")

        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img_path in sorted(folder_path.glob(ext)):
                print(f"  {img_path.name}")

                colors = extract_dominant_colors(img_path)

                if colors:
                    results[img_path.name] = colors

                    # Mostra cores principais
                    print(f"    Cores principais:")
                    for i, color in enumerate(colors[:3], 1):
                        print(f"      {i}. {color['name']} ({color['hex']}) - {color['percentage']}%")

    # Salva resultado em JSON
    output_file = "cores_dominantes.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n" + "="*70)
    print(f"✓ Análise concluída!")
    print(f"✓ {len(results)} imagens analisadas")
    print(f"✓ Resultado salvo em: {output_file}")
    print("="*70)

    return results

if __name__ == "__main__":
    analyze_all_images()
