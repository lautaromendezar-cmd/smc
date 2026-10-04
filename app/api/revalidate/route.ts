import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { TAGS } from '@/sanity/lib/fetch'

type Payload = { _type?: string; slug?: string | null }

/**
 * Webhook de Sanity. Proyección esperada: {_type, "slug": slug.current}
 * Valida la firma con SANITY_REVALIDATE_SECRET y revalida los tags tocados.
 * { expire: 0 }: la próxima visita ya recibe el dato nuevo (no la versión vieja).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'Falta SANITY_REVALIDATE_SECRET' }, { status: 500 })
  }
  try {
    // el tercer argumento espera a que el Content Lake tenga el dato publicado
    const { isValidSignature, body } = await parseBody<Payload>(req, secret, true)
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Firma inválida' }, { status: 401 })
    }
    if (!body?._type) {
      return NextResponse.json({ message: 'Falta _type en el cuerpo' }, { status: 400 })
    }

    const tags: string[] = []
    if (body._type === 'obra') {
      tags.push(TAGS.obras)
      if (body.slug) tags.push(TAGS.obra(body.slug))
    } else if (body._type === 'configuracion') {
      tags.push(TAGS.config)
    }
    for (const tag of tags) revalidateTag(tag, { expire: 0 })

    return NextResponse.json({ revalidated: tags, now: Date.now() })
  } catch (err) {
    console.error('[revalidate]', err)
    return NextResponse.json({ message: 'Error al revalidar' }, { status: 500 })
  }
}
