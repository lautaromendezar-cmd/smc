export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://smconstrucciones.com.ar').replace(/\/+$/, '')

export const NOINDEX = process.env.NEXT_PUBLIC_SITE_NOINDEX === 'true'

export function waLink(numero: string, mensaje: string) {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`
}

export function telLink(telefono: string) {
  const digits = telefono.replace(/\D/g, '')
  // números locales de AMBA (11 xxxx-xxxx) -> +54 11 ...
  return `tel:${digits.startsWith('54') ? '+' + digits : '+54' + digits}`
}
