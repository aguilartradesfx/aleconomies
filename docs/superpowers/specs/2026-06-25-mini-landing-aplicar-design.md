# Mini-landing de captura `/aplicar` — Diseño

**Fecha:** 2026-06-25
**Estado:** Aprobado para implementación

## Objetivo

Una landing de una sola pantalla, más pequeña que `/asesoria`, cuyo único contenido
es un formulario para capturar contacto + 3 calificadores. Manda el lead al **mismo
pipeline que el formulario largo** (`/api/lead` → GoHighLevel) y dispara el mismo
evento `form_submit`, de modo que queda trazado en GTM → GA4 + Meta sin cambios
obligatorios en Tag Manager.

## Decisión de tracking (verificada)

El trigger `CE — form_submit` (triggerId 12 en `docs/gtm-container.json`) matchea por
**nombre de evento**, no por `form_name`. De ese trigger cuelgan el tag GA4
`generate_lead (calification)` y el tag `Adsmurai | Lead (calificacion)`
(ver `docs/gtm-setup-guide.md`, Paso 3).

→ Si el mini-form empuja `{ event: 'form_submit', ... }`, **dispara Meta `Lead` y
GA4 `generate_lead` automáticamente. Cero cambios en GTM.**

**Opcional (no obligatorio):** para distinguir form corto vs largo en reportes de
GA4, agregar el parámetro `form_name` al tag `GA4 — generate_lead (calification)`.
Para contar Leads y optimizar campañas Meta no hace falta.

## Arquitectura y reutilización

- **Página nueva:** `app/aplicar/page.tsx` — `robots: { index: false, follow: true }`
  (igual que `/asesoria` y `/agendar`), metadata propia, sin `Nav`/`Footer`. Card
  centrada sobre el fondo glass del sitio (`BackgroundBlobs` ya vive en el layout
  raíz) con un wordmark chico.
- **Componente nuevo:** `components/ShortForm/ShortForm.tsx` (`'use client'`) — el
  formulario de una pantalla + el cierre inline.
- **Reusa sin modificar:** `calificarLead`, `submitLeadToGHL`, `mapFormToCustomFields`,
  `CierreCalificado`, `CierreEducativo`, `CustomCalendar`, `PhoneInput`, `GlassCard`,
  y las clases CSS `recurso-form-*` / `calif-*` de `app/globals.css`.

### Flujo de datos

```
Usuario llena la pantalla
  → build FormState parcial: { ...INITIAL_FORM_STATE, nombre, apellidos,
       telefono, correo, ingresos, capitalDisponible, rangoCapital,
       solvencia, consentimientoDatos: true }
  → resultado = calificarLead(form)
  → dataLayer.push({ event: 'form_submit', form_name: 'calificacion-corta',
       form_result, lead_etiqueta })   // antes de cualquier render de cierre
  → POST /api/lead { form, resultado, source: 'aplicar' }  → contactId
  → render del cierre inline según resultado
```

El `mapFormToCustomFields` ya descarta nulos/vacíos, así que los campos no
preguntados (deudas, perfil inversor, etc.) simplemente no se envían a GHL.

## Campos del formulario (una pantalla)

| Campo UI | FormState | Notas |
|---|---|---|
| Nombre | `nombre` | requerido |
| Apellidos | `apellidos` | requerido |
| Teléfono | `telefono` | `PhoneInput`, requerido |
| Correo | `correo` | requerido, validación email |
| Ingresos mensuales | `ingresos` (A–F) | select, `ingresosMap` |
| Capital disponible | `capitalDisponible` + `rangoCapital` | un select: "Empiezo desde cero" → `capitalDisponible='B'`; cada rango → `capitalDisponible='A'` + `rangoCapital` A–D |
| Solvencia para asesoría | `solvencia` (A/B) | radio/select |
| Consentimiento Ley 8968 | `consentimientoDatos` | checkbox obligatorio |

## Lógica de calificación y cierre

Reusa `calificarLead()` tal cual sobre el form parcial:

- **Califica** (no cae en hard-stop) → `CierreCalificado` con `contactId` + `leadName`
  y `decisorRequerido={false}` → el usuario agenda inline con `CustomCalendar`
  (dispara `appointment_booked`).
- **Educativo** (`ingresos = A` o `solvencia = B`) → `CierreEducativo`.

Con solo 3 calificadores la etiqueta es más gruesa (no evalúa deudas, compromiso de
pago ni decisor). Es el trade-off aceptado de "form corto". En la práctica, el
resultado será `CALIFICADO_ALTO` salvo que caiga en uno de esos dos hard-stops.

## Tracking

| Momento | dataLayer push | Resultado en GTM |
|---|---|---|
| Mount | `{ event: 'form_start', form_name: 'calificacion-corta' }` | GA4 `form_start` |
| Submit OK | `{ event: 'form_submit', form_name: 'calificacion-corta', form_result, lead_etiqueta }` | Meta `Lead` + GA4 `generate_lead` |
| Agenda cita | `appointment_booked` (lo dispara `CustomCalendar`) | Meta `Schedule` + GA4 `appointment_booked` |

Sin `form_abandon` (irrelevante en una sola pantalla).

## Cambios de código

| Archivo | Acción |
|---|---|
| `app/aplicar/page.tsx` | Nuevo — página minimal noindex |
| `components/ShortForm/ShortForm.tsx` | Nuevo — form + cierre inline |
| `app/api/lead/route.ts` | Editar — aceptar `source?: string` opcional en el body |
| `lib/ghl/client.ts` | Editar — `submitLeadToGHL` agrega tag `Form corto` cuando recibe `source` |
| `docs/measurement-plan.md` | Editar — documentar `form_name: 'calificacion-corta'` |

El cambio en `/api/lead` y `submitLeadToGHL` es retrocompatible: el form largo no
envía `source` y su comportamiento queda intacto.

## Fuera de alcance (YAGNI)

- Sin multi-paso, barra de progreso ni persistencia en `sessionStorage`.
- Sin `form_abandon`.
- Sin endpoint nuevo (reusa `/api/lead`).
- Sin tags de Adsmurai nuevos en GTM (el `form_submit` existente cubre Meta + GA4).
- El parámetro `form_name` en el tag GA4 `generate_lead` queda como mejora opcional
  documentada, no se ejecuta como parte de esta entrega.
