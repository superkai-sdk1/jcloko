import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Клуб дзюдо «Локомотив»',
  description:
    'Клуб дзюдо «Локомотив» — тренировки, расписание, тренеры, новости и достижения спортсменов.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
