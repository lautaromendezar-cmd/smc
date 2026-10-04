'use client'

/**
 * Studio embebido en /studio. Todo en español y pensado para alguien no técnico:
 * listas separadas por estado, un único documento de configuración y ayuda en
 * cada campo.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { esESLocale } from '@sanity/locale-es-es'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, SINGLETONS } from './sanity/schemas'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'smc',
  title: 'SMC · Panel de obras',
  basePath: '/studio',
  projectId: projectId || 'sin-configurar',
  dataset,
  plugins: [
    structureTool({ structure, title: 'Contenido' }),
    esESLocale(),
    // Vision (consultas GROQ) solo en desarrollo
    ...(process.env.NODE_ENV === 'development' ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter((t) => !SINGLETONS.includes(t.schemaType)),
      {
        id: 'obra-ejecucion',
        title: 'Obra en ejecución',
        schemaType: 'obra',
        value: { estado: 'ejecucion', destacada: false },
      },
      {
        id: 'obra-terminada',
        title: 'Obra terminada',
        schemaType: 'obra',
        value: { estado: 'terminada', destacada: false },
      },
    ],
  },
  document: {
    // el botón "+" global no ofrece crear otra configuración
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((t) => !SINGLETONS.includes(t.templateId)) : prev,
    // la configuración no se puede borrar ni duplicar
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
})
