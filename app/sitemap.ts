import type { MetadataRoute } from 'next'
import { getSlugs } from '@/lib/datos'
import { NOINDEX, SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (NOINDEX) return []
  const obras = await getSlugs()
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/obras`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/contacto`, changeFrequency: 'yearly', priority: 0.6 },
    ...obras.map((o) => ({
      url: `${SITE_URL}/obras/${o.slug}`,
      lastModified: new Date(o._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
