import React from 'react'
import { cn } from '@/utils/cn'

type ImgProps = {
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
  className?: string
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

/**
 * Обычный <img> (не next/image). Картинки Payload уже конвертированы в WebP в
 * нужных размерах, а прямой URL (/api/media/file/...) надёжнее оптимизатора
 * next/image для наших SVG/webp и не кэшируется как «битый».
 */
export function Img({ src, alt, fill, priority, className, ...rest }: ImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn(fill && 'absolute inset-0 h-full w-full object-cover', className)}
      {...rest}
    />
  )
}
