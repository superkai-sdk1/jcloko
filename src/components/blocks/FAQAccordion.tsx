'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { RichText } from '@/components/RichText'

type Item = { question?: string | null; answer?: unknown }

export function FAQAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-xl border border-line bg-surface">
      {items.map((it, idx) => {
        const isOpen = open === idx
        return (
          <div key={idx}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-display text-lg font-medium text-paper">{it.question}</span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-primary-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-45' : ''
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: reduce ? 'auto' : 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: reduce ? 'auto' : 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <RichText data={it.answer} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
