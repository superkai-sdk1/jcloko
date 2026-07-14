'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { cn } from '@/utils/cn'

export type HeroSlide = {
  image?: unknown
  heading?: string | null
  subheading?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const count = slides.length

  useEffect(() => {
    if (reduce || count <= 1) return
    const t = setInterval(() => setI((v) => (v + 1) % count), 6000)
    return () => clearInterval(t)
  }, [reduce, count])

  if (count === 0) return null
  const slide = slides[i]
  const img = mediaUrl(slide.image)

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink">
      {/* Фон-слайд */}
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.2 : 1.1, ease: 'easeOut' }}
        >
          {img ? (
            <Image
              src={img}
              alt={mediaAlt(slide.image, slide.heading ?? 'Дзюдо Локомотив')}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-tatami bg-ink-800" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Затемнение для читаемости */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 to-transparent" aria-hidden />

      {/* Контент */}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 lg:px-8">
        <motion.div
          key={`text-${i}`}
          initial={{ opacity: 0, y: reduce ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary-400">
            Клуб дзюдо
          </span>
          {slide.heading && (
            <h1 className="mt-5 text-4xl font-bold uppercase leading-[1.02] text-paper sm:text-6xl lg:text-7xl">
              {slide.heading}
            </h1>
          )}
          {slide.subheading && (
            <p className="mt-5 max-w-xl text-lg text-paper/85">{slide.subheading}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {slide.ctaLabel && (
              <Button href={slide.ctaUrl || '/kontakty'} variant="accent" size="lg">
                {slide.ctaLabel}
              </Button>
            )}
            <Button href="/raspisanie" variant="outline" size="lg">
              Расписание
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Индикаторы */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Слайд ${idx + 1}`}
              onClick={() => setI(idx)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                idx === i ? 'w-8 bg-accent' : 'w-2 bg-paper/40 hover:bg-paper/70',
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
