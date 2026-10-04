/** Valores compartidos entre el Studio, las consultas y el front. */

export const ESTADOS = [
  { title: 'En ejecución', value: 'ejecucion' },
  { title: 'Terminada', value: 'terminada' },
] as const

export const CATEGORIAS = [
  { title: 'Vivienda familiar', value: 'vivienda-familiar' },
  { title: 'Vivienda rural', value: 'vivienda-rural' },
  { title: 'Industrial', value: 'industrial' },
  { title: 'Comercial', value: 'comercial' },
  { title: 'Obra pública', value: 'obra-publica' },
  { title: 'Remodelación / ampliación', value: 'remodelacion' },
] as const

export type Estado = (typeof ESTADOS)[number]['value']
export type Categoria = (typeof CATEGORIAS)[number]['value']

export const estadoLabel = (v?: string) => ESTADOS.find((e) => e.value === v)?.title ?? ''
export const categoriaLabel = (v?: string) => CATEGORIAS.find((c) => c.value === v)?.title ?? ''
