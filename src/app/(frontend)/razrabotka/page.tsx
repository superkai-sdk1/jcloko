import React from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Разработка сайта — Titan Development Team',
  description:
    'Сайт разработан командой Titan Development Team. Заказать сайт, телеграм-бота, дизайн и любые IT-продукты — @thiskai.',
}

const TG = 'https://t.me/thiskai'

const services = [
  { title: 'Веб-сайты', text: 'Лендинги, корпоративные сайты, интернет-магазины, CMS-платформы с админкой под ваш контент.' },
  { title: 'Боты', text: 'Телеграм- и чат-боты: приём заявок, оплаты, уведомления, автоматизация рутины и поддержки.' },
  { title: 'Дизайн (UI/UX)', text: 'Фирменный стиль, прототипы и интерфейсы — красиво, удобно и под задачу бизнеса.' },
  { title: 'Мобильные приложения', text: 'iOS и Android — от идеи до публикации в сторах.' },
  { title: 'Интеграции и автоматизация', text: 'CRM, платежи, соцсети, аналитика, выгрузки — связываем сервисы между собой.' },
  { title: 'Любые IT-продукты', text: 'Нестандартная задача? Спроектируем и соберём решение под ключ.' },
]

export default function DevelopmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Разработка"
        title="Titan Development Team"
        subtitle="Проектируем и создаём сайты, ботов и любые цифровые продукты — от идеи до запуска и поддержки."
      />

      <Section tone="ink">
        <Container>
          <Reveal>
            <div className="max-w-3xl space-y-4 text-paper/80">
              <p className="text-lg leading-relaxed">
                Мы — команда <span className="font-semibold text-paper">Titan Development Team</span>. Разрабатываем
                веб-сайты, телеграм-ботов, мобильные приложения и IT-решения под ключ. Этот сайт клуба дзюдо
                «Локомотив» — одна из наших работ.
              </p>
              <p className="leading-relaxed">
                Нужен сайт, бот, дизайн или своя цифровая система? Мы возьмёмся за проект любой сложности —
                спроектируем, реализуем и поможем с поддержкой и развитием.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="surface">
        <Container>
          <Reveal>
            <h2 className="mb-10 font-display text-2xl font-bold uppercase text-paper sm:text-3xl">Что мы делаем</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-2xl border border-line bg-ink p-6 transition-colors hover:border-primary-400/50">
                  <h3 className="font-display text-lg font-semibold uppercase text-primary-400">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/80">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ink" className="border-t border-line">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary-400/30 bg-primary/10 p-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-paper">Обсудить проект</h3>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Напишите нам в Telegram — расскажите задачу, предложим решение, сроки и стоимость.
                </p>
              </div>
              <a
                href={TG}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-8 font-display text-base font-semibold uppercase tracking-wide text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Написать @thiskai
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
