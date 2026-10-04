import sharp from 'sharp'

/**
 * Mejora suave para frames sacados de videos de Instagram: baja el ruido de
 * compresión (mediana 3), recupera nitidez y, en las nocturnas, levanta un
 * poco las sombras sin quemar las luces. Devuelve un JPEG de alta calidad.
 */
export async function mejorar(input, { noche = false } = {}) {
  let img = sharp(input).median(3).sharpen({ sigma: 0.8, m1: 0.6, m2: 2 })
  if (noche) img = img.gamma(2.2, 2.0).modulate({ brightness: 1.06, saturation: 1.05 })
  else img = img.modulate({ saturation: 1.03 })
  return img.jpeg({ quality: 92, mozjpeg: true }).toBuffer()
}
