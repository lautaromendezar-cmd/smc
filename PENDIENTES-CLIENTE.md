# Qué falta pedirle al cliente

Ordenado por impacto. Todo lo marcado **[EJEMPLO]** en el sitio hoy es provisorio.

## Imprescindible antes de publicar

1. **Fotos reales en alta calidad, archivos originales** (no capturas de Instagram ni de WhatsApp):
   - **Portada**: 1 foto horizontal de una obra emblemática, de noche o al atardecer, con luces encendidas. Hoy hay una regenerada con IA a partir de la nave.
   - **Secuencia de obra**: 3 fotos verticales de **la misma obra**, desde el mismo lugar: estructura, en ejecución y terminada. Si no tienen la misma toma, sirven 3 fotos parecidas.
   - **Obras**: por cada obra que quieran mostrar, de 1 a 10 fotos, con nombre, localidad, año y tipo (vivienda familiar o rural, industrial, comercial, obra pública, remodelación).
2. **Email de contacto**. Hoy no se muestra ninguno.
3. **Revisión de textos** (`content/textos.ts` y "Quiénes somos" en el panel): títulos, servicios y valores son redacción nuestra a partir de lo que pasaron.
4. **Confirmar el uso de los datos de la arquitecta**: "Arq. Mariela Nieto Saavedra, Mat. CAPBA N° 33291, Mat. Mun. N° 1819" figura en el footer y en Quiénes somos. Los sacamos del cartel de obra.
5. **Cuenta para el panel**: el email con el que la persona que va a cargar las obras entra a Sanity.

## Recomendado

6. **Logo vectorial (SVG, PDF o AI)**. Hoy se usa un JPG de 1098 px recortado: se ve bien, pero en pantallas grandes el preloader queda algo blando.
7. **Video real de obra** para la portada (opcional): de 6 a 10 s, horizontal, estable, sin gente. Si no hay, queda el de ejemplo o solo la foto.
8. **Métricas reales**, si las quieren mostrar (obras terminadas, m² construidos, etc.). Hoy solo figura "+30 años", que es dato de ellos.
9. **Horario de atención** y si reciben visitas en San Martín 578 o solo con turno.

## Para salir a producción (técnico, lo hacemos nosotros)

- ~~DNS de **smconstrucciones.com.ar**~~: hecho el 16/10 (sitio en Vercel, correo en DonWeb).
- ~~URL definitiva en `NEXT_PUBLIC_SITE_URL` y CORS de Sanity~~: hecho el 16/10.
- `NEXT_PUBLIC_SITE_NOINDEX=false` + redeploy: cuando estén las obras reales.
- ~~Cuenta del panel para el cliente~~: Alfredo es editor (info@) desde el 16/10, con manual en `manual-panel/`.
- Borrar las obras e imágenes [EJEMPLO] cuando estén las reales.
