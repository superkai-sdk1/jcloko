'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Img } from '@/components/ui/Img'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { mediaUrl, mediaAlt } from '@/lib/media'
import { cn } from '@/utils/cn'

type HeroVideo =
  | { webmFilename?: string | null; posterFilename?: string | null; status?: string }
  | number
  | null
  | undefined

export type HeroSlide = {
  image?: unknown
  video?: HeroVideo
  heading?: string | null
  subheading?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}

function videoAssets(v: HeroVideo): { src: string | null; poster: string | null } {
  if (!v || typeof v !== 'object') return { src: null, poster: null }
  const o = v as { webmFilename?: string | null; posterFilename?: string | null; status?: string }
  const poster = o.posterFilename ? `/video-assets/${o.posterFilename}` : null
  const src = o.status === 'ready' && o.webmFilename ? `/video-assets/${o.webmFilename}` : null
  return { src, poster }
}

export function HeroSlider({
  slides,
  adaptContrast = true,
  slideDurationSec = 6,
}: {
  slides: HeroSlide[]
  adaptContrast?: boolean
  slideDurationSec?: number
}) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [lum, setLum] = useState(0.15)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const count = slides.length
  const slide = slides[i]
  const { src: vsrc, poster } = videoAssets(slide?.video)
  const isVideo = Boolean(vsrc) && !reduce
  const img = mediaUrl(slide?.image) || poster

  // Автосмена слайдов
  useEffect(() => {
    if (reduce || count <= 1) return
    const t = setInterval(() => setI((v) => (v + 1) % count), Math.max(3, slideDurationSec) * 1000)
    return () => clearInterval(t)
  }, [reduce, count, slideDurationSec])

  // Реалтайм-сэмплинг цвета видео в области текста (нижний левый угол)
  useEffect(() => {
    if (!adaptContrast || !isVideo) {
      setLum(0.15)
      return
    }
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    let stop = false
    canvas.width = 32
    canvas.height = 18
    const sample = () => {
      if (stop || video.readyState < 2) return
      try {
        ctx.drawImage(video, 0, 0, 32, 18)
        const { data } = ctx.getImageData(0, 8, 24, 10) // область под текстом
        let sum = 0
        let n = 0
        for (let p = 0; p < data.length; p += 4) {
          sum += (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255
          n++
        }
        if (n) setLum((prev) => prev * 0.6 + (sum / n) * 0.4) // сглаживание
      } catch {
        /* CORS/недоступно — игнорируем */
      }
    }
    const id = setInterval(sample, 350)
    return () => {
      stop = true
      clearInterval(id)
    }
  }, [adaptContrast, isVideo, i])

  if (count === 0) return null

  const adapting = isVideo && adaptContrast
  const bright = lum > 0.5
  const textColor = adapting ? (bright ? '#0e1b14' : '#f2f5f1') : '#f2f5f1'
  const subColor = adapting ? (bright ? 'rgba(14,27,20,0.85)' : 'rgba(242,245,241,0.85)') : 'rgba(242,245,241,0.85)'
  // Подложка противоположного тона, сила — по «серости» (mid-tона хуже читаются)
  const scrimStrength = adapting ? 0.35 + (1 - Math.abs(lum - 0.5) * 2) * 0.3 : 0
  const scrim = adapting
    ? bright
      ? `rgba(242,245,241,${scrimStrength.toFixed(2)})`
      : `rgba(14,27,20,${scrimStrength.toFixed(2)})`
    : 'transparent'

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink">
      {/* Фон: видео или картинка */}
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            ref={videoRef}
            key={vsrc}
            className="h-full w-full object-cover"
            src={vsrc ?? undefined}
            poster={poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : img ? (
          <Img
            src={img}
            alt={mediaAlt(slide.image, slide.heading ?? 'Дзюдо Локомотив')}
            fill
            priority={i === 0}
            className="object-cover"
          />
        ) : (
          <div className="relative h-full w-full bg-ink-800 bg-tatami">
            <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[120px]" />
          </div>
        )}
      </div>

      {/* Базовые градиенты (когда адаптация выключена/картинка) */}
      {!adapting && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" aria-hidden />
        </>
      )}
      {/* Адаптивная подложка под текст */}
      {adapting && (
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{ background: `linear-gradient(to right, ${scrim}, transparent 70%)` }}
          aria-hidden
        />
      )}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-primary to-transparent" aria-hidden />

      {/* Скрытый canvas для сэмплинга */}
      <canvas ref={canvasRef} className="hidden" aria-hidden />

      {/* Контент */}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-6 lg:px-8">
        <motion.div
          key={`text-${i}`}
          initial={{ opacity: 0, y: reduce ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
          style={{ color: textColor }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary-400">
            Клуб дзюдо
          </span>
          {slide.heading && (
            <h1 className="mt-5 text-4xl font-bold uppercase leading-[1.02] sm:text-6xl lg:text-7xl" style={{ color: textColor }}>
              {slide.heading}
            </h1>
          )}
          {slide.subheading && (
            <p className="mt-5 max-w-xl text-lg" style={{ color: subColor }}>
              {slide.subheading}
            </p>
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
