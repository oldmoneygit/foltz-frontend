# Processador de Imagens para Claude API

Este script processa imagens automaticamente para evitar erros de dimensões muito grandes ao enviar para a API do Claude.

## Problema Resolvido

A API do Claude tem um limite de **2000 pixels** por dimensão quando se envia múltiplas imagens (many-image requests). Este script:

✅ Detecta imagens que excedem esse limite
✅ Redimensiona automaticamente mantendo a proporção
✅ Converte para base64 no formato correto
✅ Envia para a API sem erros

## Instalação

```bash
# 1. Instalar dependências Python
pip install -r requirements.txt

# 2. Configurar a chave da API
# Windows (PowerShell):
$env:ANTHROPIC_API_KEY="sua-chave-aqui"

# Windows (CMD):
set ANTHROPIC_API_KEY=sua-chave-aqui

# Linux/Mac:
export ANTHROPIC_API_KEY="sua-chave-aqui"
```

## Uso

```bash
# Processar imagens das pastas seedream e id_visual
python process_images_claude.py
```

## Fluxo do Script

1. **Coleta imagens** das pastas `seedream/` e `id_visual/`
2. **Verifica dimensões** de cada imagem
3. **Redimensiona automaticamente** se exceder 2000px
4. **Converte para base64** no formato correto
5. **Pergunta se deseja enviar** para a API
6. **Envia para Claude** e salva o resultado

## Exemplo de Saída

```
============================================================
🖼️  PROCESSADOR DE IMAGENS PARA CLAUDE API
============================================================
Limite máximo por dimensão: 2000px

📁 Processando pasta: seedream
  replicate-prediction-xxx.jpg (1831x2048) → Precisa redimensionar
  ✓ Redimensionada de 1831x2048 para 1789x2000
  replicate-prediction-yyy.jpg (1500x1800) → OK
  ...

📊 Total de imagens coletadas: 5

🔄 Processando 5 imagens para a API...
✓ 5 imagens processadas com sucesso

============================================================
Deseja enviar estas imagens para a API do Claude? (s/n): s

Digite o prompt para análise (ou Enter para o padrão):

🤖 Enviando 5 imagens para Claude...
✓ Resposta recebida com sucesso!

============================================================
📝 RESPOSTA DO CLAUDE:
============================================================
[Análise das imagens...]

✓ Resultado salvo em: claude_analysis_result.txt
```

## Configurações

No arquivo `process_images_claude.py`, você pode ajustar:

```python
MAX_DIMENSION = 2000  # Limite da API (não alterar)
IMAGE_FOLDERS = ["seedream", "id_visual"]  # Pastas a processar
```

## Limitando Imagens para Teste

Por padrão, o script processa apenas **5 imagens** para teste. Para processar todas:

```python
# Na linha 188, remova o parâmetro limit:
image_paths = collect_images(IMAGE_FOLDERS)  # Sem limite
```

## Erros Comuns

### ❌ API Error 400: image dimensions exceed max allowed size

**Causa:** Imagem com dimensões > 2000px
**Solução:** Use este script - ele redimensiona automaticamente

### ❌ ANTHROPIC_API_KEY não encontrada

**Causa:** Variável de ambiente não configurada
**Solução:** Execute o comando de configuração acima

### ❌ ModuleNotFoundError: No module named 'anthropic'

**Causa:** Dependências não instaladas
**Solução:** `pip install -r requirements.txt`

## Prompts Sugeridos

### Para análise de produtos:
```
Analise estas imagens de produtos de jerseys de futebol.
Para cada imagem, descreva:
1) Qual time/seleção
2) Cor predominante
3) Características visuais únicas
4) Sugestão de nome/categoria para e-commerce
```

### Para geração de descrições:
```
Gere descrições detalhadas de produtos para e-commerce
baseadas nestas imagens de jerseys. Inclua cores, estilo,
características especiais e sugestões de palavras-chave para SEO.
```

### Para categorização:
```
Categorize estas imagens de jerseys de futebol por:
- País/Liga
- Tipo (seleção/clube)
- Temporada (clássico/moderno)
- Estilo (home/away/third)
```

## Recursos Adicionais

- [Documentação Claude API](https://docs.anthropic.com/claude/reference/messages_post)
- [Vision Guide](https://docs.anthropic.com/claude/docs/vision)
- [Best Practices](https://docs.anthropic.com/claude/docs/vision#best-practices-for-image-input)

## Histórico de Versões

- **v1.0** (2025-10-24): Versão inicial com redimensionamento automático
