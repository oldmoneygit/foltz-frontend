# 🚀 Deploy Vercel - Correção Imagens das Ligas

## ⚠️ PROBLEMA IDENTIFICADO

As imagens das ligas não aparecem no site em produção porque existem **arquivos duplicados** com nomes diferentes:

**❌ Arquivos ANTIGOS (causam erro 400):**
- `la liga.jpg` (com espaços)
- `Ligue 1.jpg` (com espaços e maiúsculas)
- `premier league.jpg` (com espaços)
- `bundesliga.jpg` (sem hífen)
- `serie A.jpg` (com espaços)
- `national teams.jpg` (com espaços)

**✅ Arquivos CORRETOS (já commitados):**
- `la-liga.jpeg` (com hífens)
- `ligue-1.jpeg` (com hífens)
- `premier-league.jpeg` (com hífens)
- `bundesliga.jpeg` (com hífen)
- `serie-a.jpeg` (com hífens)
- `national-teams.jpeg` (com hífens)

## ✅ SOLUÇÃO IMPLEMENTADA

1. **Removidos** localmente os arquivos .jpg com espaços
2. **Mantidos** apenas os arquivos .jpeg com hífens
3. **Código atualizado** para usar apenas arquivos com hífens

## 🔧 COMO FAZER DEPLOY NO VERCEL

### Opção 1: Redeploy Automático (RECOMENDADO)

1. Acesse **Vercel Dashboard**: https://vercel.com/dashboard
2. Entre no projeto **foltz-frontend**
3. Vá em **Deployments**
4. Clique nos **3 pontinhos** no último deployment
5. Selecione **"Redeploy"**
6. ✅ **IMPORTANTE**: Marque a opção **"Use existing Build Cache"** como **DESMARCADA** (para limpar cache)
7. Clique em **"Redeploy"**

### Opção 2: Push para Trigger Novo Deploy

```bash
# Fazer qualquer pequena mudança e push
git commit --allow-empty -m "chore: trigger redeploy for league images"
git push
```

### Opção 3: Limpar Cache Manualmente

1. Vá em **Project Settings** > **General**
2. Role até **Build & Development Settings**
3. Clique em **"Clear Build Cache"**
4. Depois faça redeploy

## 📝 VERIFICAÇÃO

Após o deploy, acesse:
- https://www.foltzoficial.com/

E verifique se as **imagens das ligas** aparecem corretamente na seção:
**"Las mejores ligas de fútbol del mundo"**

## ✅ RESULTADO ESPERADO

Todas as 12 ligas devem exibir suas imagens:
- ✅ Premier League
- ✅ La Liga
- ✅ Serie A
- ✅ Ligue 1
- ✅ Bundesliga
- ✅ Eredivisie
- ✅ Primeira Liga
- ✅ Liga MX
- ✅ MLS
- ✅ Sul-Americana
- ✅ Brasileirão
- ✅ National Teams

## 🐛 SE AINDA NÃO FUNCIONAR

1. Abra o **Console do navegador** (F12)
2. Vá em **Network** > **Img**
3. Recarregue a página
4. Verifique se os URLs das imagens estão:
   - ✅ `/images/leagues/premier-league.jpeg` (CORRETO)
   - ❌ `/images/leagues/premier league.jpg` (ERRADO)

Se ainda estiver usando os URLs errados, significa que o cache do Vercel não foi limpo. Nesse caso:

1. Delete o projeto no Vercel
2. Reimporte do GitHub
3. Configure novamente as variáveis de ambiente
4. Deploy

---

**Última atualização:** 30/10/2024
**Build testado:** ✅ 273 páginas compiladas com sucesso
**Commit:** `0557d39` - fix: Exibir imagens reais das ligas
