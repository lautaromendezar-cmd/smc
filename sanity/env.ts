export const apiVersion = '2025-10-01'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

/**
 * Sin projectId válido el sitio funciona igual con los textos e imágenes de
 * respaldo (content/). Una variable vacía no tiene que romper el build.
 */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId.trim())
