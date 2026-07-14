import React from 'react'
import Link from 'next/link'

/** Ссылка на экран «Возможные дубликаты» в боковой навигации админки. */
export const DuplicatesNavLink: React.FC = () => {
  return (
    <Link
      href="/admin/duplicates"
      style={{ display: 'block', padding: '0.35rem 0', fontWeight: 600 }}
    >
      Возможные дубликаты
    </Link>
  )
}

export default DuplicatesNavLink
