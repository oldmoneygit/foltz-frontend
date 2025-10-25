#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script automático para analisar imagens de produtos com Claude
"""

import os
import sys
import base64
from pathlib import Path
from PIL import Image
import io
import anthropic

# Configurar encoding UTF-8 no Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

MAX_DIMENSION = 2000
IMAGE_FOLDERS = ["seedream", "id_visual"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

def resize_and_encode_image(image_path, max_dimension=MAX_DIMENSION):
    """Redimensiona se necessário e converte para base64"""
    with Image.open(image_path) as img:
        width, height = img.size

        # Redimensiona se necessário
        if width > max_dimension or height > max_dimension:
            if width > height:
                new_width = max_dimension
                new_height = int((max_dimension / width) * height)
            else:
                new_height = max_dimension
                new_width = int((max_dimension / height) * width)

            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            print(f"  Redimensionada: {width}x{height} -> {new_width}x{new_height}")

        # Converte para bytes
        buffer = io.BytesIO()
        img_format = img.format or 'JPEG'
        img.save(buffer, format=img_format, quality=90)

        return base64.b64encode(buffer.getvalue()).decode('utf-8')

def get_media_type(file_path):
    """Retorna media type da imagem"""
    ext = file_path.suffix.lower()
    return {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }.get(ext, 'image/jpeg')

def collect_and_process_images(folders, limit=5):
    """Coleta e processa imagens"""
    images = []

    for folder in folders:
        folder_path = Path(folder)
        if not folder_path.exists():
            continue

        print(f"\nProcessando: {folder}")

        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img_path in folder_path.glob(ext):
                if limit and len(images) >= limit:
                    break

                try:
                    print(f"  {img_path.name}")
                    image_base64 = resize_and_encode_image(img_path)

                    images.append({
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": get_media_type(img_path),
                            "data": image_base64
                        }
                    })

                except Exception as e:
                    print(f"  ERRO: {e}")

        if limit and len(images) >= limit:
            break

    return images

def analyze_with_claude(images, prompt):
    """Envia para Claude e retorna análise"""
    if not ANTHROPIC_API_KEY:
        print("\nERRO: ANTHROPIC_API_KEY não encontrada")
        return None

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    content = [{"type": "text", "text": prompt}] + images

    print(f"\nEnviando {len(images)} imagens para Claude...")

    try:
        # Tenta diferentes modelos disponíveis
        models_to_try = [
            "claude-3-sonnet-20240229",
            "claude-3-opus-20240229",
            "claude-3-haiku-20240307"
        ]

        last_error = None
        for model in models_to_try:
            try:
                print(f"  Tentando modelo: {model}")
                message = client.messages.create(
                    model=model,
                    max_tokens=4096,
                    messages=[{"role": "user", "content": content}]
                )
                print(f"  ✓ Sucesso com: {model}")
                return message.content[0].text
            except Exception as e:
                print(f"  X Falhou: {model}")
                last_error = e
                continue

        # Se nenhum modelo funcionou
        if last_error:
            raise last_error

        return None

    except Exception as e:
        print(f"\nERRO na API: {e}")
        return None

def main():
    print("="*70)
    print("ANALISE DE PRODUTOS COM CLAUDE")
    print("="*70)

    # Prompt para análise de produtos
    prompt = """Analise estas imagens de jerseys de futebol para e-commerce.

Para cada imagem, forneça:

1. **Identificação**
   - Time/Seleção
   - Tipo (home/away/third/especial)
   - Temporada aproximada

2. **Descrição Visual**
   - Cores predominantes
   - Padrões e design
   - Elementos únicos (patrocínios, detalhes)

3. **Sugestão para E-commerce**
   - Nome do produto
   - Categorias
   - Tags para SEO
   - Preço sugerido (em ARS)

Organize as informações de forma clara para cada imagem."""

    # Processa 5 imagens
    images = collect_and_process_images(IMAGE_FOLDERS, limit=5)

    if not images:
        print("\nNenhuma imagem encontrada!")
        return

    print(f"\n{len(images)} imagens processadas")

    # Analisa com Claude
    result = analyze_with_claude(images, prompt)

    if result:
        print("\n" + "="*70)
        print("RESULTADO DA ANALISE")
        print("="*70)
        print(result)

        # Salva resultado
        output_file = "analise_produtos.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(result)

        print(f"\n✓ Resultado salvo em: {output_file}")
    else:
        print("\nFalha na analise")

    print("\n" + "="*70)

if __name__ == "__main__":
    main()
