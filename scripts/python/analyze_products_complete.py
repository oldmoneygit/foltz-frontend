#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANALISADOR COMPLETO DE PRODUTOS - FOLTZ FANWEAR
Análise detalhada de jerseys com Claude API
"""

import os
import sys
import base64
import json
from pathlib import Path
from PIL import Image
import io
import anthropic
from datetime import datetime

# Configurar encoding UTF-8 no Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

MAX_DIMENSION = 2000
IMAGE_FOLDERS = ["seedream", "id_visual"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

# Configuração: altere aqui
IMAGES_PER_BATCH = 10  # Processar 10 imagens por vez (recomendado para API)
TOTAL_IMAGES = 50      # Total de imagens a processar (None = todas)

def log(message):
    """Log com timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

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
            log(f"  └─ Redimensionada: {width}x{height} -> {new_width}x{new_height}")

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

def collect_and_process_images(folders, limit=None):
    """Coleta e processa imagens"""
    images = []
    image_names = []

    for folder in folders:
        folder_path = Path(folder)
        if not folder_path.exists():
            continue

        log(f"\n📁 Processando pasta: {folder}")

        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img_path in sorted(folder_path.glob(ext)):
                if limit and len(images) >= limit:
                    break

                try:
                    log(f"  ├─ {img_path.name}")
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
                    log(f"  └─ ERRO: {e}")

        if limit and len(images) >= limit:
            break

    return images, image_names

def analyze_with_claude(images, image_names, batch_number):
    """Envia para Claude e retorna análise detalhada"""
    if not ANTHROPIC_API_KEY:
        log("\n❌ ERRO: ANTHROPIC_API_KEY não encontrada")
        return None

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Prompt detalhado e estruturado
    prompt = f"""Você é um especialista em jerseys de futebol para e-commerce.

Analise estas {len(images)} imagens de jerseys e forneça uma análise DETALHADA para cada uma.

Para CADA IMAGEM, forneça no seguinte formato:

---
**IMAGEM {batch_number}-[número] ({image_names[0] if image_names else 'imagem'})**

### 1. IDENTIFICAÇÃO
- Time/Seleção: [Nome completo]
- País/Liga: [País ou liga]
- Tipo de uniforme: [Home/Away/Third/Especial/Goleiro]
- Temporada: [Ano ou período estimado]

### 2. DESCRIÇÃO VISUAL DETALHADA
- **Cores principais**: [Lista de cores com detalhes]
- **Cores secundárias**: [Se houver]
- **Padrão/Design**: [Descrição do design, listras, gradientes, etc]
- **Gola**: [Tipo de gola]
- **Mangas**: [Cor e estilo das mangas]
- **Patrocínios visíveis**:
  - Principal: [Marca]
  - Secundários: [Se houver]
- **Escudo/Logo**: [Descrição do escudo]
- **Elementos únicos**: [Qualquer detalhe especial, textos, badges, etc]

### 3. PRODUTO PARA E-COMMERCE

**Nome do Produto:**
[Nome atrativo e descritivo - máx 70 caracteres]

**Descrição Curta (para listagem):**
[1 frase chamativa de 100-150 caracteres]

**Descrição Completa (para página do produto):**
[Parágrafo de 150-250 palavras, incluindo:
- História/contexto do jersey
- Características técnicas
- Material (se visível)
- Detalhes únicos
- Por que o cliente deve comprar]

**Categorias:**
- Categoria Principal: [Ex: Jerseys Seleções / Jerseys Clubes]
- Subcategoria: [Ex: Europa / América do Sul]
- Tipo: [Home/Away/Third]

**Tags SEO (15-20 tags):**
#[tag1] #[tag2] #[tag3] ...

**Preço Sugerido:**
- ARS: [Preço em pesos argentinos]
- Justificativa: [Por que este preço - baseado em raridade, demanda, etc]

**Produtos Relacionados Sugeridos:**
1. [Tipo de produto relacionado]
2. [Outro produto relacionado]
3. [Mais um produto relacionado]

---

Seja extremamente detalhado e específico. Use linguagem que vende - emotiva, aspiracional e informativa.
"""

    content = [{"type": "text", "text": prompt}] + images

    log(f"\n🤖 Enviando lote {batch_number} ({len(images)} imagens) para Claude...")

    try:
        # Tenta diferentes modelos
        models_to_try = [
            "claude-3-opus-20240229",     # Melhor qualidade
            "claude-3-sonnet-20240229",   # Bom equilíbrio
            "claude-3-haiku-20240307"     # Mais rápido
        ]

        last_error = None
        for model in models_to_try:
            try:
                log(f"  ├─ Tentando modelo: {model}")
                # Define max_tokens baseado no modelo
                max_tokens = 4000 if "haiku" in model else 8000
                message = client.messages.create(
                    model=model,
                    max_tokens=max_tokens,  # Ajustado por modelo
                    messages=[{"role": "user", "content": content}]
                )
                log(f"  └─ ✓ Sucesso com: {model}")
                return message.content[0].text
            except Exception as e:
                log(f"  └─ ✗ Falhou: {str(e)[:100]}")
                last_error = e
                continue

        if last_error:
            raise last_error

        return None

    except Exception as e:
        log(f"\n❌ ERRO na API: {e}")
        return None

