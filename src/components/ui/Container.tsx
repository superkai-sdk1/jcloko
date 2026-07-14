import React from 'react'
import { cn } from '@/utils/cn'

export function Container({
  className,
  children,
  as: Tag = 'div',
}: {
  className?: string
  children: React.ReactNode
  as?: React.ElementType
}) {
  return (
    <Tag className={cn('mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  )
}
