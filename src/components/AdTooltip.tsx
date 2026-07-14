import React from 'react'
import { cn } from '@/utils/cn'

/**
 * Обёртка с всплывающей подсказкой (наведение/фокус): показывает метку «Реклама»,
 * рекламодателя и erid (38-ФЗ). Чистый CSS group-hover — работает и в server, и в
 * client-компонентах. Если данных нет — просто отдаёт children.
 */
export function AdTooltip({
  title,
  erid,
  advertiser,
  children,
  className,
  align = 'center',
}: {
  title?: string | null
  erid?: string | null
  advertiser?: string | null
  children: React.ReactNode
  className?: string
  align?: 'center' | 'right'
}) {
  const hasContent = Boolean(title || erid || advertiser)
  if (!hasContent) return <>{children}</>

  return (
    <span className={cn('group/ad relative inline-flex', className)}>
      {children}
      <span
        className={cn(
          'pointer-events-none absolute top-full z-50 mt-2 w-max max-w-[16rem] rounded-lg border border-line bg-ink-800 px-3 py-2 text-left text-xs leading-relaxed text-paper opacity-0 shadow-xl transition-opacity duration-150 group-hover/ad:opacity-100 group-focus-within/ad:opacity-100',
          align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2',
        )}
        role="tooltip"
      >
        {title && <span className="block font-semibold text-paper">{title}</span>}
        {erid && (
          <span className="mt-0.5 block font-semibold uppercase tracking-wide text-primary-400">
            Реклама
          </span>
        )}
        {advertiser && <span className="mt-0.5 block text-muted">{advertiser}</span>}
        {erid && <span className="mt-0.5 block text-muted">erid: {erid}</span>}
      </span>
    </span>
  )
}
