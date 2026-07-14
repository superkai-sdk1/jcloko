import React from 'react'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Section tone="ink" pattern className="flex min-h-[70vh] items-center">
      <Container className="text-center">
        <p className="font-display text-[7rem] font-bold leading-none text-primary-400 sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold uppercase text-paper sm:text-4xl">
          Страница не найдена
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Возможно, страница была перемещена или удалена. Вернитесь на главную или загляните в
          расписание тренировок.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="accent" size="lg">
            На главную
          </Button>
          <Button href="/raspisanie" variant="outline" size="lg">
            Расписание
          </Button>
        </div>
      </Container>
    </Section>
  )
}
