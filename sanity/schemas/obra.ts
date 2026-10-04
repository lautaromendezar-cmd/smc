import { defineArrayMember, defineField, defineType } from 'sanity'
import { Building2 } from 'lucide-react'
import { CATEGORIAS, ESTADOS, estadoLabel, categoriaLabel } from './opciones'

function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\[ejemplo\]\s*/g, 'ejemplo-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

export const obra = defineType({
  name: 'obra',
  title: 'Obra',
  type: 'document',
  icon: Building2,
  groups: [
    { name: 'datos', title: 'Datos', default: true },
    { name: 'fotos', title: 'Fotos' },
    { name: 'home', title: 'Página de inicio' },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nombre de la obra',
      type: 'string',
      group: 'datos',
      description: 'Ej.: "Nave comercial en Ruta 8" o "Casa de campo en Los Cardales".',
      validation: (r) => r.required().error('La obra necesita un nombre.').max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección web',
      type: 'slug',
      group: 'datos',
      description: 'Se completa sola con el botón "Generar". Es la parte final del link de la obra.',
      options: { source: 'titulo', maxLength: 96, slugify },
      validation: (r) => r.required().error('Tocá "Generar" para crear la dirección web.'),
    }),
    defineField({
      name: 'estado',
      title: 'Estado',
      type: 'string',
      group: 'datos',
      description: 'Cuando la obra se termina, cambiá esto a "Terminada" y publicá.',
      options: { list: [...ESTADOS], layout: 'radio', direction: 'horizontal' },
      validation: (r) => r.required().error('Elegí si la obra está en ejecución o terminada.'),
    }),
    defineField({
      name: 'categoria',
      title: 'Tipo de obra',
      type: 'string',
      group: 'datos',
      options: { list: [...CATEGORIAS] },
      validation: (r) => r.required().error('Elegí el tipo de obra.'),
    }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      type: 'string',
      group: 'datos',
      description: 'Localidad o zona. Ej.: "Capilla del Señor". No hace falta la dirección exacta.',
    }),
    defineField({
      name: 'anio',
      title: 'Año',
      type: 'number',
      group: 'datos',
      description: 'Opcional. Año de terminación (o de inicio si está en ejecución).',
      validation: (r) => r.integer().min(1980).max(2100).warning('Revisá el año.'),
    }),
    defineField({
      name: 'descripcionCorta',
      title: 'Descripción corta',
      type: 'text',
      rows: 3,
      group: 'datos',
      description: 'Una o dos frases. Se ve en las tarjetas del listado. Máximo 200 caracteres.',
      validation: (r) => r.max(200).error('Máximo 200 caracteres.'),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción completa',
      type: 'array',
      group: 'datos',
      description: 'Opcional. Contá cómo fue la obra: qué se hizo, materiales, desafíos.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Subtítulo', value: 'h3' },
          ],
          lists: [{ title: 'Lista', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Foto principal',
      type: 'imagenConAlt',
      group: 'fotos',
      description: 'La foto de portada. Usá la mejor foto de la obra, horizontal o vertical.',
      validation: (r) => r.required().error('Subí una foto principal.'),
    }),
    defineField({
      name: 'galeria',
      title: 'Galería de fotos',
      type: 'array',
      group: 'fotos',
      description: 'Podés subir varias juntas. Para cambiar el orden, arrastralas desde el ícono de la izquierda.',
      of: [defineArrayMember({ type: 'imagenConAlt' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'destacada',
      title: 'Destacar en la página de inicio',
      type: 'boolean',
      group: 'home',
      description: 'Si está activado, la obra aparece en "Obras" de la página de inicio (se muestran hasta 6).',
      initialValue: false,
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      group: 'home',
      description: 'Número para ordenar las obras: la 1 va primero. Si lo dejás vacío, va al final.',
      validation: (r) => r.integer().min(0),
    }),
  ],
  orderings: [
    { title: 'Orden', name: 'ordenAsc', by: [{ field: 'orden', direction: 'asc' }] },
    { title: 'Más nuevas', name: 'creadaDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titulo', estado: 'estado', categoria: 'categoria', media: 'imagenPrincipal', destacada: 'destacada' },
    prepare({ title, estado, categoria, media, destacada }) {
      const partes = [estadoLabel(estado), categoriaLabel(categoria)].filter(Boolean)
      return {
        title: title || 'Obra sin nombre',
        subtitle: `${destacada ? '★ ' : ''}${partes.join(' · ')}`,
        media,
      }
    },
  },
})
