import React from 'react'
import { getSiteSettings } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

/** Логотип на странице входа: лого сайта + вордмарк JC / LOKO / ADMIN. */
export async function Logo() {
  let logoUrl: string | null = null
  try {
    const s = await getSiteSettings()
    logoUrl = mediaUrl((s as { logo?: unknown })?.logo)
  } catch {
    logoUrl = null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="Локомотив" style={{ height: 64, width: 'auto' }} />
      ) : (
        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            height: 64,
            width: 64,
            borderRadius: 12,
            background: '#c1121f',
            color: '#fff',
            fontWeight: 800,
            fontSize: 34,
          }}
        >
          Л
        </span>
      )}
      <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: 22 }}>
        <span style={{ color: '#1f7a4d' }}>JC</span>
        <span style={{ opacity: 0.35, margin: '0 6px' }}>/</span>
        <span>LOKO</span>
        <span style={{ opacity: 0.35, margin: '0 6px' }}>/</span>
        <span style={{ color: '#c1121f' }}>ADMIN</span>
      </span>
    </div>
  )
}

export default Logo
