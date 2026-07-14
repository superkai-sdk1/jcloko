'use client'

import React from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/** Тонкая полоса прогресса чтения страницы вверху экрана. */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  if (reduce) return null

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-primary-400 to-accent"
      aria-hidden
    />
  )
}
