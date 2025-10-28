#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para processar imagens e enviá-las à API do Claude
Redimensiona automaticamente imagens que excedem 2000px em qualquer dimensão
"""

import os
import sys
import base64
import json
from pathlib import Path
from PIL import Image
import io
import anthropic

# Configurar encoding UTF-8 no Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Carregar variáveis de ambiente do arquivo .env
from dotenv import load_dotenv
load_dotenv()

# Configurações
MAX_DIMENSION = 2000  # Limite da API para many-image requests
IMAGE_FOLDERS = ["seedream", "id_visual"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

def get_image_dimensions(image_path):
    """Retorna as dimensões da imagem"""
    with Image.open(image_path) as img:
        return img.size

def resize_image_if_needed(image_path, max_dimension=MAX_DIMENSION):
    """
    Redimensiona a imagem se exceder max_dimension em qualquer dimensão
    Mantém a proporção original
    Retorna bytes da imagem processada
    """
    with Image.open(image_path) as img:
        width, height = img.size

        # Verifica se precisa redimensionar
        if width <= max_dimension and height <= max_dimension:
            # Não precisa redimensionar, retorna a imagem original
            with open(image_path, 'rb') as f:
                return f.read()

        # Calcula novas dimensões mantendo proporção
        if width > height:
            new_width = max_dimension
            new_height = int((max_dimension / width) * height)
        else:
            new_height = max_dimension
            new_width = int((max_dimension / height) * width)

        # Redimensiona
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Converte para bytes
        buffer = io.BytesIO()
        # Salva no formato original se possível
        img_format = img.format or 'JPEG'
        img_resized.save(buffer, format=img_format, quality=90)

        print(f"  ✓ Redimensionada de {width}x{height} para {new_width}x{new_height}")

        return buffer.getvalue()

def image_to_base64(image_bytes):
    """Converte bytes da imagem para base64"""
    return base64.b64encode(image_bytes).decode('utf-8')

def get_media_type(file_path):
    """Retorna o media type baseado na extensão"""
    ext = file_path.suffix.lower()
    media_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    return media_types.get(ext, 'image/jpeg')

def collect_images(folders, limit=None):
    """Coleta todas as imagens das pastas especificadas"""
    images = []

    for folder in folders:
        folder_path = Path(folder)
        if not folder_path.exists():
            print(f"⚠️  Pasta não encontrada: {folder}")
            continue

        print(f"\n📁 Processando pasta: {folder}")

        # Busca imagens nas extensões suportadas
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp']:
            for img_path in folder_path.glob(ext):
                if limit and len(images) >= limit:
                    break

                try:
                    width, height = get_image_dimensions(img_path)
                    needs_resize = width > MAX_DIMENSION or height > MAX_DIMENSION

                    print(f"  {img_path.name} ({width}x{height})", end="")
                    if needs_resize:
                        print(" → Precisa redimensionar")
                    else:
                        print(" → OK")

                    images.append(img_path)

                except Exception as e:
                    print(f"  ✗ Erro ao processar {img_path.name}: {e}")

        if limit and len(images) >= limit:
            break

    return images

def process_images_for_api(image_paths):
    """Processa imagens e retorna lista pronta para a API"""
    processed_images = []

    print(f"\n🔄 Processando {len(image_paths)} imagens para a API...")

    for img_path in image_paths:
        try:
            # Redimensiona se necessário
            image_bytes = resize_image_if_needed(img_path)

            # Converte para base64
            image_base64 = image_to_base64(image_bytes)

            # Prepara objeto para a API
            processed_images.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": get_media_type(img_path),
                    "data": image_base64
                }
            })

        except Exception as e:
            print(f"  ✗ Erro ao processar {img_path.name}: {e}")

    print(f"✓ {len(processed_images)} imagens processadas com sucesso")
    return processed_images

def analyze_images_with_claude(processed_images, prompt="Descreva estas imagens de produtos de forma detalhada."):
    """Envia imagens processadas para a API do Claude"""

    if not ANTHROPIC_API_KEY:
        print("❌ ANTHROPIC_API_KEY não encontrada nas variáveis de ambiente")
        print("   Configure com: export ANTHROPIC_API_KEY='sua-chave'")
        return None

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Constrói a mensagem com o prompt seguido das imagens
    content = [{"type": "text", "text": prompt}] + processed_images

    print(f"\n🤖 Enviando {len(processed_images)} imagens para Claude...")

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": content
                }
            ]
        )

        print("✓ Resposta recebida com sucesso!")
        return message.content[0].text

    except Exception as e:
        print(f"❌ Erro na API: {e}")
        return None

def main():
    """Função principal"""
    print("="*60)
    print("🖼️  PROCESSADOR DE IMAGENS PARA CLAUDE API")
    print("="*60)
    print(f"Limite máximo por dimensão: {MAX_DIMENSION}px")

    # Coleta imagens (limitando a 5 para teste)
    image_paths = collect_images(IMAGE_FOLDERS, limit=5)

    if not image_paths:
        print("\n❌ Nenhuma imagem encontrada!")
        return

    print(f"\n📊 Total de imagens coletadas: {len(image_paths)}")

    # Processa imagens
    processed_images = process_images_for_api(image_paths)

    if not processed_images:
        print("\n❌ Nenhuma imagem foi processada com sucesso!")
        return

    # Pergunta ao usuário se deseja enviar para a API
    print("\n" + "="*60)
    response = input("Deseja enviar estas imagens para a API do Claude? (s/n): ")

    if response.lower() in ['s', 'sim', 'y', 'yes']:
        # Prompt personalizado
        prompt = input("\nDigite o prompt para análise (ou Enter para o padrão): ").strip()
        if not prompt:
            prompt = "Analise estas imagens de produtos de jerseys de futebol. Para cada imagem, descreva: 1) Qual time/seleção, 2) Cor predominante, 3) Características visuais únicas, 4) Sugestão de nome/categoria para e-commerce."

        result = analyze_images_with_claude(processed_images, prompt)

        if result:
            print("\n" + "="*60)
            print("📝 RESPOSTA DO CLAUDE:")
            print("="*60)
            print(result)

            # Salva resultado
            with open("claude_analysis_result.txt", "w", encoding="utf-8") as f:
                f.write(result)
            print("\n✓ Resultado salvo em: claude_analysis_result.txt")
    else:
        print("\n✓ Imagens processadas e prontas. API não foi chamada.")

    print("\n" + "="*60)
    print("✨ Processamento concluído!")
    print("="*60)

if __name__ == "__main__":
    main()
