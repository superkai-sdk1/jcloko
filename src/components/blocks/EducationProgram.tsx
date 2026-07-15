import React from 'react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/utils/cn'

type Block = Record<string, unknown>
const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])

const PDF_FALLBACK = '/programma-sportivnoy-podgotovki-2026.pdf'

const DEFAULT_INTRO =
  'Дополнительная образовательная программа спортивной подготовки по виду спорта «Дзюдо». Разработана на основе Федерального стандарта спортивной подготовки, утверждённого приказом Министерства спорта России от 14.08.2025 г. № 655.'

const DEFAULT_META = [
  { k: 'Организация', v: 'РОО КБР «ДЮСШ Клуба дзюдо “Локомотив”»' },
  { k: 'Принято', v: 'Педагогический совет, протокол № 2 от 23.12.2025 г.' },
  { k: 'Утверждаю', v: 'Генеральный директор Н. Х. Гаданов' },
  { k: 'Срок реализации', v: 'Без ограничения · г. о. Нальчик' },
]

/* ── Примитивы таблиц ───────────────────────────────────────────────────── */
const th = 'border border-line bg-surface-2 px-3 py-2.5 text-left align-middle font-display text-xs font-semibold uppercase tracking-wide text-paper'
const thc = cn(th, 'text-center')
const td = 'border border-line px-3 py-2.5 align-middle text-sm text-paper/85'
const tdc = cn(td, 'text-center tabular-nums font-medium text-paper')
const tdName = cn(td, 'font-medium text-paper')

function ScrollTable({ children, min = 'min-w-[720px]' }: { children: React.ReactNode; min?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className={cn('w-full border-collapse text-sm', min)}>{children}</table>
    </div>
  )
}

