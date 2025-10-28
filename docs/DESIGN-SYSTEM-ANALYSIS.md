# 🎨 Análise do Design System - Correções Necessárias

## ❌ PROBLEMAS IDENTIFICADOS

### 1. **COR PRINCIPAL ERRADA** (CRÍTICO)
- **Usei**: `#D4FF00`
- **Correto**: `#DAF10D`
- **Impacto**: TODAS as 7 páginas têm a cor amarela errada

### 2. **Glassmorphism Diferente**
- **Usei**:
  ```css
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(8px);
  ```
- **Correto**:
  ```css
  background: rgba(255, 255, 255, 0.05); /* bg-white/5 */
  backdrop-filter: blur(0.25rem); /* backdrop-blur-sm */
  ```

### 3. **Borders Inconsistentes**
- **Usei**: `border: 1px solid rgba(255, 255, 255, 0.1)`
- **Correto Cards Normais**: `border: 1px solid rgba(255, 255, 255, 0.1)` ✅
- **Correto Achievement Cards**: `border: 2px solid rgba(218, 241, 13, 0.3)` (border-2 border-brand-yellow/30)

### 4. **Gradientes em Cards Especiais**
- **Usei**: Glassmorphism para todos os cards
- **Correto para Achievements/Destaque**:
  ```css
  background: linear-gradient(to bottom right, rgba(218, 241, 13, 0.1) 0%, rgba(218, 241, 13, 0.05) 100%);
  /* bg-gradient-to-br from-brand-yellow/10 to-brand-yellow/5 */
  border: 2px solid rgba(218, 241, 13, 0.3);
  ```

### 5. **Botões CTA**
- **Usei**:
  ```css
  background: #D4FF00; /* COR ERRADA */
  box-shadow: 0 10px 30px rgba(212, 255, 0, 0.2);
  ```
- **Correto**:
  ```css
  background: #DAF10D; /* brand-yellow */
  box-shadow: 0 10px 15px -3px rgba(218, 241, 13, 0.2); /* shadow-lg shadow-brand-yellow/20 */
  ```
- **Hover**:
  ```css
  transform: scale(1.05); /* hover:scale-105 */
  transition: all 0.3s;
  ```

### 6. **Tipografia**
- **Font Weight**: ✅ Correto (usando 900 para títulos)
- **Tracking**: ❌ Falta `letter-spacing: 0.025em` (tracking-wider) em alguns títulos uppercase

### 7. **Animações e Transições**
- **Usei**: `transition: all 0.3s ease`
- **Correto**: `transition-all duration-300` (equivalente)
- **Hover em Cards**: Falta `hover:border-brand-yellow/30` em TODOS os cards

### 8. **Text Colors**
- **Text Secondary**: ✅ `rgba(255, 255, 255, 0.8)` (text-white/80)
- **Text Tertiary**: ✅ `rgba(255, 255, 255, 0.7)` (text-white/70)
- **Text Muted**: ✅ `rgba(255, 255, 255, 0.4)` (text-white/40)

---

## ✅ SOLUÇÕES POR PÁGINA

### TODAS AS 7 PÁGINAS:

1. **Substituir TODAS as ocorrências de `#D4FF00` por `#DAF10D`**
2. **Simplificar glassmorphism**:
   ```css
   /* DE */
   background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
   backdrop-filter: blur(8px);

   /* PARA */
   background: rgba(255, 255, 255, 0.05);
   backdrop-filter: blur(0.25rem);
   ```

3. **Adicionar hover effects em TODOS os cards**:
   ```css
   .card {
     transition: all 0.3s;
   }
   .card:hover {
     border-color: rgba(218, 241, 13, 0.3);
     transform: translateY(-2px);
   }
   ```

4. **Corrigir botões CTA**:
   ```css
   .btn-cta {
     background: #DAF10D;
     color: #000;
     box-shadow: 0 10px 15px -3px rgba(218, 241, 13, 0.2);
     transition: all 0.3s;
   }
   .btn-cta:hover {
     background: #e5ff33; /* slightly lighter */
     transform: scale(1.05);
   }
   ```

---

## 📋 PÁGINAS AFETADAS

1. ✅ FAQ - faq-page.liquid
2. ✅ Guia de Talles - guia-talles-page.liquid
3. ✅ Política de Cambios - politica-cambios-page.liquid
4. ✅ Privacidade - privacidade-page.liquid
5. ✅ Plazos de Entrega - plazos-entrega-page.liquid
6. ✅ Seguimiento - seguimiento-page.liquid
7. ✅ Careers - careers-page.liquid

---

## 🎯 PRIORIDADES DE CORREÇÃO

### P0 - CRÍTICO (Fazer AGORA):
- [ ] Cor principal: `#D4FF00` → `#DAF10D` em TODAS as páginas
- [ ] Shadow dos botões CTA: usar `rgba(218, 241, 13, 0.2)`

### P1 - IMPORTANTE:
- [ ] Glassmorphism: simplificar backgrounds
- [ ] Hover effects: adicionar `hover:border-brand-yellow/30` em cards
- [ ] Botões: adicionar `hover:scale-105`

### P2 - NICE TO HAVE:
- [ ] Cards especiais (achievements): usar gradiente `bg-gradient-to-br`
- [ ] Letter-spacing em títulos uppercase

---

## 🔍 EXEMPLO: FAQ Page Correto

```css
/* ANTES (ERRADO) */
.faq-page__question-btn {
  background: #D4FF00; /* ❌ */
  box-shadow: 0 10px 30px rgba(212, 255, 0, 0.2); /* ❌ */
}

.faq-page__card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%); /* ❌ Muito complexo */
  backdrop-filter: blur(8px); /* ❌ */
}

/* DEPOIS (CORRETO) */
.faq-page__question-btn {
  background: #DAF10D; /* ✅ */
  box-shadow: 0 10px 15px -3px rgba(218, 241, 13, 0.2); /* ✅ */
}

.faq-page__card {
  background: rgba(255, 255, 255, 0.05); /* ✅ Simples */
  backdrop-filter: blur(0.25rem); /* ✅ */
  transition: all 0.3s;
}

.faq-page__card:hover {
  border-color: rgba(218, 241, 13, 0.3); /* ✅ Novo */
}
```

---

## 📊 IMPACTO

- **7 páginas** precisam de correção
- **~150+ ocorrências** de `#D4FF00` para substituir
- **~70+ cards** precisam de hover effects
- **~20+ botões** precisam de correção de shadow

**Tempo estimado de correção**: 30-45 minutos para todas as páginas
