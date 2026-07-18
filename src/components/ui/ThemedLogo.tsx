import React from 'react'
import { cn } from '@/utils/cn'

/**
 * Логотип с учётом темы: если задана вторая версия (`light` — для светлой темы),
 * рендерятся обе картинки, а показ переключается CSS-классами .only-dark /
 * .only-light в зависимости от активной темы. Если второй версии нет — обычный img.
 */
export function ThemedLogo({
  dark,
  light,
  alt,
  className,
}: {
  dark: string
  light?: string | null
  alt: string
  className?: string
}) {
  if (!light || light === dark) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={dark} alt={alt} className={className} />
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark} alt={alt} className={cn(className, 'only-dark')} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={light} alt={alt} className={cn(className, 'only-light')} />
    </>
  )
}
