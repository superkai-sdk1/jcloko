import React from 'react'
import { Img } from '@/components/ui/Img'
import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'
import { RichText } from '@/components/RichText'
import { HeroSlider } from './HeroSlider'
import { FAQAccordion } from './FAQAccordion'
import { ContactForm } from './ContactForm'
import { EducationProgram } from './EducationProgram'
import { ForumChallenge } from './ForumChallenge'
import { CoachCard, AthleteCard } from '@/components/cards/PersonCard'
import { getCoaches, getAthletes, getPartners, getScheduleEntries, getNews } from '@/lib/queries'
import { mediaUrl, mediaAlt, mediaFocal, mediaSize } from '@/lib/media'
import { CardScroller, type DeckItem } from '@/components/decks/CardScroller'
import { toEmbedUrl } from '@/lib/embed'
import { resolvePartnerHref, isExternalHref } from '@/lib/partnerLink'
import { AdTooltip } from '@/components/AdTooltip'

// Блоки приходят из Payload как объекты с blockType. Читаем поля через утилиты.
type Block = Record<string, unknown>
const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const bool = (v: unknown): boolean => v === true
const fmtDate = (v: unknown): string => {
  if (typeof v !== 'string') return ''
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const dayLabels: Record<string, string> = {
  mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг',
  fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье',
}
const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// ─── Mission ────────────────────────────────────────────────────────────────
function MissionBlock({ b }: { b: Block }) {
  const img = mediaUrl(b.image)
  return (
    <Section tone="ink" pattern>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow={str(b.eyebrow) || 'О клубе'} title={str(b.heading) || 'Наша миссия'} />
            <div className="mt-5">
              <RichText data={b.text as never} />
            </div>
          </Reveal>
          {img && (
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
                <Img src={img} alt={mediaAlt(b.image, 'Дзюдо')} fill focal={mediaFocal(b.image)} className="object-cover" />
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  )
}

// ─── Statistics ───────────────────────────────────────────────────────────────
function StatisticsBlock({ b }: { b: Block }) {
  const stats = arr(b.stats)
  return (
    <Section tone="surface">
      <Container>
        {str(b.heading) && <SectionHeading eyebrow={str(b.eyebrow) || 'Цифры'} title={str(b.heading)} align="center" className="mb-10" />}
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => {
            const st = s as Block
            return (
              <Reveal key={i} delay={i * 0.06}>
                <div className="rounded-xl border border-line bg-ink p-6 text-center">
                  <div className="font-display text-4xl font-bold text-primary-400 lg:text-5xl">
                    {str(st.value)}
                    <span className="text-accent">{str(st.suffix)}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted">{str(st.label)}</div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

// ─── CallToAction ─────────────────────────────────────────────────────────────
function CallToActionBlock({ b }: { b: Block }) {
  const outline = str(b.style) === 'outline'
  return (
    <Section tone="ink">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-2 bg-tatami px-6 py-14 text-center sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold uppercase text-paper sm:text-4xl">
              {str(b.heading)}
            </h2>
            {str(b.text) && <p className="mx-auto mt-4 max-w-xl text-muted">{str(b.text)}</p>}
            {str(b.buttonLabel) && (
              <div className="mt-8">
                <Button href={str(b.buttonUrl) || '/kontakty'} variant={outline ? 'outline' : 'accent'} size="lg">
                  {str(b.buttonLabel)}
                </Button>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function TimelineBlock({ b }: { b: Block }) {
  const events = arr(b.events)
  return (
    <Section tone="ink">
      <Container>
        <SectionHeading eyebrow={str(b.eyebrow) || 'История'} title={str(b.heading) || 'История клуба'} className="mb-12" />
        <div className="relative border-l border-line pl-6 sm:pl-8">
          {events.map((e, i) => {
            const ev = e as Block
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className="relative pb-10 last:pb-0">
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-ink bg-accent sm:-left-[39px]" aria-hidden />
                  {str(ev.year) && <div className="font-display text-2xl font-bold text-primary-400">{str(ev.year)}</div>}
                  <h3 className="mt-1 text-xl text-paper">{str(ev.title)}</h3>
                  {str(ev.description) && <p className="mt-1 max-w-2xl text-muted">{str(ev.description)}</p>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

// ─── RulesList (Заповеди) ─────────────────────────────────────────────────────
function RulesListBlock({ b }: { b: Block }) {
  const rules = arr(b.rules)
  return (
    <Section tone="surface" pattern>
      <Container>
        <SectionHeading eyebrow={str(b.eyebrow) || 'Принципы'} title={str(b.heading) || 'Заповеди дзюдо'} align="center" className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rules.map((r, i) => {
            const rule = r as Block
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex h-full gap-4 rounded-xl border border-line bg-ink p-5">
                  <span className="font-display text-3xl font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    {str(rule.title) && <h3 className="text-lg text-paper">{str(rule.title)}</h3>}
                    {str(rule.text) && <p className="mt-1 text-sm text-muted">{str(rule.text)}</p>}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

// ─── TeamGrid ─────────────────────────────────────────────────────────────────
async function TeamGridBlock({ b }: { b: Block }) {
  const mode = str(b.mode) || 'coaches'
  const showAll = bool(b.showAll)
  let people: unknown[]
  if (mode === 'athletes') {
    people = showAll ? await getAthletes() : arr(b.athletes)
  } else {
    people = showAll ? await getCoaches() : arr(b.coaches)
  }
  return (
    <Section tone="ink">
      <Container>
        <SectionHeading
          eyebrow={str(b.eyebrow) || (mode === 'athletes' ? 'Спортсмены' : 'Тренеры')}
          title={str(b.heading) || (mode === 'athletes' ? 'Наши спортсмены' : 'Тренерский состав')}
          className="mb-10"
        />
        <Reveal>
          <CardScroller
            items={people.slice(0, 12).map((p, i) => {
              const person = p as Block
              const photo = person.photo
              return {
                key: String(person.id ?? i),
                href: mode === 'athletes' ? undefined : person.id != null ? `/trenery/${person.id}` : undefined,
                img: mediaSize(photo, 'card') || mediaUrl(photo),
                focal: mediaFocal(photo),
                title: str(person.name),
                subtitle: mode === 'athletes' ? str(person.rank) : str(person.title) || str(person.rank),
              } as DeckItem
            })}
            aspect="3 / 4"
            cardWidth="w-48 sm:w-52"
            seeAllHref={mode === 'athletes' ? undefined : '/trenery'}
            seeAllLabel={mode === 'athletes' ? undefined : 'Все тренеры'}
          />
        </Reveal>
      </Container>
    </Section>
  )
}

// ─── LatestNews (последние новости колодой) ────────────────────────────────────
async function LatestNewsBlock({ b }: { b: Block }) {
  const count = typeof b.count === 'number' && b.count > 0 ? b.count : 3
  const news = await getNews(count)
  if (news.length === 0) return null
  return (
    <Section tone="surface">
      <Container>
        <SectionHeading eyebrow={str(b.eyebrow) || 'Жизнь клуба'} title={str(b.heading) || 'Последние новости'} className="mb-4" />
        <Reveal>
          <CardScroller
            items={news.map((n, i) => {
              const nn = n as unknown as Block
              return {
                key: String(nn.id ?? i),
                href: `/novosti/${str(nn.slug)}`,
                img: mediaSize(nn.heroImage, 'card') || mediaUrl(nn.heroImage),
                focal: mediaFocal(nn.heroImage),
                title: str(nn.title),
                subtitle: fmtDate(nn.publishedAt),
              } as DeckItem
            })}
            aspect="16 / 11"
            cardWidth="w-64 sm:w-72"
            seeAllHref="/novosti"
            seeAllLabel="Все новости"
          />
        </Reveal>
      </Container>
    </Section>
  )
}

// ─── PartnersStrip ────────────────────────────────────────────────────────────
async function PartnersStripBlock({ b }: { b: Block }) {
  const showAll = bool(b.showAll)
  const partners = showAll ? await getPartners() : arr(b.partners)
  return (
    <Section tone="surface">
      <Container>
        {str(b.heading) && <SectionHeading eyebrow={str(b.eyebrow) || 'Партнёры'} title={str(b.heading)} align="center" className="mb-12" />}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {partners.map((p, i) => {
            const partner = p as Block
            const logo = mediaUrl(partner.logo)
            const name = str(partner.name)
            const href = resolvePartnerHref(partner)
            const external = href ? isExternalHref(href) : false

            const card = (
              <div className="group relative flex h-full min-h-[160px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary-400/50 hover:bg-surface hover:shadow-xl hover:shadow-primary/10 lg:min-h-[190px]">
                {/* блик, пробегающий по карточке при наведении */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper/[0.06] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  aria-hidden
                />
                {logo ? (
                  // Обычный img — надёжно для SVG-логотипов и «нестандартных» имён файлов
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo}
                    alt={mediaAlt(partner.logo, name)}
                    className="h-16 w-auto max-w-full object-contain opacity-70 grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 lg:h-20 [@media(hover:none)]:opacity-100 [@media(hover:none)]:grayscale-0"
                  />
                ) : (
                  <span className="font-display text-xl font-bold uppercase tracking-wide text-muted transition-colors group-hover:text-paper">
                    {name}
                  </span>
                )}
                {logo && name && (
                  <span className="text-center text-xs font-medium uppercase tracking-wide text-muted transition-colors group-hover:text-paper/90">
                    {name}
                  </span>
                )}
              </div>
            )

            const linked = href ? (
              <Link
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block h-full"
                aria-label={name || 'Партнёр'}
              >
                {card}
              </Link>
            ) : (
              card
            )

            return (
              <Reveal key={i} delay={i * 0.05} variant="scale" className="h-full">
                <AdTooltip
                  className="h-full w-full"
                  erid={str(partner.erid) || null}
                  advertiser={str(partner.advertiserInfo) || null}
                >
                  {linked}
                </AdTooltip>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function GalleryBlock({ b }: { b: Block }) {
  const images = arr(b.images)
  return (
    <Section tone="ink">
      <Container>
        {str(b.heading) && <SectionHeading eyebrow={str(b.eyebrow) || 'Галерея'} title={str(b.heading)} className="mb-10" />}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((im, i) => {
            const url = mediaUrl(im)
            if (!url) return null
            return (
              <Reveal key={i} delay={i * 0.03}>
                <div className="relative aspect-square overflow-hidden rounded-lg border border-line">
                  <Img src={url} alt={mediaAlt(im, 'Фото')} fill className="object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

// ─── VideoEmbed ───────────────────────────────────────────────────────────────
function VideoEmbedBlock({ b }: { b: Block }) {
  const url = str(b.url)
  if (!url) return null
  return (
    <Section tone="ink">
      <Container>
        {str(b.title) && <SectionHeading eyebrow={str(b.eyebrow) || 'Видео'} title={str(b.title)} align="center" className="mb-8" />}
        <Reveal>
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl border border-line bg-black">
            <iframe
              src={toEmbedUrl(str(b.provider), url)}
              title={str(b.title) || 'Видео'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

// ─── ScheduleTable ────────────────────────────────────────────────────────────
async function ScheduleTableBlock({ b }: { b: Block }) {
  const showAll = bool(b.showAll)
  const entries = (showAll ? await getScheduleEntries() : arr(b.entries)) as Block[]
  const byDay = dayOrder
    .map((d) => ({ day: d, items: entries.filter((e) => str(e.dayOfWeek) === d) }))
    .filter((g) => g.items.length > 0)

  return (
    <Section tone="surface">
      <Container>
        <SectionHeading eyebrow={str(b.eyebrow) || 'Расписание'} title={str(b.heading) || 'Расписание тренировок'} className="mb-10" />
        <div className="space-y-8">
          {byDay.map((group) => (
            <Reveal key={group.day}>
              <div>
                <h3 className="mb-3 font-display text-xl uppercase text-primary-400">{dayLabels[group.day]}</h3>
                <div className="overflow-hidden rounded-xl border border-line">
                  {group.items.map((e, i) => {
                    const coach = e.coach as Block | undefined
                    return (
                      <div key={i} className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-line bg-ink px-5 py-3 last:border-0">
                        <span className="w-28 font-display text-lg font-semibold tabular-nums text-paper">
                          {str(e.startTime)}{str(e.endTime) ? `–${str(e.endTime)}` : ''}
                        </span>
                        <span className="min-w-40 flex-1 text-paper">{str(e.group)}</span>
                        {str(e.ageGroup) && <span className="text-sm text-muted">{str(e.ageGroup)}</span>}
                        {coach && typeof coach === 'object' && str(coach.name) && (
                          <span className="text-sm text-muted">{str(coach.name)}</span>
                        )}
                        {str(e.hall) && <span className="text-sm text-muted">{str(e.hall)}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}
          {byDay.length === 0 && <p className="text-muted">Расписание скоро появится.</p>}
        </div>
      </Container>
    </Section>
  )
}

// ─── ContactForm block ────────────────────────────────────────────────────────
function ContactFormBlock({ b }: { b: Block }) {
  return (
    <Section tone="ink" pattern>
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow={str(b.eyebrow) || 'Запись'}
          title={str(b.heading) || 'Записаться на тренировку'}
          subtitle={str(b.description) || undefined}
          align="center"
          className="mb-8"
        />
        <ContactForm consentText={str(b.consentText) || null} submitLabel={str(b.submitLabel) || undefined} />
      </Container>
    </Section>
  )
}

// ─── FAQ block ────────────────────────────────────────────────────────────────
function FAQBlock({ b }: { b: Block }) {
  return (
    <Section tone="surface">
      <Container>
        <SectionHeading eyebrow={str(b.eyebrow) || 'Вопросы'} title={str(b.heading) || 'Частые вопросы'} align="center" className="mb-10" />
        <FAQAccordion items={arr(b.items) as never} />
      </Container>
    </Section>
  )
}

// ─── RichText block ───────────────────────────────────────────────────────────
function RichTextBlock({ b }: { b: Block }) {
  return (
    <Section tone="ink">
      <Container className="max-w-3xl">
        <Reveal>
          <RichText data={b.content as never} />
        </Reveal>
      </Container>
    </Section>
  )
}

// ─── Renderer ─────────────────────────────────────────────────────────────────
export function BlockRenderer({ blocks }: { blocks?: unknown }) {
  const list = arr(blocks)
  return (
    <>
      {list.map((raw, i) => {
        const b = raw as Block
        const type = str(b.blockType)
        const key = `${type}-${i}`
        switch (type) {
          case 'heroSlider':
            return (
              <HeroSlider
                key={key}
                slides={arr(b.slides) as never}
                adaptContrast={b.adaptContrast !== false}
                slideDurationSec={typeof b.slideDurationSec === 'number' ? b.slideDurationSec : 6}
              />
            )
          case 'mission':
            return <MissionBlock key={key} b={b} />
          case 'statistics':
            return <StatisticsBlock key={key} b={b} />
          case 'latestNews':
            return <LatestNewsBlock key={key} b={b} />
          case 'callToAction':
            return <CallToActionBlock key={key} b={b} />
          case 'timeline':
            return <TimelineBlock key={key} b={b} />
          case 'rulesList':
            return <RulesListBlock key={key} b={b} />
          case 'teamGrid':
            return <TeamGridBlock key={key} b={b} />
          case 'partnersStrip':
            return <PartnersStripBlock key={key} b={b} />
          case 'gallery':
            return <GalleryBlock key={key} b={b} />
          case 'videoEmbed':
            return <VideoEmbedBlock key={key} b={b} />
          case 'scheduleTable':
            return <ScheduleTableBlock key={key} b={b} />
          case 'contactForm':
            return <ContactFormBlock key={key} b={b} />
          case 'faqAccordion':
            return <FAQBlock key={key} b={b} />
          case 'richText':
            return <RichTextBlock key={key} b={b} />
          case 'educationProgram':
            return <EducationProgram key={key} b={b} />
          case 'forumChallenge':
            return <ForumChallenge key={key} b={b} />
          default:
            return null
        }
      })}
    </>
  )
}
