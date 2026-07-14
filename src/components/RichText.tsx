import React from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utils/cn'

/** Рендер richText (lexical) из Payload с нашими типографскими стилями. */
export function RichText({ data, className }: { data?: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText data={data as never} className={cn('rich-text', className)} />
}