function Head({ num, eyebrow, title }: { num?: string; eyebrow?: string; title: string }) {
  return (
    <div className="mb-8">
      {(num || eyebrow) && (
        <span className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">
          <span className="h-px w-6 bg-accent" aria-hidden />
          {num ? `Раздел ${num}` : eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-bold uppercase text-paper sm:text-3xl">{title}</h2>
    </div>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

const toc = [
  { id: 'obshee', label: '1. Общие сведения' },
  { id: 'etapy', label: '2.1. Этапы подготовки' },
  { id: 'obem', label: '2.2–2.3. Объём и формы' },
  { id: 'meropriyatiya', label: '2.3. УТ-мероприятия' },
  { id: 'sorevnovaniya', label: '2.4. Соревнования' },
  { id: 'plan', label: '2.4. Годовой план' },
  { id: 'vospitanie', label: '2.5. Воспитательная работа' },
  { id: 'antidoping', label: '2.6. Антидопинг' },
  { id: 'praktika', label: '2.7. Инструкторская практика' },
  { id: 'vosstanovlenie', label: '2.8. Восстановление' },
]

/**
 * Блок «Образовательная деятельность». Заголовок, вводный текст, реквизиты и
 * файл программы (PDF) редактируются в админке; официальные таблицы программы
 * рендерятся как фиксированный контент и включаются флажком «Показывать полную
 * программу».
 */
export function EducationProgram({ b }: { b: Block }) {
  const eyebrow = str(b.eyebrow) || 'О клубе'
  const heading = str(b.heading) || 'Образовательная деятельность'
  const intro = str(b.intro) || DEFAULT_INTRO

  const file = b.programFile
  const pdfHref =
    file && typeof file === 'object' && typeof (file as { url?: unknown }).url === 'string'
      ? ((file as { url: string }).url)
      : PDF_FALLBACK

  const metaRaw = arr(b.meta) as { k?: unknown; v?: unknown }[]
  const meta = metaRaw.length
    ? metaRaw.map((m) => ({ k: str(m.k), v: str(m.v) })).filter((m) => m.k || m.v)
    : DEFAULT_META

  const showDetails = b.showProgramDetails !== false

  return (
    <>
      {/* ── Шапка ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-line bg-ink-800 bg-tatami">
        <Container className="py-16 lg:py-24">
          <span className="inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">
            <span className="h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </span>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold uppercase text-paper sm:text-5xl lg:text-6xl">{heading}</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted">{intro}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={pdfHref}
              download
              className="inline-flex h-13 items-center justify-center gap-3 rounded-lg bg-accent px-8 font-display text-base font-semibold uppercase tracking-wide text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <DownloadIcon className="h-5 w-5" />
              Скачать программу (PDF)
            </a>
            <a
              href={pdfHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-lg border border-line px-6 font-display text-sm font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-surface-2"
            >
              Открыть в новой вкладке →
            </a>
          </div>

          {meta.length > 0 && (
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {meta.map((m) => (
                <div key={m.k + m.v} className="rounded-xl border border-line bg-surface/50 p-4">
                  <div className="font-display text-xs font-semibold uppercase tracking-wide text-primary-400">{m.k}</div>
                  <div className="mt-1.5 text-sm text-paper/85">{m.v}</div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>

      {!showDetails ? null : (
        <>
          {/* ── Содержание ────────────────────────────────────────────────── */}
          <div className="border-b border-line bg-ink">
            <Container className="py-6">
              <div className="flex flex-wrap gap-2">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className="rounded-full border border-line bg-surface/50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-paper/75 transition-colors hover:border-primary-400/60 hover:text-paper"
                  >
                    {t.label}
                  </a>
                ))}
              </div>
            </Container>
          </div>

          {/* ── 1. Общие сведения ─────────────────────────────────────────── */}
          <Section id="obshee" tone="ink" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head num="1" title="Общие сведения" />
              </Reveal>
              <div className="grid gap-6 lg:grid-cols-2">
                <Reveal>
                  <div className="rounded-2xl border border-line bg-surface/50 p-6">
                    <h3 className="font-display text-lg font-semibold uppercase text-paper">1.1. Назначение программы</h3>
                    <p className="mt-3 leading-relaxed text-paper/80">
                      Дополнительная образовательная программа спортивной подготовки по виду спорта «Дзюдо»
                      (далее — Программа) предназначена для организации образовательной деятельности по
                      спортивной подготовке дзюдоистов с учётом совокупности минимальных требований к
                      спортивной подготовке, определяемых федеральным стандартом спортивной подготовки по виду
                      спорта «Дзюдо», утверждённым приказом Министерства спорта России от 14.08.2025 г. № 655
                      (далее — ФССП).
                    </p>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="h-full rounded-2xl border border-primary-400/30 bg-primary/10 p-6">
                    <h3 className="font-display text-lg font-semibold uppercase text-primary-400">1.2. Цель программы</h3>
                    <p className="mt-3 leading-relaxed text-paper/90">
                      Достижение спортивных результатов на основе соблюдения спортивных и педагогических
                      принципов в учебно-тренировочном процессе в условиях многолетнего, круглогодичного и
                      поэтапного процесса спортивной подготовки.
                    </p>
                  </div>
                </Reveal>
              </div>
            </Container>
          </Section>

          {/* ── 2.1. Этапы подготовки ─────────────────────────────────────── */}
          <Section id="etapy" tone="surface" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.1." title="Сроки реализации этапов и возрастные границы" />
              </Reveal>
              <Reveal>
                <ScrollTable min="min-w-[640px]">
                  <thead>
                    <tr>
                      <th className={th}>Этапы спортивной подготовки</th>
                      <th className={thc}>Срок реализации (лет)</th>
                      <th className={thc}>Возрастные границы (лет)</th>
                      <th className={thc}>Наполняемость (человек)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Этап начальной подготовки', '3–4', '7', '10–20'],
                      ['Учебно-тренировочный этап (этап спортивной специализации)', '3–5', '11', '6–12'],
                      ['Этап совершенствования спортивного мастерства', 'Не ограничивается', '14–20', '1–8'],
                      ['Этап высшего спортивного мастерства', 'Не ограничивается', '16 и больше', '1–4'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className={tdName}>{r[0]}</td>
                        <td className={tdc}>{r[1]}</td>
                        <td className={tdc}>{r[2]}</td>
                        <td className={tdc}>{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollTable>
              </Reveal>
              <Reveal>
                <p className="mt-4 text-sm text-muted">
                  На основании приказа Министерства спорта РФ № 655 от 14.08.2025 г. «Об особенностях
                  организации и осуществления образовательной деятельности по дополнительным образовательным
                  программам спортивной подготовки» и приказа Министерства спорта РФ № 1305 от 21.12.2022 г.
                  «Об утверждении примерной дополнительной программы спортивной подготовки по виду спорта Дзюдо».
                </p>
              </Reveal>
            </Container>
          </Section>

          {/* ── 2.2–2.3. Объём и формы ────────────────────────────────────── */}
          <Section id="obem" tone="ink" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.2." title="Объём программы" />
              </Reveal>
              <Reveal>
                <ScrollTable min="min-w-[820px]">
                  <thead>
                    <tr>
                      <th className={th} rowSpan={2}>Этапный норматив</th>
                      <th className={thc} colSpan={2}>Этап начальной подготовки</th>
                      <th className={thc} colSpan={2}>Учебно-тренировочный этап (спортивной специализации)</th>
                      <th className={thc} rowSpan={2}>Этап совершенствования спортивного мастерства</th>
                      <th className={thc} rowSpan={2}>Этап высшего спортивного мастерства</th>
                    </tr>
                    <tr>
                      <th className={thc}>До года</th>
                      <th className={thc}>Свыше года</th>
                      <th className={thc}>До трёх лет</th>
                      <th className={thc}>Свыше трёх лет</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={tdName}>Количество часов в неделю</td>
                      <td className={tdc}>5–6</td>
                      <td className={tdc}>6–8</td>
                      <td className={tdc}>10–14</td>
                      <td className={tdc}>16–18</td>
                      <td className={tdc}>20–24</td>
                      <td className={tdc}>24–32</td>
                    </tr>
                    <tr>
                      <td className={tdName}>Общее количество часов в год</td>
                      <td className={tdc}>260–312</td>
                      <td className={tdc}>312–416</td>
                      <td className={tdc}>520–728</td>
                      <td className={tdc}>832–936</td>
                      <td className={tdc}>1040–1248</td>
                      <td className={tdc}>1248–1664</td>
                    </tr>
                  </tbody>
                </ScrollTable>
              </Reveal>

              <Reveal>
                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-surface/50 p-6">
                    <h3 className="font-display text-lg font-semibold uppercase text-paper">2.3. Виды (формы) обучения</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Учебно-тренировочные занятия', 'Групповые занятия', 'Индивидуальные занятия', 'Смешанные занятия'].map((v) => (
                        <span key={v} className="rounded-full border border-primary-400/40 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-paper">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface/50 p-6">
                    <h3 className="font-display text-lg font-semibold uppercase text-paper">Учебно-тренировочные мероприятия</h3>
                    <ul className="mt-4 space-y-2 text-sm text-paper/80">
                      {[
                        'По подготовке к международным соревнованиям, чемпионатам, кубкам, первенствам, другим всероссийским соревнованиям и соревнованиям субъекта РФ.',
                        'По ОФП (общая физическая подготовка) и СФП (специальная физическая подготовка).',
                        'Восстановительные мероприятия.',
                        'Мероприятия для комплексного медицинского обследования.',
                        'Учебно-тренировочные мероприятия в каникулярный период.',
                        'Просмотровые учебно-тренировочные мероприятия.',
                      ].map((t, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </Container>
          </Section>

          {/* ── 2.3 (Прил. 3). УТ-мероприятия ─────────────────────────────── */}
          <Section id="meropriyatiya" tone="surface" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="Приложение 3" title="Учебно-тренировочные мероприятия" />
              </Reveal>
              <Reveal>
                <p className="mb-5 max-w-3xl text-sm text-muted">
                  Предельная продолжительность учебно-тренировочных мероприятий по этапам спортивной подготовки
                  (количество суток, без учёта времени следования к месту проведения и обратно).
                </p>
                <ScrollTable min="min-w-[880px]">
                  <thead>
                    <tr>
                      <th className={cn(thc, 'w-10')}>№</th>
                      <th className={th}>Виды учебно-тренировочных мероприятий</th>
                      <th className={thc}>Этап начальной подготовки</th>
                      <th className={thc}>Учебно-тренировочный этап</th>
                      <th className={thc}>Этап совершенствования спорт. мастерства</th>
                      <th className={thc}>Этап высшего спорт. мастерства</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={cn(td, 'bg-surface-2 font-display text-xs font-semibold uppercase text-primary-400')} colSpan={6}>
                        1. Учебно-тренировочные мероприятия по подготовке к спортивным соревнованиям
                      </td>
                    </tr>
                    {[
                      ['1.1.', 'По подготовке к международным спортивным соревнованиям', '—', '—', '21', '21'],
                      ['1.2.', 'По подготовке к чемпионатам России, кубкам России, первенствам России', '—', '14', '18', '21'],
                      ['1.3.', 'По подготовке к другим всероссийским спортивным соревнованиям', '—', '14', '18', '18'],
                      ['1.4.', 'По подготовке к официальным спортивным соревнованиям субъекта РФ', '—', '14', '14', '14'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className={tdc}>{r[0]}</td>
                        <td className={tdName}>{r[1]}</td>
                        <td className={tdc}>{r[2]}</td>
                        <td className={tdc}>{r[3]}</td>
                        <td className={tdc}>{r[4]}</td>
                        <td className={tdc}>{r[5]}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className={cn(td, 'bg-surface-2 font-display text-xs font-semibold uppercase text-primary-400')} colSpan={6}>
                        2. Специальные учебно-тренировочные мероприятия
                      </td>
                    </tr>
                    <tr>
                      <td className={tdc}>2.1.</td>
                      <td className={tdName}>По общей и (или) специальной физической подготовке</td>
                      <td className={tdc}>—</td>
                      <td className={tdc}>14</td>
                      <td className={tdc}>18</td>
                      <td className={tdc}>18</td>
                    </tr>
                    <tr>
                      <td className={tdc}>2.2.</td>
                      <td className={tdName}>Восстановительные мероприятия</td>
                      <td className={tdc}>—</td>
                      <td className={tdc}>—</td>
                      <td className={tdc} colSpan={2}>До 10 суток</td>
                    </tr>
                    <tr>
                      <td className={tdc}>2.3.</td>
                      <td className={tdName}>Мероприятия для комплексного медицинского обследования</td>
                      <td className={tdc}>—</td>
                      <td className={tdc}>—</td>
                      <td className={tdc} colSpan={2}>До 3 суток, но не более 2 раз в год</td>
                    </tr>
                    <tr>
                      <td className={tdc}>2.4.</td>
                      <td className={tdName}>Учебно-тренировочные мероприятия в каникулярный период</td>
                      <td className={tdc} colSpan={2}>До 21 суток подряд и не более двух мероприятий в год</td>
                      <td className={tdc}>—</td>
                      <td className={tdc}>—</td>
                    </tr>
                    <tr>
                      <td className={tdc}>2.5.</td>
                      <td className={tdName}>Просмотровые учебно-тренировочные мероприятия</td>
                      <td className={tdc}>—</td>
                      <td className={tdc} colSpan={3}>До 60 суток</td>
                    </tr>
                  </tbody>
                </ScrollTable>
              </Reveal>
            </Container>
          </Section>

          {/* ── 2.4 (Прил. 4). Соревнования ───────────────────────────────── */}
          <Section id="sorevnovaniya" tone="ink" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="Приложение 4" title="Объём соревновательной деятельности" />
              </Reveal>
              <Reveal>
                <ScrollTable min="min-w-[900px]">
                  <thead>
                    <tr>
                      <th className={th} rowSpan={2}>Виды спортивных соревнований</th>
                      <th className={thc} colSpan={3}>Этап начальной подготовки</th>
                      <th className={thc} colSpan={2}>Учебно-тренировочный этап</th>
                      <th className={thc} rowSpan={2}>ЭССМ</th>
                      <th className={thc} rowSpan={2}>ЭВСМ</th>
                    </tr>
                    <tr>
                      <th className={thc}>Первый год</th>
                      <th className={thc}>Второй год</th>
                      <th className={thc}>Свыше двух лет</th>
                      <th className={thc}>До трёх лет</th>
                      <th className={thc}>Свыше трёх лет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Контрольные', '1', '2', '2', '2', '2', '3', '3'],
                      ['Отборочные', '—', '—', '2', '2', '2', '2', '1'],
                      ['Основные', '—', '—', '1', '1', '1', '1', '1'],
                      ['Состязания', '—', '—', '—', '10', '15', '18', '18'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className={tdName}>{r[0]}</td>
                        {r.slice(1).map((c, i) => (
                          <td key={i} className={tdc}>{c}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className={cn(td, 'bg-surface-2 font-display text-xs font-semibold uppercase text-primary-400')} colSpan={8}>
                        Для спортивной дисциплины «ката-группа»
                      </td>
                    </tr>
                    {[
                      ['Контрольные', '1', '2', '2', '2', '2', '2', '2'],
                      ['Отборочные', '—', '—', '1', '1', '1', '1', '1'],
                      ['Основные', '—', '—', '1', '1', '1', '1', '1'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className={tdName}>{r[0]}</td>
                        {r.slice(1).map((c, i) => (
                          <td key={i} className={tdc}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </ScrollTable>
              </Reveal>
            </Container>
          </Section>

          {/* ── 2.4 (Прил. 5). Годовой план ───────────────────────────────── */}
          <Section id="plan" tone="surface" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.4. · Приложение 5" title="Годовой учебно-тренировочный план" />
              </Reveal>
              <Reveal>
                <p className="mb-5 max-w-3xl text-sm text-muted">
                  Соотношение видов спортивной подготовки и иных мероприятий в структуре учебно-тренировочного
                  процесса на этапах спортивной подготовки (%).
                </p>
                <ScrollTable min="min-w-[860px]">
                  <thead>
                    <tr>
                      <th className={cn(thc, 'w-10')} rowSpan={2}>№</th>
                      <th className={th} rowSpan={2}>Виды спортивной подготовки и иные мероприятия</th>
                      <th className={thc} colSpan={2}>Этап начальной подготовки</th>
                      <th className={thc} colSpan={2}>Учебно-тренировочный этап</th>
                      <th className={thc} rowSpan={2}>ЭССМ</th>
                      <th className={thc} rowSpan={2}>ЭВСМ</th>
                    </tr>
                    <tr>
                      <th className={thc}>До года</th>
                      <th className={thc}>Свыше года</th>
                      <th className={thc}>До трёх лет</th>
                      <th className={thc}>Свыше трёх лет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['1', 'Общая физическая подготовка (%)', '54–64', '50–54', '20–29', '17–29', '14–25', '14–25'],
                      ['2', 'Специальная физическая подготовка (%)', '1–9', '5–10', '16–20', '18–25', '20–25', '20–28'],
                      ['3', 'Участие в спортивных соревнованиях (%)', '—', '0–2', '3–8', '4–9', '4–10', '4–10'],
                      ['4', 'Техническая подготовка (%)', '30–40', '35–40', '36–43', '38–45', '41–46', '41–48'],
                      ['5', 'Тактическая, теоретическая, психологическая подготовка (%)', '4–9', '4–9', '8–9', '8–9', '7–8', '5–6'],
                      ['6', 'Инструкторская и судейская практика (%)', '—', '—', '1–3', '1–4', '1–4', '1–4'],
                      ['7', 'Медицинские, медико-биологические, восстановительные мероприятия, тестирование и контроль (%)', '1–3', '1–3', '2–4', '2–4', '2–6', '3–10'],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className={tdc}>{r[0]}</td>
                        <td className={tdName}>{r[1]}</td>
                        {r.slice(2).map((c, i) => (
                          <td key={i} className={tdc}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </ScrollTable>
              </Reveal>
            </Container>
          </Section>

          {/* ── 2.5. Воспитательная работа ────────────────────────────────── */}
          <Section id="vospitanie" tone="ink" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.5." title="Календарный план воспитательной работы" />
              </Reveal>
              <div className="grid gap-5 lg:grid-cols-2">
                {[
                  {
                    n: '1',
                    dir: 'Профориентационная деятельность',
                    items: [
                      { sub: '1.1. Судейская практика', text: 'Участие в спортивных соревнованиях различного уровня: практическое и теоретическое изучение и применение правил дзюдо; приобретение навыков судейства и проведения соревнований в качестве помощника судьи и помощника секретаря; приобретение навыков самостоятельного судейства, формирование уважительного отношения к решениям судей.' },
                      { sub: '1.2. Инструкторская практика', text: 'Учебно-тренировочные занятия: освоение навыков организации и проведения УТЗ в качестве помощника тренера-преподавателя, инструктора; составление конспекта УТЗ в соответствии с поставленной задачей; формирование навыков наставничества, сознательного отношения к учебно-тренировочному и соревновательному процессам, склонности к педагогической работе.' },
                    ],
                  },
                  {
                    n: '2',
                    dir: 'Здоровьесбережение',
                    items: [
                      { sub: '2.1. Формирование здорового образа жизни', text: 'Дни здоровья и спорта: формирование знаний и умений в проведении дней здоровья и спорта, спортивных фестивалей; написание положений и требований, проведение мероприятий, ведение протоколов, подготовка пропагандистских акций по формированию здорового образа жизни.' },
                      { sub: '2.2. Режим питания и отдыха', text: 'Практическая деятельность и восстановительные процессы обучающихся, формирование навыков правильного режима дня с учётом спортивного режима.' },
                    ],
                  },
                  {
                    n: '3',
                    dir: 'Патриотическое воспитание обучающихся',
                    items: [
                      { sub: '3.1. Теоретическая подготовка', text: 'Воспитание патриотизма, гордости за свой край и Родину, уважения к гербу, флагу, гимну, готовности к служению Родине; традиции и развитие дзюдо, легендарные спортсмены, поведение болельщиков. Беседы, встречи, диспуты с привлечением именитых спортсменов, тренеров и ветеранов спорта.' },
                      { sub: '3.2. Практическая подготовка', text: 'Участие в физкультурных и спортивно-массовых мероприятиях, спортивных соревнованиях, в том числе в парадах, церемониях открытия и закрытия, награждения, тематических мероприятиях и праздниках.' },
                    ],
                  },
                  {
                    n: '4',
                    dir: 'Развитие творческого мышления',
                    items: [
                      { sub: 'Практическая подготовка', text: 'Семинары, мастер-классы, показательные выступления для обучающихся; формирование умений и навыков, способствующих достижению спортивных результатов; развитие навыков и мотивации, формирование культуры спортивного поведения, воспитание толерантности и взаимоуважения, правомерное поведение болельщиков, расширение общего кругозора юных дзюдоистов.' },
                    ],
                  },
                ].map((g, i) => (
                  <Reveal key={g.n} delay={(i % 2) * 0.06}>
                    <div className="flex h-full flex-col rounded-2xl border border-line bg-surface/50 p-6">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent font-display text-lg font-bold text-white">{g.n}</span>
                        <h3 className="font-display text-lg font-semibold uppercase text-paper">{g.dir}</h3>
                      </div>
                      <div className="mt-4 space-y-4">
                        {g.items.map((it) => (
                          <div key={it.sub}>
                            <div className="font-display text-sm font-semibold uppercase tracking-wide text-primary-400">{it.sub}</div>
                            <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{it.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 border-t border-line pt-3 text-xs uppercase tracking-wide text-muted">Сроки проведения: в течение года</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </Section>

          {/* ── 2.6. Антидопинг ───────────────────────────────────────────── */}
          <Section id="antidoping" tone="surface" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.6." title="План мероприятий по предотвращению допинга" />
              </Reveal>
              <div className="grid gap-5 lg:grid-cols-3">
                {[
                  { stage: 'ЭНП', full: 'Этап начальной подготовки', text: 'Антидопинговые правила, ответственность за нарушение. Права и обязанности спортсменов, принцип строгой отчётности, виды нарушений, применение лекарственных средств, проверка препаратов, риски использования пищевых добавок.', months: ['Октябрь', 'Апрель'] },
                  { stage: 'УТЭ', full: 'Учебно-тренировочный этап', text: 'Виды нарушений антидопинговых правил и ответственность за них. Принципы и ценности чистого спорта. Глобальная антидопинговая система. Субстанции и методы из запрещённого списка, применение лекарственных средств. Средства и разрешение на ТИ.', months: ['Ноябрь', 'Декабрь', 'Январь', 'Февраль', 'Апрель'] },
                  { stage: 'ЭССМ / ЭВСМ', full: 'Совершенствование и высшее мастерство', text: 'Виды нарушений антидопинговых правил и ответственность за них. Последствия применения допинга для физического и психического здоровья, социальные и экономические последствия, санкции. Как сообщить о допинге, обработка результатов.', months: ['Октябрь', 'Декабрь', 'Март'] },
                ].map((c, i) => (
                  <Reveal key={c.stage} delay={i * 0.06}>
                    <div className="flex h-full flex-col rounded-2xl border border-line bg-ink p-6">
                      <div className="font-display text-xl font-bold uppercase text-primary-400">{c.stage}</div>
                      <div className="mt-0.5 text-xs uppercase tracking-wide text-muted">{c.full}</div>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-paper/80">{c.text}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                        {c.months.map((m) => (
                          <span key={m} className="rounded-md border border-line bg-surface/60 px-2.5 py-1 text-xs font-medium text-paper/80">{m}</span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </Section>

          {/* ── 2.7. Инструкторская и судейская практика ──────────────────── */}
          <Section id="praktika" tone="ink" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.7." title="Планы инструкторской и судейской практики" />
              </Reveal>
              <Reveal>
                <div className="max-w-4xl space-y-4 text-paper/80">
                  <p className="leading-relaxed">
                    Одна из задач учебно-тренировочного процесса — подготовка дзюдоистов к роли помощника тренера,
                    инструктора, участию в организации и проведении соревнований в качестве судьи. Занятия проводятся
                    в форме бесед, семинаров, самостоятельного изучения литературы, практических занятий.
                  </p>
                  <p className="leading-relaxed">
                    Дзюдоисты на ЭССМ и ЭВСМ должны уметь подбирать основные упражнения для разминки и самостоятельно
                    проводить её, правильно демонстрировать технические приёмы, замечать и исправлять ошибки при
                    выполнении упражнений другими дзюдоистами, помогать спортсменам младших возрастных групп в
                    разучивании отдельных упражнений и приёмов, самостоятельно составлять конспект ведения всего
                    учебно-тренировочного занятия, проводить занятия в группах начальной подготовки, знакомиться с
                    документами планирования и учёта работы тренера-преподавателя, вести дневник, учитывать
                    учебно-тренировочные и соревновательные нагрузки, регистрируя спортивные результаты и анализируя
                    выступления в соревнованиях.
                  </p>
                  <p className="leading-relaxed">
                    Принимать участие в судействе в роли судьи, секретаря, главного судьи соревнований. Ведение
                    протоколов соревнований, заместитель главного судьи, проведение жеребьёвки.
                  </p>
                </div>
              </Reveal>
            </Container>
          </Section>

          {/* ── 2.8. Медицинские и восстановительные мероприятия ──────────── */}
          <Section id="vosstanovlenie" tone="surface" className="scroll-mt-28">
            <Container>
              <Reveal>
                <Head eyebrow="2.8." title="Медицинские, медико-биологические и восстановительные средства" />
              </Reveal>
              <Reveal>
                <p className="mb-8 max-w-4xl leading-relaxed text-paper/80">
                  Учебно-тренировочное занятие и восстановление — составляющие единого процесса овладения высоким
                  спортивным мастерством. Для восстановления работоспособности необходимо использовать широкий круг
                  средств и мероприятий с учётом возраста, спортивного стажа, квалификации и индивидуальных
                  особенностей дзюдоиста.
                </p>
              </Reveal>

              <div className="grid gap-5 lg:grid-cols-3">
                <Reveal>
                  <div className="h-full rounded-2xl border border-line bg-ink p-6">
                    <h3 className="font-display text-base font-semibold uppercase text-primary-400">1. Педагогические средства</h3>
                    <ul className="mt-4 space-y-2 text-sm text-paper/80">
                      {[
                        'Рациональное распределение нагрузок по этапам подготовки',
                        'Рациональное построение тренировок',
                        'Постепенное возрастание нагрузок по объёму и интенсивности',
                        'Разнообразие средств и методов тренировки',
                        'Переключение с одного вида деятельности на другой',
                        'Чередование нагрузок различного объёма и интенсивности',
                        'Изменение характера пауз отдыха, их продолжительности',
                        'Чередование тренировочных дней и дней отдыха',
                        'Оптимальное соотношение нагрузок и отдыха на тренировке и в недельном цикле',
                        'Оптимальное соотношение нагрузок и отдыха на этапах годичного цикла',
                        'Оптимальное соотношение тренировочных и соревновательных нагрузок',
                        'Упражнения для активного отдыха и расслабления',
                        'Корригирующие упражнения для позвоночника',
                        'Дни профилактического отдыха',
                      ].map((t, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <div className="h-full rounded-2xl border border-line bg-ink p-6">
                    <h3 className="font-display text-base font-semibold uppercase text-primary-400">2. Психологические средства</h3>
                    <ul className="mt-4 space-y-2 text-sm text-paper/80">
                      {['Создание положительного эмоционального фона тренировки', 'Переключение внимания, мыслей, отвлекающие мероприятия', 'Внушение', 'Психорегулирующая тренировка'].map((t, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.12}>
                  <div className="h-full rounded-2xl border border-line bg-ink p-6">
                    <h3 className="font-display text-base font-semibold uppercase text-primary-400">3. Медико-биологические средства</h3>
                    <div className="mt-4 space-y-4 text-sm text-paper/80">
                      <div>
                        <div className="font-semibold text-paper">а) Гигиенические средства</div>
                        <ul className="mt-2 space-y-2">
                          {['Водные процедуры закаливающего характера', 'Душ, тёплые ванны', 'Прогулки на свежем воздухе', 'Рациональные режимы дня и сна, питания', 'Витаминизация', 'Тренировки в благоприятное время суток'].map((t, i) => (
                            <li key={i} className="flex gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold text-paper">б) Физиотерапевтические средства</div>
                        <ul className="mt-2 space-y-2">
                          {[
                            'Душ: тёплый (успокаивающий) 36–38° по 12–15 мин; прохладный, контрастный и вибрационный (тонизирующие) 23–28° по 2–3 мин',
                            'Ванны: хвойные, жемчужные, солевые',
                            'Бани 1–2 раза в неделю: парная или суховоздушная 80–90°, 2–3 захода по 5–7 мин (исключая предсоревновательный и соревновательный микроциклы)',
                            'Ультрафиолетовое облучение',
                            'Аэронизация, кислородотерапия',
                            'Массаж, массаж с растирками, самомассаж',
                          ].map((t, i) => (
                            <li key={i} className="flex gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal>
                <div className="mt-8 max-w-4xl space-y-4 text-sm leading-relaxed text-paper/70">
                  <p>
                    Постоянное применение одного и того же средства уменьшает восстановительный эффект, так как
                    организм адаптируется к средствам локального воздействия. К средствам общего глобального
                    воздействия (русская парная баня, сауна в сочетании с водными процедурами, общий ручной массаж,
                    плавание и т. д.) адаптация происходит постепенно. В этой связи использование комплекса, а не
                    отдельных восстановительных средств, даёт больший эффект.
                  </p>
                  <p>
                    При составлении восстановительных комплексов следует помнить, что вначале надо применять средства
                    общего глобального воздействия, а затем — локального. Комплексное использование разнообразных
                    восстановительных средств в полном объёме (для этапов совершенствования и высшего спортивного
                    мастерства) необходимо после больших тренировочных нагрузок и в соревновательном периоде. В
                    остальных случаях следует использовать отдельные локальные средства в начале или в процессе
                    тренировочного занятия. По окончании тренировок с малыми или средними нагрузками достаточно
                    применения обычных водных гигиенических процедур; применение в этом случае полного комплекса
                    восстановительных средств снижает тренировочный эффект.
                  </p>
                </div>
              </Reveal>
            </Container>
          </Section>
        </>
      )}

      {/* ── Финальный CTA ─────────────────────────────────────────────────── */}
      <Section tone="ink" className="border-t border-line">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary-400/30 bg-primary/10 p-8 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-paper">Полный документ программы</h3>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Официальный документ дополнительной образовательной программы спортивной подготовки со всеми
                  приложениями доступен для скачивания.
                </p>
              </div>
              <a
                href={pdfHref}
                download
                className="inline-flex h-13 shrink-0 items-center justify-center gap-3 rounded-lg bg-accent px-8 font-display text-base font-semibold uppercase tracking-wide text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <DownloadIcon className="h-5 w-5" />
                Скачать программу (PDF)
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
