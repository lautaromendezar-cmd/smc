/**
 * TEXTOS PROVISORIOS DEL SITIO
 * ----------------------------
 * Todo el copy vive acá para reemplazarlo fácil cuando el cliente lo revise.
 * Lo que el cliente edita desde el panel (teléfono, WhatsApp, dirección,
 * "Quiénes somos", años de trayectoria, imágenes) viene de Sanity y estos
 * valores son solo el respaldo si el panel está vacío.
 *
 * Regla: no inventar cifras, premios, clientes, testimonios ni certificaciones.
 */

export const empresa = {
  nombre: 'SMC Arquitectura + Construcción',
  nombreCorto: 'SMC',
  nombreHistorico: 'San Martín Construcciones',
  lema: 'Diseñamos. Construimos. Hacemos realidad tus proyectos.',
  dominio: 'smconstrucciones.com.ar',
  // Del cartel de obra del cliente (logo-con-datos.png)
  profesional: {
    nombre: 'Arq. Mariela Nieto Saavedra',
    rol: 'Proyecto y dirección',
    matriculas: ['Mat. CAPBA N° 33291', 'Mat. Mun. N° 1819'],
  },
} as const

/** Respaldo de "Configuración del sitio" (Sanity). */
export const contactoRespaldo = {
  telefono: '11 4940-0955',
  whatsapp: '5491149400955',
  email: '', // pendiente: pedir al cliente
  direccion: 'San Martín 578, Capilla del Señor (CP 2812), Buenos Aires',
  direccionMapa: 'San Martín 578, Capilla del Señor, Buenos Aires, Argentina',
  instagram: 'https://www.instagram.com/smconstrucciones__/',
  instagramUsuario: '@smconstrucciones__',
  aniosTrayectoria: 30,
  quienesSomos:
    'Empezamos como San Martín Construcciones y hoy somos SMC Arquitectura + Construcción. Somos una empresa familiar con más de 30 años en la construcción: diseñamos, dirigimos y construimos desde Capilla del Señor para toda la región.\n\nSeguimos cada obra de cerca, desde el primer boceto hasta la entrega de llaves. Lo que más nos importa es terminar a tiempo, en forma y con la calidad que cada proyecto merece.',
}

export const nav = [
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#proceso', label: 'Proceso' },
  { href: '/obras', label: 'Obras' },
  { href: '/contacto', label: 'Contacto' },
] as const

export const hero = {
  bajada:
    'Más de 30 años diseñando y construyendo en Capilla del Señor y la región. Una empresa familiar que acompaña cada etapa.',
  ctaPrincipal: 'Coordiná una reunión',
  ctaSecundario: 'Ver obras',
}

export const nosotros = {
  numero: '01',
  eyebrow: 'Quiénes somos',
  titulo: 'Una empresa familiar que construye con la misma gente de siempre.',
  contadorEtiqueta: 'años de trayectoria',
  valoresTitulo: 'Cómo trabajamos',
  valores: [
    { titulo: 'Seguridad', texto: 'Obras ordenadas y prolijas, con cuidado en cada etapa y para cada persona que trabaja en ellas.' },
    { titulo: 'Confianza', texto: 'Lo que acordamos al empezar es lo que entregamos al terminar.' },
    { titulo: 'Respeto', texto: 'Por tu proyecto, por tu tiempo y por tu inversión.' },
  ],
  prioridad: 'Nuestra prioridad: obras terminadas en tiempo, forma y calidad.',
}

