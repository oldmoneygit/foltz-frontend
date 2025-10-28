#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANÁLISE COMPLETA - TODOS OS 5 LOTES
Processa as 50 imagens em 5 lotes de 10
"""

import os
import sys
import base64
from pathlib import Path
from PIL import Image
import io
import anthropic
from datetime import datetime
import time

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

MAX_DIMENSION = 2000
IMAGE_FOLDERS = ["seedream", "id_visual"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
IMAGES_PER_BATCH = 10
TOTAL_BATCHES = 5

def log(message):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def resize_and_encode_image(image_path, max_dimension=MAX_DIMENSION):
    with Image.open(image_path) as img:
        width, height = img.size
        if width > max_dimension or height > max_dimension:
            if width > height:
                new_width = max_dimension
                new_height = int((max_dimension / width) * height)
            else:
                new_height = max_dimension
                new_width = int((max_dimension / height) * width)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        buffer = io.BytesIO()
        img.save(buffer, format=img.format or 'JPEG', quality=90)
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

def get_media_type(file_path):
    ext = file_path.suffix.lower()
    return {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
            '.gif': 'image/gif', '.webp': 'image/webp'}.get(ext, 'image/jpeg')

def collect_images(start_index, count):
    """Coleta imagens específicas"""
    all_images = []
    for folder in IMAGE_FOLDERS:
        folder_path = Path(folder)
        if folder_path.exists():
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                all_images.extend(sorted(folder_path.glob(ext)))

    selected = all_images[start_index:start_index + count]
    images = []
    image_names = []

    log(f"  Processando {len(selected)} imagens (índices {start_index}-{start_index+len(selected)-1})...")

    for img_path in selected:
        try:
            image_base64 = resize_and_encode_image(img_path)
            images.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": get_media_type(img_path),
                    "data": image_base64
                }
            })
            image_names.append(img_path.name)
        except Exception as e:
            log(f"    ERRO: {e}")

    return images, image_names

def analyze_batch(images, image_names, batch_number):
    """Analisa um lote"""
    if not ANTHROPIC_API_KEY:
        return None

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    prompt = f"""Analise estas {len(images)} imagens de jerseys de futebol para e-commerce.

Para CADA IMAGEM, forneça:

**IMAGEM {batch_number}-[número]**

1. IDENTIFICAÇÃO
   - Time/Seleção
   - Liga/País
   - Tipo (Home/Away/Third)
   - Temporada

2. DESCRIÇÃO
   - Cores principais
   - Design/Padrões
   - Patrocínios
   - Elementos únicos

3. PRODUTO E-COMMERCE
   - Nome do produto
   - Descrição (100-200 palavras)
   - Categorias
   - Tags SEO (10-15)
   - Preço sugerido (ARS)

Seja detalhado e específico."""

    content = [{"type": "text", "text": prompt}] + images

    try:
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=4000,
            messages=[{"role": "user", "content": content}]
        )
        return message.content[0].text
    except Exception as e:
        log(f"  ✗ Erro: {e}")
        return None

def save_results(result, batch_number):
    """Salva resultados"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"analise_lote_{batch_number}_{timestamp}.txt"

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"ANÁLISE DE PRODUTOS - LOTE {batch_number}\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")
        f.write(result)

    # Adiciona ou cria o consolidado
    with open("analise_produtos_completa.txt", 'a', encoding='utf-8') as f:
        f.write(f"\n{'='*80}\n")
        f.write(f"LOTE {batch_number} - {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write(f"{'='*80}\n\n")
        f.write(result)
        f.write("\n")

    return filename

def main():
    print("\n" + "="*80)
    print(" ANÁLISE COMPLETA - 50 IMAGENS EM 5 LOTES ".center(80, "="))
    print("="*80)

    log("Configuração:")
    log(f"  ├─ Total de lotes: {TOTAL_BATCHES}")
    log(f"  ├─ Imagens por lote: {IMAGES_PER_BATCH}")
    log(f"  ├─ Total de imagens: {TOTAL_BATCHES * IMAGES_PER_BATCH}")
    log(f"  └─ Modelo: Haiku (4000 tokens)")

    # Limpa o arquivo consolidado anterior
    with open("analise_produtos_completa.txt", 'w', encoding='utf-8') as f:
        f.write("ANÁLISE COMPLETA DE PRODUTOS - FOLTZ FANWEAR\n")
        f.write(f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write("="*80 + "\n")

    successful_batches = 0
    failed_batches = []

    for batch_num in range(1, TOTAL_BATCHES + 1):
        log("\n" + "="*80)
        log(f"LOTE {batch_num}/{TOTAL_BATCHES}")
        log("="*80)

        start_idx = (batch_num - 1) * IMAGES_PER_BATCH

        images, names = collect_images(start_idx, IMAGES_PER_BATCH)

        if not images:
            log("  ✗ Sem imagens neste lote")
            failed_batches.append(batch_num)
            continue

        log(f"\n  Enviando {len(images)} imagens para Claude...")

        result = analyze_batch(images, names, batch_num)

        if result:
            filename = save_results(result, batch_num)
            log(f"  ✓ Sucesso!")
            log(f"  ✓ Salvo: {filename}")
            successful_batches += 1
        else:
            log(f"  ✗ Falhou")
            failed_batches.append(batch_num)

        # Pausa entre lotes (exceto no último)
        if batch_num < TOTAL_BATCHES:
            log("  Aguardando 2s...")
            time.sleep(2)

    # Resumo final
    print("\n" + "="*80)
    print(" RESUMO FINAL ".center(80, "="))
    print("="*80)

    log(f"Lotes bem-sucedidos: {successful_batches}/{TOTAL_BATCHES}")
    log(f"Imagens analisadas: {successful_batches * IMAGES_PER_BATCH}")

    if failed_batches:
        log(f"Lotes com falha: {failed_batches}")
    else:
        log("✓ Todos os lotes processados com sucesso!")

    log(f"\nArquivos gerados:")
    log(f"  ├─ analise_produtos_completa.txt (consolidado)")
    log(f"  └─ analise_lote_*.txt ({successful_batches} arquivos)")

    print("="*80)

if __name__ == "__main__":
    main()
