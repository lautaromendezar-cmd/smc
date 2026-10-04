import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

export const configuracion = defineType({
  name: 'configuracion',
  title: 'Configuración del sitio',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'contacto', title: 'Contacto', default: true },
    { name: 'empresa', title: 'Empresa' },
    { name: 'imagenes', title: 'Imágenes' },
  ],
  fields: [
    defineField({
      name: 'telefono',
      title: 'Teléfono',
      type: 'string',
      group: 'contacto',
      description: 'Como querés que se lea en la web. Ej.: 11 4940-0955',
      validation: (r) => r.required().error('Falta el teléfono.'),
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      group: 'contacto',
      description:
        'Formato internacional, solo números, sin espacios ni "+". Para Argentina: 549 + característica sin 0 + número sin 15. Ej.: 5491149400955',
      validation: (r) =>
        r
          .required()
          .error('Falta el número de WhatsApp.')
          .regex(/^\d{10,15}$/, { name: 'solo números' })
          .error('Solo números, sin espacios, guiones ni "+". Ej.: 5491149400955'),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contacto',
      description: 'Opcional. Si lo dejás vacío no se muestra.',
      validation: (r) =>
        r.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email' }).error('Revisá el email: parece incompleto.'),
    }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'string',
      group: 'contacto',
      description: 'Ej.: San Martín 578, Capilla del Señor (CP 2812), Buenos Aires',
      validation: (r) => r.required().error('Falta la dirección.'),
    }),
    defineField({
      name: 'instagram',
      title: 'Link de Instagram',
      type: 'url',
      group: 'contacto',
      description: 'El link completo del perfil. Ej.: https://www.instagram.com/smconstrucciones__/',
      validation: (r) => r.uri({ scheme: ['https'] }).error('Pegá el link completo, empezando con https://'),
    }),
    defineField({
      name: 'quienesSomos',
      title: 'Texto de "Quiénes somos"',
      type: 'text',
      rows: 8,
      group: 'empresa',
      description: 'Dos o tres párrafos. Dejá una línea en blanco para separar párrafos.',
      validation: (r) => r.required().error('Escribí el texto de "Quiénes somos".').max(1200),
    }),
    defineField({
      name: 'aniosTrayectoria',
      title: 'Años de trayectoria',
      type: 'number',
      group: 'empresa',
      description: 'Se muestra como "+30 años". Actualizalo cuando corresponda.',
      validation: (r) => r.required().integer().min(1).max(150),
    }),
    defineField({
      name: 'heroImagen',
      title: 'Imagen principal de la portada',
      type: 'imagenConAlt',
      group: 'imagenes',
      description:
        'La foto grande del inicio. Ideal: horizontal, de noche o al atardecer, de al menos 2000 px de ancho. Usá el punto de enfoque para marcar lo importante.',
      validation: (r) => r.required().error('Subí la imagen de la portada.'),
    }),
    defineField({
      name: 'heroImagenMovil',
      title: 'Imagen de la portada para celular (opcional)',
      type: 'imagenConAlt',
      group: 'imagenes',
      description: 'Una foto vertical para celulares. Si la dejás vacía, se recorta la imagen principal.',
    }),
    defineField({
      name: 'secuencia',
      title: 'Secuencia de obra',
      type: 'object',
      group: 'imagenes',
      description:
        'Las 3 fotos de la sección "Del plano a la obra terminada". Lo ideal es que sean de la MISMA obra y tomadas desde un ángulo parecido. Formato vertical.',
      fields: [
        defineField({
          name: 'estructura',
          title: '1. Estructura',
          type: 'imagenConAlt',
          description: 'La obra con la estructura a la vista.',
          validation: (r) => r.required().error('Falta la foto de estructura.'),
        }),
        defineField({
          name: 'ejecucion',
          title: '2. En ejecución',
          type: 'imagenConAlt',
          description: 'Con cerramientos, vidrios o terminaciones en proceso.',
          validation: (r) => r.required().error('Falta la foto en ejecución.'),
        }),
        defineField({
          name: 'terminada',
          title: '3. Terminada',
          type: 'imagenConAlt',
          description: 'La obra terminada. Si es de noche e iluminada, mejor.',
          validation: (r) => r.required().error('Falta la foto de la obra terminada.'),
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Configuración del sitio' }) },
})
