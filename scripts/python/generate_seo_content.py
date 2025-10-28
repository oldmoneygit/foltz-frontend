#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GERADOR DE CONTEÚDO SEO
Cria títulos, descrições e meta tags otimizadas
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
BATCH_SIZE = 5

def resize_and_encode_image(image_path, max_dimension=MAX_DIMENSION):
    """Redimensiona e codifica imagem"""
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
    """Retorna media type"""
    ext = file_path.suffix.lower()
    return {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
            '.gif': 'image/gif', '.webp': 'image/webp'}.get(ext, 'image/jpeg')

def generate_seo_content(images, image_names):
    """Gera conteúdo SEO com Claude"""
    if not ANTHROPIC_API_KEY:
        print("ERRO: ANTHROPIC_API_KEY não encontrada")
        return None

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    prompt = f"""Você é um especialista em SEO para e-commerce de jerseys de futebol.

Analise estas {len(images)} imagens e gere conteúdo SEO OTIMIZADO para cada uma.

Para CADA IMAGEM, forneça:

---
**IMAGEM: [nome do arquivo]**

### SEO METADATA

**Title Tag (máx 60 caracteres):**
[Título otimizado com palavra-chave principal]

**Meta Description (máx 155 caracteres):**
[Descrição persuasiva que incentiva o clique]

**URL Slug:**
[url-amigavel-com-palavras-chave]

**H1 (Título da Página):**
[Título principal com palavra-chave]

**H2 Sugeridos (3-5):**
1. [Subtítulo 1]
2. [Subtítulo 2]
3. [Subtítulo 3]

### PALAVRAS-CHAVE

**Palavra-chave Principal:**
[palavra-chave foco]

**Palavras-chave Secundárias (5-10):**
- [keyword 1]
- [keyword 2]
- [keyword 3]
...

**Long-tail Keywords (5-10):**
- [frase long-tail 1]
- [frase long-tail 2]
...

### TEXTO SEO (300-500 palavras)

[Parágrafo introdutório otimizado com densidade de palavra-chave de 2-3%]

[Parágrafo sobre características do produto]

[Parágrafo sobre benefícios para o cliente]

[Call-to-action final]

### SCHEMA MARKUP (JSON-LD)

```json
{{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "[Nome do Produto]",
  "image": "[URL da imagem]",
  "description": "[Descrição]",
  "brand": "Foltz Fanwear",
  "offers": {{
    "@type": "Offer",
    "price": "[preço]",
    "priceCurrency": "ARS"
  }}
}}
```

### ALT TEXT PARA IMAGENS

**Alt Text Principal:**
[Descrição acessível e otimizada]

**Alt Text Variações (3):**
1. [Variação 1]
2. [Variação 2]
3. [Variação 3]

---

Use palavras-chave naturalmente. Foque em intenção de busca comercial.
"""

    content = [{"type": "text", "text": prompt}] + images

    print(f"\nEnviando {len(images)} imagens para análise SEO...")

    try:
        models = ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]

        for model in models:
            try:
                print(f"  Tentando: {model}")
                message = client.messages.create(
                    model=model,
                    max_tokens=8000,
                    messages=[{"role": "user", "content": content}]
                )
                print(f"  ✓ Sucesso!")
                return message.content[0].text
            except Exception as e:
                print(f"  X Falhou: {str(e)[:50]}")
                continue

        return None

    except Exception as e:
        print(f"\nERRO: {e}")
        return None

def main():
    print("="*70)
    print("GERADOR DE CONTEÚDO SEO".center(70))
    print("="*70)

    # Coleta imagens
    images = []
    image_names = []

    for folder in IMAGE_FOLDERS:
        folder_path = Path(folder)
        if not folder_path.exists():
            continue

        print(f"\nProcessando: {folder}")

        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img_path in sorted(folder_path.glob(ext)):
                if len(images) >= BATCH_SIZE:
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
                    image_names.append(img_path.name)

                except Exception as e:
                    print(f"  ERRO: {e}")

            if len(images) >= BATCH_SIZE:
                break

        if len(images) >= BATCH_SIZE:
            break

    if not images:
        print("\nNenhuma imagem encontrada!")
        return

    print(f"\n{len(images)} imagens processadas")

    # Gera conteúdo SEO
    result = generate_seo_content(images, image_names)

    if result:
        # Salva resultado
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"conteudo_seo_{timestamp}.txt"

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("CONTEÚDO SEO - FOLTZ FANWEAR\n")
            f.write(f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            f.write("="*70 + "\n\n")
            f.write(result)

        print("\n" + "="*70)
        print(f"✓ Conteúdo SEO gerado!")
        print(f"✓ Salvo em: {output_file}")
        print("="*70)
    else:
        print("\nFalha ao gerar conteúdo")

if __name__ == "__main__":
    main()
