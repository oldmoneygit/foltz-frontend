#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ORGANIZADOR DE LIGAS E PRODUTOS
Mapeia todas as imagens por liga e cria estrutura de dados
"""

import os
import sys
import json
from pathlib import Path
from collections import defaultdict

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

LEAGUES_FOLDER = "Leagues"

# Mapeamento de pastas para IDs limpos
LEAGUE_MAPPING = {
    "Albums belong to Bundesliga": {
        "id": "bundesliga",
        "name": "Bundesliga",
        "country": "Alemanha",
        "description": "Liga alemã de futebol - os melhores times da Alemanha",
        "color": "#D20515"  # Vermelho Bundesliga
    },
    "Albums belong to EREDIVISIE": {
        "id": "eredivisie",
        "name": "Eredivisie",
        "country": "Holanda",
        "description": "Campeonato holandês de futebol profissional",
        "color": "#FF6C00"  # Laranja Holanda
    },
    "Albums belong to La Liga": {
        "id": "la-liga",
        "name": "La Liga",
        "country": "Espanha",
        "description": "Liga espanhola - Real Madrid, Barcelona e mais",
        "color": "#FF4747"  # Vermelho La Liga
    },
    "Albums belong to LIGA MX": {
        "id": "liga-mx",
        "name": "Liga MX",
        "country": "México",
        "description": "Campeonato mexicano de futebol",
        "color": "#006847"  # Verde México
    },
    "Albums belong to Ligue 1": {
        "id": "ligue-1",
        "name": "Ligue 1",
        "country": "França",
        "description": "Liga francesa - PSG, Lyon, Marseille e mais",
        "color": "#0055A4"  # Azul França
    },
    "Albums belong to Long sleeve": {
        "id": "long-sleeve",
        "name": "Manga Longa",
        "country": "Internacional",
        "description": "Camisas de manga longa de todas as ligas",
        "color": "#1A1A1A"  # Preto
    },
    "Albums belong to MLS": {
        "id": "mls",
        "name": "MLS",
        "country": "Estados Unidos",
        "description": "Major League Soccer - futebol americano",
        "color": "#C4122E"  # Vermelho MLS
    },
    "Albums belong to Premier League": {
        "id": "premier-league",
        "name": "Premier League",
        "country": "Inglaterra",
        "description": "Liga inglesa - a mais competitiva do mundo",
        "color": "#3D195B"  # Roxo Premier League
    },
    "Albums belong to Primeira Liga": {
        "id": "primeira-liga",
        "name": "Primeira Liga",
        "country": "Portugal",
        "description": "Campeonato português - Benfica, Porto, Sporting",
        "color": "#006F3C"  # Verde Portugal
    },
    "Albums belong to SAF": {
        "id": "saf",
        "name": "Sul-Americana",
        "country": "América do Sul",
        "description": "Ligas sul-americanas - Brasil, Argentina e mais",
        "color": "#009B3A"  # Verde Brasil
    },
    "Albums belong to Serie A": {
        "id": "serie-a",
        "name": "Serie A",
        "country": "Itália",
        "description": "Liga italiana - Juventus, Milan, Inter e mais",
        "color": "#008FD7"  # Azul Itália
    }
}

def organize_leagues():
    """Organiza todas as imagens por liga"""
    print("="*80)
    print(" ORGANIZADOR DE LIGAS - FOLTZ FANWEAR ".center(80, "="))
    print("="*80)

    leagues_path = Path(LEAGUES_FOLDER)

    if not leagues_path.exists():
        print(f"\nERRO: Pasta {LEAGUES_FOLDER} não encontrada!")
        return None

    leagues_data = {}
    total_products = 0
    total_images = 0

    for folder_name, league_info in LEAGUE_MAPPING.items():
        league_folder = leagues_path / folder_name

        if not league_folder.exists():
            print(f"\n⚠️  {folder_name} não encontrada")
            continue

        print(f"\n📁 {league_info['name']}")
        print("-" * 80)

        # Busca todos os produtos (subpastas)
        products = []

        for product_folder in sorted(league_folder.iterdir()):
            if not product_folder.is_dir():
                continue

            # Conta imagens no produto
            images = []
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                images.extend(list(product_folder.glob(ext)))

            if images:
                product_name = product_folder.name

                # Tenta extrair informações do nome da pasta
                # Exemplo: "1989 Dortmund Home (Size S-XXL)"
                parts = product_name.split('(')
                name_part = parts[0].strip()
                size_part = parts[1].replace(')', '').strip() if len(parts) > 1 else "Tamanhos disponíveis"

                # Usa paths relativos simples
                rel_images = [str(img).replace('\\', '/') for img in images]

                products.append({
                    "id": product_folder.name.lower().replace(' ', '-').replace('(', '').replace(')', ''),
                    "name": name_part,
                    "folder": product_folder.name,
                    "sizes": size_part,
                    "images": rel_images,
                    "image_count": len(images),
                    "main_image": rel_images[0] if rel_images else None
                })

                total_images += len(images)

        total_products += len(products)

        leagues_data[league_info['id']] = {
            **league_info,
            "product_count": len(products),
            "image_count": sum(p['image_count'] for p in products),
            "products": products
        }

        print(f"  ├─ Produtos: {len(products)}")
        print(f"  └─ Imagens: {sum(p['image_count'] for p in products)}")

    # Resumo
    print("\n" + "="*80)
    print(" RESUMO ".center(80, "="))
    print("="*80)
    print(f"\nTotal de ligas: {len(leagues_data)}")
    print(f"Total de produtos: {total_products}")
    print(f"Total de imagens: {total_images}")

    # Salva em JSON
    output_file = "leagues_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(leagues_data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Dados salvos em: {output_file}")

    # Cria arquivo resumido
    summary = {
        "leagues": [
            {
                "id": data['id'],
                "name": data['name'],
                "country": data['country'],
                "description": data['description'],
                "color": data['color'],
                "product_count": data['product_count'],
                "image_count": data['image_count']
            }
            for data in leagues_data.values()
        ],
        "stats": {
            "total_leagues": len(leagues_data),
            "total_products": total_products,
            "total_images": total_images
        }
    }

    with open("leagues_summary.json", 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(f"✓ Resumo salvo em: leagues_summary.json")

    print("\n" + "="*80)

    return leagues_data

if __name__ == "__main__":
    organize_leagues()
