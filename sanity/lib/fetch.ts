import 'server-only'
import type { QueryParams } from 'next-sanity'
import { client } from './client'

/** Tags de caché. El webhook (/api/revalidate) invalida estos mismos. */
export const TAGS = {
  config: 'config',
  obras: 'obra',
  obra: (slug: string) => `obra:${slug}`,
} as const

/**
 * fetch cacheado indefinidamente y revalidado por tags desde el webhook.
 * Si Sanity no está configurado o falla, devuelve null y el sitio usa respaldos.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags: string[]
}): Promise<T | null> {
  if (!client) return null
  try {
    return await client.fetch<T>(query, params, { cache: 'force-cache', next: { tags } })
  } catch (error) {
    console.error('[sanity] error en la consulta', tags.join(','), error)
    return null
  }
}
