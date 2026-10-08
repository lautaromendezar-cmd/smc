import type { StructureResolver } from 'sanity/structure'
import { Box, CheckCircle2, HardHat, Layers, Settings } from 'lucide-react'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Panel de SMC')
    .items([
      S.listItem()
        .title('Obras en ejecución')
        .icon(HardHat)
        .child(
          S.documentList()
            .title('Obras en ejecución')
            .schemaType('obra')
            .filter('_type == "obra" && estado == "ejecucion"')
            .defaultOrdering([{ field: 'orden', direction: 'asc' }])
            .initialValueTemplates([S.initialValueTemplateItem('obra-ejecucion')]),
        ),
      S.listItem()
        .title('Obras terminadas')
        .icon(CheckCircle2)
        .child(
          S.documentList()
            .title('Obras terminadas')
            .schemaType('obra')
            .filter('_type == "obra" && estado == "terminada"')
            .defaultOrdering([{ field: 'orden', direction: 'asc' }])
            .initialValueTemplates([S.initialValueTemplateItem('obra-terminada')]),
        ),
      S.listItem()
        .title('Renders')
        .icon(Box)
        .child(
          S.documentList()
            .title('Renders')
            .schemaType('obra')
            .filter('_type == "obra" && estado == "render"')
            .defaultOrdering([{ field: 'orden', direction: 'asc' }])
            .initialValueTemplates([S.initialValueTemplateItem('obra-render')]),
        ),
      S.listItem()
        .title('Todas las obras')
        .icon(Layers)
        .child(
          S.documentTypeList('obra')
            .title('Todas las obras')
            .defaultOrdering([{ field: 'orden', direction: 'asc' }]),
        ),
      S.divider(),
      // Singleton: un único documento con id fijo, no se pueden crear duplicados
      S.listItem()
        .title('Configuración del sitio')
        .id('configuracion')
        .icon(Settings)
        .child(S.document().schemaType('configuracion').documentId('configuracion').title('Configuración del sitio')),
    ])
