#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CORRIGIR E REPROCESSAR LOTES FALHADOS
Processa apenas os lotes 4 e 5 que falharam
"""

import os
import sys
import base64
from pathlib import Path
from PIL import Image
import io
import anthropic
from datetime import datetime

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

MAX_DIMENSION = 2000
IMAGE_FOLDERS = ["seedream", "id_visual"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

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

    # Pega apenas as imagens solicitadas
    selected = all_images[start_index:start_index + count]

    images = []
    image_names = []

    log(f"\nProcessando {len(selected)} imagens (índices {start_index}-{start_index+len(selected)-1})...")

    for img_path in selected:
        try:
            log(f"  {img_path.name}")
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
            log(f"  ERRO: {e}")

    return images, image_names

def analyze_batch(images, image_names, batch_number):
    """Analisa um lote com configuração corrigida"""
    if not ANTHROPIC_API_KEY:
        log("ERRO: API Key não encontrada")
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

    log(f"\nEnviando lote {batch_number} para Claude...")

    try:
        # Apenas Haiku com limite correto
        log("  Usando: claude-3-haiku-20240307")
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=4000,  # ✓ CORRIGIDO: limite do Haiku
            messages=[{"role": "user", "content": content}]
        )
        log("  ✓ Sucesso!")
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

    log(f"  Salvo: {filename}")

    # Adiciona ao consolidado
    with open("analise_produtos_completa.txt", 'a', encoding='utf-8') as f:
        f.write(f"\n\n{'='*80}\n")
        f.write(f"LOTE {batch_number} - {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write(f"{'='*80}\n\n")
        f.write(result)

    log(f"  Adicionado ao consolidado")

def main():
    print("="*80)
    print(" REPROCESSAR LOTES FALHADOS ".center(80, "="))
    print("="*80)

    log("Configuração:")
    log("  ├─ Lotes a processar: 4 e 5")
    log("  ├─ Imagens por lote: 10")
    log("  └─ Modelo: Haiku (max_tokens=4000)")

    # Lote 4: imagens 30-39
    log("\n" + "="*80)
    log("LOTE 4 (imagens 30-39)")
    log("="*80)

    images_4, names_4 = collect_images(30, 10)
    if images_4:
        result_4 = analyze_batch(images_4, names_4, 4)
        if result_4:
            save_results(result_4, 4)
            log("✓ Lote 4 concluído!")
        else:
            log("✗ Lote 4 falhou")

    import time
    time.sleep(2)

    # Lote 5: imagens 40-49
    log("\n" + "="*80)
    log("LOTE 5 (imagens 40-49)")
    log("="*80)

    images_5, names_5 = collect_images(40, 10)
    if images_5:
        result_5 = analyze_batch(images_5, names_5, 5)
        if result_5:
            save_results(result_5, 5)
            log("✓ Lote 5 concluído!")
        else:
            log("✗ Lote 5 falhou")

    print("\n" + "="*80)
    print(" REPROCESSAMENTO CONCLUÍDO ".center(80, "="))
    print("="*80)
    log("\nAgora você tem a análise completa de 50 imagens!")
    log("Verifique: analise_produtos_completa.txt")
    print("="*80)

if __name__ == "__main__":
    main()
