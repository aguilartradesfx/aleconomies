# GTM Setup Guide — aleconomies.com

Pasos para dejar GTM trackeando eventos hacia GA4 + Meta (Adsmurai CAPI).

## Pre-requisitos

- Container GTM-59LMNNT7 ya instalado en el sitio ✅
- OneTag de Adsmurai con PageView funcionando (Browser + Server Deduplicated) ✅
- Cuenta de GA4 con un Measurement ID (`G-XXXXXXXXXX`) — si no existe, créala en analytics.google.com

## Paso 1 — Importar `gtm-container.json`

1. GTM → **Administrador** (Admin) → **Importar contenedor**
2. Elegí el archivo `docs/gtm-container.json`
3. **Espacio de trabajo**: seleccioná un nuevo workspace llamado `Tracking 2.0` (no toques `Default Workspace` por seguridad)
4. **Opción de importación**: elegí **`Merge` (combinar)** → **`Renombrar tags, activadores y variables conflictivos`**
   - Esto preserva tu OneTag de Adsmurai existente
5. **Confirmar**

Vas a ver:
- 9 tags nuevos (1 Google Tag base + 8 GA4 Events)
- 8 triggers de Custom Event
- 12 variables (1 constante + 11 dataLayer)

## Paso 2 — Configurar el GA4 Measurement ID

Ya viene seteado en el JSON con `G-KX0JH65TM1` (Measurement ID de aleconomies). Si en algún momento cambia el stream de GA4, editá la variable `Const - GA4 Measurement ID` en GTM y reemplazá ahí.

## Paso 3 — Duplicar el OneTag de Adsmurai por cada evento Meta

El JSON no incluye los tags de Adsmurai porque dependen del template instalado en tu container. Los creás manualmente duplicando el de PageView.

Para cada uno de los **4 eventos de Meta** abajo:

1. **Etiquetas** → seleccioná tu tag `Adsmurai | Meta` (el de PageView) → menú ⋮ → **Duplicar**
2. Renombrar según la tabla
3. Cambiar **Event name** según la tabla
4. Cambiar el **Activador** según la tabla
5. Guardar

| Nombre del nuevo tag             | Event name (en el tag)   | Activador           |
|----------------------------------|--------------------------|---------------------|
| `Adsmurai | Lead (lead_magnet)`  | `Lead`                   | `CE — lead_magnet_submit` |
| `Adsmurai | Lead (calificacion)` | `Lead`                   | `CE — form_submit`        |
| `Adsmurai | Schedule`            | `Schedule`               | `CE — appointment_booked` |
| `Adsmurai | ViewContent`         | `ViewContent`            | `CE — resource_open`      |

> Importante: **NO toques el tag original de PageView** — sigue con su trigger `All Pages`. Solo duplicás.

## Paso 4 — Vista previa y validación

1. GTM → **Vista previa** → conectá `https://aleconomies.com`
2. Probá los flujos:
   - Descarga un lead magnet
   - Inicia y completa el form de calificación
   - Agenda una cita (si tenés capacidad de test)
   - Abrí la sección Audiolibros y hace click en una
3. En el Tag Assistant, verificá que para cada interacción se disparan:
   - El tag de Adsmurai correspondiente
   - El tag GA4 correspondiente

### Validar en Meta

- Events Manager → tu Dataset → **Probar eventos**
- Para que los eventos Server lleguen ahí en preview, agregá temporalmente `TEST53527` (o el código que te muestre Meta) al campo **FB Test event code** de cada tag Adsmurai duplicado.
- Confirmá que cada evento muestra `Recibido de: Navegador` + `Recibido de: Servidor` con el mismo Identificador del evento.
- **Al terminar**: borrar el test_event_code de todos los tags Adsmurai antes de publicar.

### Validar en GA4

- GA4 → **Configuración → DebugView**
- Activá Debug Mode con la extensión Chrome `GA Debugger` o agregando `?debug_mode=1` a la URL
- Reproducí los flujos y mirá que los eventos llegan con sus parámetros

## Paso 5 — Publicar

Cuando todo valide:
1. GTM → **Enviar** (botón azul arriba derecha)
2. Nombre de versión: `Tracking 2.0 — GA4 + Meta eventos completos`
3. Descripción: lista los eventos agregados
4. **Publicar**

## Eventos opcionales (no incluidos en el JSON)

Si querés trackear más interacciones, agregalas al sitio + GTM siguiendo el mismo patrón:
- `calculator_interact` — cambios en sliders de CompoundCalculator/BankVsInvest
- `risk_profile_complete` — el usuario completa el widget de perfil de riesgo
- `cta_click` — clicks en CTAs específicos del Hero/Footer

Hoy esos no están en el dataLayer del sitio — habría que agregar los push correspondientes en cada componente.

## Troubleshooting

**El import falla con error**: GTM a veces rechaza imports con references TAG_REFERENCE inválidas. Si pasa, importá con opción `Overwrite` en un workspace nuevo y vacío.

**Los GA4 events no llegan a DebugView**: confirmá que la variable `Const - GA4 Measurement ID` tiene tu ID real y que el tag `Google Tag — GA4 base` está disparando en All Pages.

**Los Adsmurai duplicados no envían CAPI**: revisá que en cada tag duplicado el **Fire method** quedó como `Both pixel for web & Conversions API` (a veces al duplicar cambia).
