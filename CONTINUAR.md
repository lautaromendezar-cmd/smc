# Continuar: dominio y correo (15/10/2026)

## Decisión

- El sitio **sigue en el Vercel de Lautaro** (proyecto `lautaro-mendez-s-projects/smc`), tal como está.
- La clienta contrató **DonWeb, Web Hosting Emprendedor**, que se usa **solo para el correo** (10 casillas).
- El dominio `smconstrucciones.com.ar` está en nic.ar a nombre de Mariela Lorena Nieto Saavedra. **Vence el 02/01/2027**: recordarle que lo renueve.

## Ya hecho

- `smconstrucciones.com.ar` y `www.smconstrucciones.com.ar` agregados al proyecto en Vercel (verificados, esperando DNS).
- **Delegado en nic.ar a `ns1.donweb.com` / `ns2.donweb.com`** (15/10, publicado por nic.ar a las 21:11).
  Antes estaba en Hostinger (`solar`/`lunar.dns-parking.com`) con correo ahí (MX `mx1/mx2.hostinger.com`).
  La clienta sabe que ese correo se corta: anotó las direcciones y usa otro mail mientras tanto.

## En espera

DonWeb todavía no creó la zona (ns1/ns2.donweb.com responden "Query refused"), así que el dominio no resuelve.
Su soporte dijo que, pasada la caché, se conecta desde **Mis Servicios → Gestionar → Dominios configurados** (hosting #6514891).
Ojo: los servidores de Hostinger publicaban sus NS con TTL de **24 h**, así que algunos resolvers (Google, 8.8.8.8)
siguen mostrando `dns-parking` hasta ~16/10 a la noche aunque nic.ar ya delegue a DonWeb; Cloudflare ya ve DonWeb.
Si DonWeb sigue diciendo "dominio en uso" o "delegación parcial", pedirle al soporte que lo vincule a mano al hosting.
**16/10 10 h**: la propagación ya terminó (Google, Cloudflare, Quad9 y OpenDNS siguen a DonWeb y dan SERVFAIL; Hostinger
todavía contesta, o sea que nadie lo usa). "Conectar mi dominio" falla con "No se encontró el registro solicitado"
porque la zona no existe. La IA del chat de DonWeb dice "esperá la propagación": está equivocada. **Ticket abierto
pidiendo que creen la zona a mano.** Para chequear: `nslookup -type=SOA smconstrucciones.com.ar ns1.donweb.com`
(mientras diga "Query refused", sigue sin zona).
Con eso, seguir desde el paso 3. Las casillas a recrear son las que anotó la clienta; si quiere los mails viejos, bajarlos de Hostinger antes de que venza esa cuenta.

## Pasos (1 y 2 ya hechos)

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
