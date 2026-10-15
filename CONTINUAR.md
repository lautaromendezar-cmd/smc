# Continuar: dominio y correo (15/10/2026)

## Decisión

- El sitio **sigue en el Vercel de Lautaro** (proyecto `lautaro-mendez-s-projects/smc`), tal como está.
- La clienta contrató **DonWeb, Web Hosting Emprendedor**, que se usa **solo para el correo** (10 casillas).
- El dominio `smconstrucciones.com.ar` está en nic.ar a nombre de Mariela Lorena Nieto Saavedra. **Vence el 02/01/2027**: recordarle que lo renueve.

## Ya hecho

- `smconstrucciones.com.ar` y `www.smconstrucciones.com.ar` agregados al proyecto en Vercel (verificados, esperando DNS).

## En espera

DonWeb todavía no habilita la zona DNS del plan contratado. Hasta que aparezca, **no delegar en nic.ar**: si se delega antes, el sitio y el correo se caen.

## Pasos cuando DonWeb habilite la zona

1. **DonWeb**: copiar los nameservers que muestra el panel (no usar unos de memoria).
2. **nic.ar** (Trámites a Distancia, con la clave fiscal de la clienta): Mis dominios → **DELEGAR** (no "Transferir").
   Borrar `solar.dns-parking.com` y `lunar.dns-parking.com`, y cargar los nameservers de DonWeb.
3. **Zona DNS en DonWeb**: reemplazar (no duplicar) los registros del sitio:

   | Tipo  | Nombre | Valor                                 |
   |-------|--------|---------------------------------------|
   | A     | @      | `216.150.1.1`                         |
   | A     | @      | `216.150.16.1`                        |
   | CNAME | www    | `6b8590a52909fdf4.vercel-dns-016.com` |

   **No tocar** MX, TXT (SPF/DKIM), `mail` ni `webmail`: son los del correo.
   Si los valores de Vercel cambian, se ven con
   `npx vercel domains verify smconstrucciones.com.ar --scope lautaro-mendez-s-projects`.
4. **Casillas**: crearlas desde el panel de DonWeb.

## Cuando el dominio ya responda (lo hace Lautaro)

- En Vercel: `NEXT_PUBLIC_SITE_NOINDEX=false` y `NEXT_PUBLIC_SITE_URL=https://smconstrucciones.com.ar`.
- En Sanity: sumar `https://smconstrucciones.com.ar` (y www) a CORS, con credenciales para el Studio en `/studio`, y apuntar el webhook a `https://smconstrucciones.com.ar/api/revalidate`.
- Redeploy: `vercel deploy --prod --yes --scope lautaro-mendez-s-projects` (el push no publica).
- Probar: sitio con https en ambas URLs, el panel publica y se actualiza, y un mail de ida y vuelta (que no caiga en spam).
