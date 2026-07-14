'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Variant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

const build = (v: Variant, y: number) => {
  switch (v) {
    case 'down':
      return { initial: { opacity: 0, y: -y }, animate: { opacity: 1, y: 0 } }
    case 'left':
      return { initial: { opacity: 0, x: -48 }, animate: { opacity: 1, x: 0 } }
    case 'right':
      return { initial: { opacity: 0, x: 48 }, animate: { opacity: 1, x: 0 } }
    case 'scale':
      return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } }
    case 'fade':
      return { initial: { opacity: 0 }, animate: { opacity: 1 } }
    default:
      return { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } }
  }
}

/**
 * Появление при скролле. Анимируем только opacity/transform (GPU-композит).
 * При prefers-reduced-motion — без анимации.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  variant = 'up',
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  variant?: Variant
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  const { initial, animate } = build(variant, y)
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
