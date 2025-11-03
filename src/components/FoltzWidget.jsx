'use client'

import { useEffect } from 'react'

/**
 * FOLTZ AI Chat Widget
 * Widget de chat flutuante integrado ao bot SNKHOUSE
 */
export default function FoltzWidget() {
  useEffect(() => {
    // URL do widget embed
    const WIDGET_URL = 'https://snkhouse-bot-foltz-widget.vercel.app/embed'

    // Criar overlay para fechar ao clicar fora
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(2px);
    `
    overlay.id = 'foltz-widget-overlay'

    // Criar container do widget (para animações)
    const widgetContainer = document.createElement('div')
    widgetContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: none;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `
    widgetContainer.id = 'foltz-widget-container-animated'

    // Criar iframe
    const iframe = document.createElement('iframe')
    iframe.src = WIDGET_URL
    iframe.style.cssText = `
      width: 400px;
      height: 600px;
      border: none;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: block;
    `
    iframe.id = 'foltz-widget-iframe'
    iframe.allow = 'clipboard-write'

    // Botão de fechar dentro do widget
    const closeButton = document.createElement('button')
    closeButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `
    closeButton.setAttribute('aria-label', 'Cerrar chat')
    closeButton.style.cssText = `
      position: absolute;
      top: -12px;
      right: -12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #1A1A1A;
      color: #DAF10D;
      border: 2px solid #DAF10D;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      z-index: 10000;
    `
    closeButton.id = 'foltz-widget-close'

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.transform = 'rotate(90deg) scale(1.1)'
      closeButton.style.background = '#DAF10D'
      closeButton.style.color = '#1A1A1A'
    })

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.transform = 'rotate(0deg) scale(1)'
      closeButton.style.background = '#1A1A1A'
      closeButton.style.color = '#DAF10D'
    })

    // Criar botão flutuante com ícone SVG customizado
    const button = document.createElement('button')
    button.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      <span class="foltz-widget-pulse"></span>
    `
    button.setAttribute('aria-label', 'Abrir chat de soporte')
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #DAF10D 0%, #C5D60B 100%);
      color: #1A1A1A;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(218, 241, 13, 0.4);
      z-index: 9998;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    `
    button.id = 'foltz-widget-button'

    // Adicionar CSS para pulse animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes foltz-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.3);
          opacity: 0;
        }
      }

      #foltz-widget-button {
        position: relative;
      }

      .foltz-widget-pulse {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(218, 241, 13, 0.6);
        animation: foltz-pulse 2s ease-in-out infinite;
        z-index: -1;
      }

      #foltz-widget-button:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 6px 24px rgba(218, 241, 13, 0.6);
      }

      #foltz-widget-button:active {
        transform: scale(0.95);
      }

      @media (max-width: 768px) {
        #foltz-widget-button {
          width: 56px;
          height: 56px;
          bottom: 16px;
          right: 16px;
        }

        #foltz-widget-button svg {
          width: 28px;
          height: 28px;
        }
      }
    `
    document.head.appendChild(style)

    // Função para abrir widget
    function openWidget() {
      overlay.style.display = 'block'
      widgetContainer.style.display = 'block'
      button.style.display = 'none'

      // Trigger animation
      requestAnimationFrame(() => {
        overlay.style.opacity = '1'
        widgetContainer.style.opacity = '1'
        widgetContainer.style.transform = 'translateY(0) scale(1)'
      })
    }

    // Função para fechar widget
    function closeWidget() {
      overlay.style.opacity = '0'
      widgetContainer.style.opacity = '0'
      widgetContainer.style.transform = 'translateY(20px) scale(0.95)'

      setTimeout(() => {
        overlay.style.display = 'none'
        widgetContainer.style.display = 'none'
        button.style.display = 'flex'
      }, 300)
    }

    // Event listeners
    button.addEventListener('click', openWidget)
    closeButton.addEventListener('click', closeWidget)
    overlay.addEventListener('click', closeWidget)

    // Prevenir que cliques no widget fechem o overlay
    widgetContainer.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    // Montar estrutura
    widgetContainer.appendChild(closeButton)
    widgetContainer.appendChild(iframe)
    document.body.appendChild(overlay)
    document.body.appendChild(widgetContainer)
    document.body.appendChild(button)

    // Listener para mensagens do widget
    const handleMessage = (event) => {
      if (event.origin.includes('snkhouse-bot-foltz-widget.vercel.app')) {
        if (event.data.type === 'CLOSE_WIDGET') {
          closeWidget()
        }
      }
    }
    window.addEventListener('message', handleMessage)

    // Responsividade mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        iframe.style.width = 'calc(100vw - 32px)'
        iframe.style.height = 'calc(100vh - 32px)'
        iframe.style.borderRadius = '12px'
        widgetContainer.style.bottom = '16px'
        widgetContainer.style.right = '16px'
        widgetContainer.style.left = '16px'
      } else {
        iframe.style.width = '400px'
        iframe.style.height = '600px'
        iframe.style.borderRadius = '16px'
        widgetContainer.style.bottom = '20px'
        widgetContainer.style.right = '20px'
        widgetContainer.style.left = 'auto'
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // ESC key para fechar
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && widgetContainer.style.display === 'block') {
        closeWidget()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup ao desmontar
    return () => {
      // Verificar se elementos existem antes de remover
      if (overlay && overlay.parentNode === document.body) {
        document.body.removeChild(overlay)
      }
      if (widgetContainer && widgetContainer.parentNode === document.body) {
        document.body.removeChild(widgetContainer)
      }
      if (button && button.parentNode === document.body) {
        document.body.removeChild(button)
      }
      if (style && style.parentNode === document.head) {
        document.head.removeChild(style)
      }
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
