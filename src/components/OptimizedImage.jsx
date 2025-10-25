import Image from 'next/image'

export default function OptimizedImage({
  src,
  alt,
  priority = false,
  quality = 85,
  sizes,
  className,
  fill,
  width,
  height,
  ...props
}) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      quality={quality}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes || (fill ? '100vw' : undefined)}
      className={className}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
      {...props}
    />
  )
}