export const servicios = {
  numero: '02',
  eyebrow: 'Servicios',
  titulo: 'Todo lo que necesita una obra, con un solo equipo.',
  bajada: 'Podés sumarte en cualquier etapa: con una idea, con un plano o con una obra que hay que terminar.',
  items: [
    {
      icono: 'diseno',
      titulo: 'Diseño arquitectónico y anteproyectos',
      texto: 'Partimos de lo que necesitás, del terreno y del presupuesto para llegar a un anteproyecto claro, con el que puedas decidir.',
    },
    {
      icono: 'llave',
      titulo: 'Dirección y construcción llave en mano',
      texto: 'Nos hacemos cargo de la obra completa y te entregamos la llave. Un solo responsable de principio a fin.',
    },
    {
      icono: 'remodelacion',
      titulo: 'Remodelaciones y ampliaciones',
      texto: 'Sumamos metros, renovamos baños y cocinas y ponemos al día lo que ya tenés.',
    },
    {
      icono: 'vivienda',
      titulo: 'Viviendas familiares y rurales',
      texto: 'Casas para vivir en el pueblo o en el campo, con el estilo y la escala que pide cada lugar.',
    },
    {
      icono: 'industrial',
      titulo: 'Naves industriales y locales comerciales',
      texto: 'Estructura metálica, cerramientos y fachadas vidriadas para espacios de trabajo y de venta.',
    },
    {
      icono: 'publica',
      titulo: 'Obra pública',
      texto: 'Obras institucionales ejecutadas con la misma prolijidad que cualquier obra privada.',
    },
  ],
} as const

export const proceso = {
  numero: '03',
  eyebrow: 'Del plano a la obra terminada',
  titulo: 'Así crece una obra.',
  bajada: 'Una misma nave comercial, de la primera línea del plano a la noche de la inauguración.',
  etapas: [
    { titulo: 'Plano', texto: 'Diseño y documentación. Cada medida se define antes de empezar.' },
    { titulo: 'Estructura', texto: 'Fundaciones y estructura metálica: la base de todo lo que viene.' },
    { titulo: 'En ejecución', texto: 'Cerramientos, vidrios e instalaciones. La obra toma forma.' },
    { titulo: 'Terminada', texto: 'Terminaciones, iluminación y entrega de llaves.' },
  ],
}

export const tiposDeObra = [
  'Viviendas familiares',
  'Viviendas rurales',
  'Naves industriales',
  'Locales comerciales',
  'Obra pública',
  'Remodelaciones',
  'Ampliaciones',
  'Estructura metálica',
  'Fachadas vidriadas',
  'Baños y terminaciones',
]

export const obrasHome = {
  numero: '04',
  eyebrow: 'Obras',
  titulo: 'Obras que ya son parte del paisaje.',
  verTodas: 'Ver todas las obras',
  vacio: {
    titulo: 'Estamos cargando nuestras obras.',
    texto: 'Muy pronto vas a poder recorrerlas acá. Mientras tanto, las publicamos en Instagram.',
    cta: 'Ver en Instagram',
  },
}

export const obrasPagina = {
  titulo: 'Obras',
  bajada: 'Obras terminadas y en ejecución. Filtrá por estado o por tipo de obra.',
  filtroEstado: 'Estado',
  filtroCategoria: 'Tipo de obra',
  todas: 'Todas',
  sinResultados: 'No hay obras con esos filtros.',
  limpiar: 'Ver todas',
}

export const obraDetalle = {
  ficha: 'Ficha de obra',
  estado: 'Estado',
  categoria: 'Tipo de obra',
  ubicacion: 'Ubicación',
  anio: 'Año',
  galeria: 'Galería',
  cta: 'Quiero un proyecto así',
  ctaTexto: '¿Te gustaría algo parecido? Escribinos y lo charlamos.',
  volver: 'Todas las obras',
}

export const ctaFinal = {
  titulo: '¿Tenés un proyecto en mente?',
  texto: 'Contanos qué querés construir y coordinamos una reunión para verlo juntos.',
  cta: 'Escribinos por WhatsApp',
}

export const contacto = {
  numero: '05',
  eyebrow: 'Contacto',
  titulo: 'Vení a conocernos o escribinos.',
  direccion: 'Dirección',
  telefono: 'Teléfono / WhatsApp',
  email: 'Email',
  instagram: 'Instagram',
  whatsappCta: 'Escribinos por WhatsApp',
  llamar: 'Llamar',
  mapaTitulo: 'Mapa: San Martín 578, Capilla del Señor',
}

export const whatsappMensajes = {
  general: 'Hola, quiero coordinar una reunión para hablar de un proyecto.',
  obra: (titulo: string) => `Hola, vi la obra "${titulo}" en la web y quiero un proyecto así.`,
}

export const noEncontrada = {
  titulo: 'Esta página no está en el plano.',
  texto: 'Puede que la dirección haya cambiado o que la página ya no exista.',
  cta: 'Volver al inicio',
}
