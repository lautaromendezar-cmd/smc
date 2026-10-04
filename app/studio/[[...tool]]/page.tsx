import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui' }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>El panel todavía no está conectado</h1>
          <p style={{ opacity: 0.75, lineHeight: 1.5 }}>
            Falta configurar <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>. Ver README.md, sección «Sanity».
          </p>
        </div>
      </main>
    )
  }
  return <NextStudio config={config} />
}
