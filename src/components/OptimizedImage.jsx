'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

/**
 * OptimizedImage Component
 * Wrapper para Next.js Image com otimizações avançadas e tratamento de erros
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} fallback - Fallback image URL
 * @param {string} className - CSS classes
 * @param {boolean} priority - Load image with high priority (above fold)
 * @param {string} sizes - Sizes attribute for responsive images
 * @param {number} quality - Image quality (1-100)
 * @param {string} placeholder - 'blur' | 'empty'
 * @param {string} blurDataURL - Base64 blur placeholder
 * @param {function} onError - Error callback
 * @param {boolean} fill - Fill parent container
 * @param {number} width - Image width (when not fill)
 * @param {number} height - Image height (when not fill)
 */
export default function OptimizedImage({
  src,
  alt,
  fallback,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onError,
  containerClassName = '',
  showLoadingSpinner = true,
  fill,
  width,
  height,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Default blur placeholder (dark gray)
  const defaultBlurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxODE4MTgiLz48L3N2Zz4='

  useEffect(() => {
    // Reset quando src muda
    setImgSrc(src || fallback)
    setHasError(false)
    setIsLoading(true)
  }, [src, fallback])

  // Se não há src, mostrar placeholder imediatamente
  if (!src && !fallback) {
    return (
      <div className={`${containerClassName || className} bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center`} style={props.style}>
        <div className="text-center p-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-40">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"/>
          </svg>
          <p className="text-white/40 text-xs font-semibold">Imagen no disponible</p>
        </div>
      </div>
    )
  }

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setIsLoading(false)
      // Tentar usar fallback se fornecido
      if (fallback && imgSrc !== fallback) {
        setImgSrc(fallback)
        setHasError(false) // Reset para tentar fallback
        setIsLoading(true)
      }
      // Chamar callback de erro se fornecido
      if (onError) {
        onError()
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Se há erro e não há fallback, mostrar placeholder visual
  if (hasError && (!fallback || imgSrc === fallback)) {
    return (
      <div className={`${containerClassName || className} bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center`} style={props.style}>
        <div className="text-center p-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-40">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"/>
          </svg>
          <p className="text-white/40 text-xs font-semibold">Imagen no disponible</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && !priority && showLoadingSpinner && (
        <div className={`absolute inset-0 bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center z-0`} style={props.style}>
          <div className="animate-pulse">
            <div className="w-16 h-16 border-4 border-white/10 border-t-white/30 rounded-full"></div>
          </div>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt || 'Image'}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes || (fill ? '100vw' : undefined)}
        quality={quality}
        placeholder={blurDataURL || placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        unoptimized={hasError} // Desabilitar otimização quando há erro para permitir fallback
        {...props}
      />
    </>
  )
}
