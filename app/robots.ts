import type { MetadataRoute } from 'next'
import { NOINDEX, SITE_URL } from '@/lib/site'

/** Mientras NEXT_PUBLIC_SITE_NOINDEX=true (vista previa) se bloquea todo. */
export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
