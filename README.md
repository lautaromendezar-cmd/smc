# SMC Arquitectura + Construcción — sitio institucional

Next.js 16 (App Router) + TypeScript + Tailwind v4 + Sanity (Studio embebido en `/studio`) + GSAP + Lenis.
Sin costos fijos: Sanity free + Vercel. Todo el copy provisorio está en `content/textos.ts`.

- Producción (vista previa, noindex): https://smc-topaz.vercel.app
- Panel: https://smc-topaz.vercel.app/studio
- Repo: https://github.com/lautaromendezar-cmd/smc — proyecto Vercel `lautaro-mendez-s-projects/smc`

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar
npm run dev                  # http://localhost:3000  ·  /studio
npm run build && npm start   # build de producción
npm run seed                 # carga configuración + obras [EJEMPLO] en Sanity
```

Sin `NEXT_PUBLIC_SANITY_PROJECT_ID` el sitio funciona igual con los respaldos locales
(`content/textos.ts`, `public/img`, `public/video`) y muestra el estado vacío en obras.

## Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Vercel + local | proyecto de Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Vercel + local | `production` |
| `NEXT_PUBLIC_SITE_URL` | Vercel + local | canonical, sitemap, OG (sin barra final) |
| `NEXT_PUBLIC_SITE_NOINDEX` | Vercel | `true` = noindex + `robots.txt` bloqueado + `X-Robots-Tag` |
| `SANITY_REVALIDATE_SECRET` | Vercel + webhook de Sanity | firma del webhook |
| `SANITY_API_WRITE_TOKEN` | **solo `.env.local`** | `npm run seed`. Nunca en Vercel |

Para salir a producción: dominio en Vercel, `NEXT_PUBLIC_SITE_URL=https://smconstrucciones.com.ar`,
`NEXT_PUBLIC_SITE_NOINDEX=false` y redeploy.

## Sanity

- Esquemas en `sanity/schemas`: `obra` y el singleton `configuracion` (id fijo `configuracion`,
  sin "crear" ni "borrar"). Estructura del menú en `sanity/structure.ts`: Obras en ejecución,
  Obras terminadas, Todas, Configuración. Plantillas que precargan el estado.
- Studio en español (`@sanity/locale-es-es`). Vision solo en `NODE_ENV=development`.
- **CORS**: `http://localhost:3000` y la URL de Vercel/dominio, con credenciales.
- **Webhook** (sanity.io/manage → API → Webhooks):
  - URL `https://<dominio>/api/revalidate`, método POST, dataset `production`
  - Filtro `_type in ["obra", "configuracion"]`, proyección `{_type, "slug": slug.current}`
  - Disparadores: crear, actualizar, borrar. Secret = `SANITY_REVALIDATE_SECRET`
- Caché: `sanityFetch` usa `force-cache` + tags (`config`, `obra`, `obra:<slug>`);
  el webhook llama `revalidateTag(tag, { expire: 0 })`: la visita siguiente ya ve el cambio.

## Imágenes y material

`/material` no va al repo. Pipeline (todo reproducible):

```bash
python scripts/extraer-frames.py      # videos de material/instagram -> un frame por escena
python scripts/curar-frames.py        # renombra los buenos y descarta duplicados/transiciones
python scripts/cortar-logo.py         # logo.jpg -> public/brand (alfa sin redibujar) + geometría
node scripts/optimizar-imagenes.mjs   # material/generadas -> public/img (WebP < 300 KB), OG, íconos
bash scripts/video-loop.sh in.mp4 public/video/hero.mp4 1920   # loop sin salto, H.264 faststart
```

- Todo lo generado con IA está marcado **[EJEMPLO]** (alt, títulos y comentarios). Hero,
  secuencia de obra, cierre y videos: Nano Banana Pro / MiniMax H3 a partir de los frames
  reales de la nave. Las 3 etapas de la secuencia comparten cámara para que los barridos calcen.
- Imágenes de Sanity: loader propio (`sanity/lib/image.ts`) contra el CDN de Sanity con
  hotspot/crop y `auto=format`. Locales: optimizador de Next (AVIF/WebP).

## Animación

- **Preloader** (`components/motion/Preloader.tsx` + CSS crítico en `app/layout.tsx`): la
  entrada del logo es CSS desde el primer pintado (no espera al JS); GSAP solo hace la apertura
  y llama a los cues del hero (`lib/intro.ts`). Solo primera visita de la sesión
  (`sessionStorage`), respaldo a los 4,5 s si el JS no carga, sin preloader con reduced-motion.
- El logo raster se corta en piezas (`content/logo-geometria.json`): la línea cae en el 50 %
  de la pantalla y ahí se parte. Con un SVG del logo se puede reemplazar por vectores.
- **Del plano a la obra**: `components/home/PlanoAObra.tsx` (pin + scrub) y `PlanoSVG.tsx`
  (fijo, medidas ilustrativas). Con reduced-motion: grilla estática por CSS.
- Trampa conocida: no ocultar con clases `translate-*` de Tailwind algo que después anima
  GSAP con `yPercent` (GSAP lee la propiedad `translate` como px en `y`).

## Deploy

El repo no está conectado a Vercel por Git: se publica con la CLI.

```bash
vercel deploy --prod --yes --scope lautaro-mendez-s-projects
```

`vercel.json` fija `framework: nextjs` (sin eso el proyecto buscaba `dist`).