def save_results(results, batch_number):
    """Salva resultados em arquivos"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Arquivo individual do lote
    batch_file = f"analise_lote_{batch_number}_{timestamp}.txt"
    with open(batch_file, "w", encoding="utf-8") as f:
        f.write(f"ANÁLISE DE PRODUTOS - LOTE {batch_number}\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write("="*80 + "\n\n")
        f.write(results)

    log(f"  └─ Salvo: {batch_file}")

    # Arquivo consolidado (append)
    consolidated_file = "analise_produtos_completa.txt"
    with open(consolidated_file, "a", encoding="utf-8") as f:
        f.write(f"\n\n{'='*80}\n")
        f.write(f"LOTE {batch_number} - {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
        f.write(f"{'='*80}\n\n")
        f.write(results)
        f.write("\n")

    log(f"  └─ Adicionado ao: {consolidated_file}")

    return batch_file, consolidated_file

def main():
    print("="*80)
    print(" ANALISADOR COMPLETO DE PRODUTOS - FOLTZ FANWEAR ".center(80, "="))
    print("="*80)

    log(f"Configuração:")
    log(f"  ├─ Imagens por lote: {IMAGES_PER_BATCH}")
    log(f"  ├─ Total de imagens: {TOTAL_IMAGES if TOTAL_IMAGES else 'TODAS'}")
    log(f"  └─ Pastas: {', '.join(IMAGE_FOLDERS)}")

    # Coleta todas as imagens disponíveis
    log("\n🔍 Coletando imagens disponíveis...")
    all_images = []
    for folder in IMAGE_FOLDERS:
        folder_path = Path(folder)
        if folder_path.exists():
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                all_images.extend(list(folder_path.glob(ext)))

    total_available = len(all_images)
    log(f"  └─ {total_available} imagens encontradas")

    if total_available == 0:
        log("\n❌ Nenhuma imagem encontrada!")
        return

    # Define quantas processar
    images_to_process = min(TOTAL_IMAGES, total_available) if TOTAL_IMAGES else total_available
    log(f"  └─ Processando: {images_to_process} imagens")

    # Processa em lotes
    total_batches = (images_to_process + IMAGES_PER_BATCH - 1) // IMAGES_PER_BATCH
    log(f"  └─ Total de lotes: {total_batches}")

    processed_count = 0

    for batch_num in range(1, total_batches + 1):
        log(f"\n{'='*80}")
        log(f"🎯 LOTE {batch_num}/{total_batches}")
        log(f"{'='*80}")

        # Calcula quantas imagens pegar neste lote
        remaining = images_to_process - processed_count
        batch_size = min(IMAGES_PER_BATCH, remaining)

        # Processa imagens
        images, image_names = collect_and_process_images(
            IMAGE_FOLDERS,
            limit=processed_count + batch_size
        )

        # Pega apenas as novas imagens deste lote
        images = images[processed_count:]
        image_names = image_names[processed_count:]

        if not images:
            log("  └─ Sem imagens neste lote")
            break

        log(f"\n📊 {len(images)} imagens processadas neste lote")

        # Analisa com Claude
        result = analyze_with_claude(images, image_names, batch_num)

        if result:
            log(f"\n✓ Análise concluída!")
            log(f"  ├─ Tokens na resposta: ~{len(result)} caracteres")

            # Salva resultados
            log(f"\n💾 Salvando resultados...")
            batch_file, consolidated_file = save_results(result, batch_num)

            log(f"\n✓ Lote {batch_num} concluído!")
        else:
            log(f"\n❌ Falha na análise do lote {batch_num}")

        processed_count += len(images)

        # Pequena pausa entre lotes para não sobrecarregar a API
        if batch_num < total_batches:
            import time
            log("\n⏸️  Aguardando 2 segundos antes do próximo lote...")
            time.sleep(2)

    # Resumo final
    print("\n" + "="*80)
    print(" PROCESSAMENTO CONCLUÍDO ".center(80, "="))
    print("="*80)
    log(f"\n📊 RESUMO:")
    log(f"  ├─ Total processado: {processed_count} imagens")
    log(f"  ├─ Lotes completados: {batch_num}")
    log(f"  ├─ Arquivo consolidado: analise_produtos_completa.txt")
    log(f"  └─ Arquivos individuais: analise_lote_*.txt")

    print("\n" + "="*80)
    log("✨ Processo finalizado com sucesso!")
    print("="*80)

if __name__ == "__main__":
    main()
