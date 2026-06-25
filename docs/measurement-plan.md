# Measurement Plan — aleconomies.com

Fuente de verdad de eventos del sitio para GA4 + Meta CAPI (Adsmurai).

## Convenciones

- Todos los eventos se pushean al `window.dataLayer` desde el código.
- GTM consume el evento por nombre y lo despacha a GA4 + Adsmurai OneTag.
- El OneTag de Adsmurai envía simultáneamente Browser Pixel + Server CAPI (deduplicado por `event_id` auto-generado).
- Stack de mapping: dataLayer → GTM Custom Event → tag por destino.

## Tabla de eventos

| dataLayer event         | Cuándo dispara                                                  | Parámetros relevantes                              | Meta event (Adsmurai)  | GA4 event             |
|-------------------------|-----------------------------------------------------------------|----------------------------------------------------|------------------------|-----------------------|
| `lead_magnet_submit`    | Form de lead magnet enviado con éxito (`LeadMagnetForm`)        | `lead_magnet_slug`, `returning?` (bool)            | `Lead`                 | `generate_lead`       |
| `form_start`            | Primera vez que el usuario monta el form de calificación        | `form_name: 'calificacion'`                        | —                      | `form_start`          |
| `form_step_complete`    | Avanza de paso en el form de calificación (una vez por paso)    | `form_name`, `step` (int), `step_id`               | —                      | `form_step_complete`  |
| `form_submit`           | Llega al cierre del form de calificación (lead enviado a GHL)   | `form_name`, `form_result`, `lead_etiqueta`        | `Lead`                 | `generate_lead`       |
| `form_abandon`          | Cierra pestaña antes de terminar el form de calificación        | `form_name`, `step` (int)                          | —                      | `form_abandon`        |
| `appointment_booked`    | Cita confirmada en GHL desde el CustomCalendar                  | `appointment_id`, `appointment_start` (ISO)        | `Schedule`             | `appointment_booked`  |
| `resource_open`         | Click en card de recurso (audiolibros, ebooks)                  | `resource`                                         | `ViewContent`          | `select_content`      |
| `audiolibro_click`      | Click en un audiolibro específico de la lista                   | `audiolibro_id`, `audiolibro_titulo`               | —                      | `select_item`         |

## Eventos pageview

- `PageView` de Meta y `page_view` de GA4 se disparan automáticamente con el OneTag (trigger `All Pages`) y la config de GA4 — no requieren push manual al dataLayer.

## Notas por evento

### `lead_magnet_submit`
- `lead_magnet_slug`: identificador del recurso (ej. `presupuesto-cero`, `jubilacion`, etc.).
- `returning: true` cuando el usuario ya tenía datos guardados (cookie 30d).
- Es el evento **Lead** principal para campañas de lead magnet en Meta.

### `form_submit` (calificación)
- `form_result`: `'calificado'` cuando el lead califica para asesoría, `'cierre_educativo'` cuando se redirige a recursos.
- `lead_etiqueta`: etiqueta semántica del lead asignada por `calificarLead()` (ej. `'cliente-ideal'`, `'no-listo'`).
- Es el evento **Lead** principal para campañas de calificación / asesoría.
- El **mini-form `/aplicar`** (form corto) reusa este mismo evento con
  `form_name: 'calificacion-corta'`. Dispara los mismos tags (Meta `Lead` +
  GA4 `generate_lead`) porque el trigger `CE — form_submit` matchea por nombre
  de evento, no por `form_name` — **no requiere cambios en GTM**.
- Opcional: para separar form corto vs. largo en reportes de GA4, agregar el
  parámetro `form_name` al tag `GA4 — generate_lead (calification)` (`{{DLV - form_name}}`).
  Para contar Leads y optimizar Meta no hace falta.

### `form_start`
- Se dispara desde `/aplicar` (mini-form corto) con `form_name: 'calificacion-corta'` y desde el form largo de calificación con `form_name: 'calificacion'`.

### `appointment_booked`
- El evento de **más valor**: significa que el lead reservó una llamada real.
- En Meta mapea a `Schedule` (evento estándar).
- En GHL ya queda registrado por el endpoint `/api/calendar/book`.

## Advanced Matching / EMQ

Para subir el Event Match Quality cuando hay form submit con email/phone:

- LeadMagnetForm captura `name`, `email`, `phone?` — pueden pasarse al OneTag via variables del dataLayer.
- CalificationForm captura email, phone, nombre completo.
- **Adsmurai hashea SHA-256 automáticamente** — no pasar valores ya hasheados.

Para activarlo: en el OneTag de cada evento Lead, habilitar campos `em` (email), `ph` (phone), `fn` (first name), `ln` (last name) y mapearlos a variables de dataLayer si los tienes capturados al momento del evento.

## Offline conversions (futuro)

Cuando un lead calificado se convierte en cliente real:
- Enviar evento `Purchase` o custom `BecameClient` vía CAPI offline desde GHL.
- Esto le permite a Meta optimizar por clientes, no por leads.
- Implementación: workflow en GHL que llamó CAPI directo, o endpoint `/api/meta-offline` que reciba webhooks de GHL.
