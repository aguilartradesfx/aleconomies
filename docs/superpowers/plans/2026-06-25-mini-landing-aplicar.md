# Mini-landing de captura `/aplicar` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una landing de una sola pantalla en `/aplicar` que captura contacto + 3 calificadores, los manda al mismo pipeline que el form largo (`/api/lead` → GHL) y dispara `form_submit` para trazar en GTM/GA4 + Meta sin cambios obligatorios en Tag Manager.

**Architecture:** Una página server-component minimal (`app/aplicar/page.tsx`) monta un client-component (`components/ShortForm/ShortForm.tsx`). El componente arma un `FormState` parcial sobre `INITIAL_FORM_STATE`, lo califica con `calificarLead()`, empuja `form_submit` al `dataLayer`, postea a `/api/lead` con `source: 'aplicar'`, y muestra inline el cierre existente (`CierreCalificado` con `CustomCalendar`, o `CierreEducativo`). Se reusan los componentes de campos (`TextField`, `RadioGroup`, `ConsentCheckbox`), las opciones de `data/calificationForm.ts` y las clases CSS `calif-*`.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, framer-motion (ya usado por los cierres), lucide-react. **No hay framework de tests** en el proyecto (solo `next lint` y `next build`); la verificación de cada tarea es `npm run lint` + `npm run build` (typecheck) + chequeo manual en `npm run dev`.

## Global Constraints

- **Ruta y SEO:** `/aplicar` con `robots: { index: false, follow: true }` (igual que `/asesoria` y `/agendar`).
- **Nombre de evento de tracking:** `form_name: 'calificacion-corta'` (literal, exacto) en `form_start` y `form_submit`. Reusa los eventos `form_start` y `form_submit` existentes — NO crear eventos nuevos.
- **Destino del lead:** POST a `/api/lead` con body `{ form, resultado, source: 'aplicar' }`.
- **Tag en GHL:** `Form corto` cuando `source` está presente. El form largo NO envía `source` → su comportamiento queda intacto (retrocompatible).
- **Sin números inventados:** toda cifra visible (rangos de ingresos/capital, "$97") proviene de `data/calificationForm.ts` o de componentes existentes. No inventar cifras nuevas.
- **Tono:** español de Costa Rica en forma "usted", para matchear los componentes `calif-*` reutilizados.
- **Form parcial:** los campos no preguntados quedan en su valor de `INITIAL_FORM_STATE`; `mapFormToCustomFields` ya descarta nulos/vacíos.

---

### Task 1: Backend — `source` opcional en `/api/lead` + tag `Form corto` en GHL

**Files:**
- Modify: `lib/ghl/client.ts:53-65` (`submitLeadToGHL`)
- Modify: `app/api/lead/route.ts:6-9` (interface) y `:23-25` (llamada)

**Interfaces:**
- Produces: `submitLeadToGHL(form: FormState, resultado: CalificationResult, source?: string): Promise<UpsertContactResponse>` — cuando `source` es truthy, agrega el tag `Form corto` a los tags del contacto.
- Produces: `POST /api/lead` ahora acepta `source?: string` en el body además de `form` y `resultado`.

- [ ] **Step 1: Agregar `source` opcional a `submitLeadToGHL`**

En `lib/ghl/client.ts`, reemplazar la función `submitLeadToGHL` (líneas 53-65) por:

```ts
export async function submitLeadToGHL(
  form: FormState,
  resultado: CalificationResult,
  source?: string
): Promise<UpsertContactResponse> {
  const sourceTags = source ? ['Form corto'] : []
  return upsertContact({
    firstName: form.nombre || undefined,
    lastName:  form.apellidos || undefined,
    email:     form.correo || undefined,
    phone:     form.telefono || undefined,
    tags:      [...GHL_TAGS, 'Calificación', `Calificación: ${resultado.etiqueta}`, ...sourceTags],
    customFields: mapFormToCustomFields(form, resultado),
  })
}
```

- [ ] **Step 2: Pasar `source` desde el route handler**

En `app/api/lead/route.ts`, actualizar la interface (líneas 6-9):

```ts
interface LeadBody {
  form?: FormState
  resultado?: CalificationResult
  source?: string
}
```

Y la llamada dentro del `try` (línea 24):

```ts
    const ghl = await submitLeadToGHL(body.form, body.resultado, body.source)
```

- [ ] **Step 3: Verificar typecheck + lint**

Run: `npm run lint && npm run build`
Expected: ambos pasan sin errores. El build compila `/api/lead` y type-checea el nuevo parámetro `source`.

- [ ] **Step 4: Commit**

```bash
git add lib/ghl/client.ts app/api/lead/route.ts
git commit -m "feat(lead): aceptar source opcional y taggear 'Form corto' en GHL

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Componente `ShortForm` + página `/aplicar` + CSS

**Files:**
- Create: `components/ShortForm/ShortForm.tsx`
- Create: `app/aplicar/page.tsx`
- Modify: `app/globals.css` (insertar bloque `.aplicar-*` después de `.calif-shell`, ~línea 2572)

**Interfaces:**
- Consumes (de Task 1): `POST /api/lead` con `{ form, resultado, source: 'aplicar' }`.
- Consumes (existentes): `calificarLead(form): CalificationResult`; `INITIAL_FORM_STATE`; tipos `FormState`, `IngresosRango`, `Solvencia`; `TextField`, `RadioGroup`, `ConsentCheckbox` de `@/components/CalificationForm/fields`; `StepHeader`, `Em`; `CierreCalificado` (props `{ decisorRequerido: boolean; contactId: string | null; leadName?: string | null }`); `CierreEducativo` (sin props); `GlassCard` (props `{ variant?, className?, children }`); `PhoneInput` (props `{ value, onChange, placeholder?, id? }`); `ingresosOpts`, `solvenciaOpts` de `@/data/calificationForm`.
- Produces: `ShortForm` (default export, client component, sin props); `AplicarPage` (default export en `app/aplicar/page.tsx`).

- [ ] **Step 1: Crear el componente `ShortForm`**

Crear `components/ShortForm/ShortForm.tsx` con este contenido completo:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import PhoneInput from '@/components/ui/PhoneInput'
import StepHeader, { Em } from '@/components/CalificationForm/StepHeader'
import { TextField, RadioGroup, ConsentCheckbox } from '@/components/CalificationForm/fields'
import CierreCalificado from '@/components/CalificationForm/steps/CierreCalificado'
import CierreEducativo from '@/components/CalificationForm/steps/CierreEducativo'
import {
  INITIAL_FORM_STATE,
  type FormState,
  type IngresosRango,
  type Solvencia,
} from '@/components/CalificationForm/types'
import { calificarLead, type CalificationResult } from '@/lib/calificationLogic'
import { ingresosOpts, solvenciaOpts } from '@/data/calificationForm'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Un solo control de capital que setea capitalDisponible + rangoCapital del FormState.
type CapitalChoice = 'cero' | 'A' | 'B' | 'C' | 'D'
const capitalOpts: ReadonlyArray<{ value: CapitalChoice; label: string }> = [
  { value: 'cero', label: 'Aún no, deseo empezar desde cero' },
  { value: 'A', label: 'Menos de $5.000 USD' },
  { value: 'B', label: 'Entre $5.000 y $25.000 USD' },
  { value: 'C', label: 'Entre $25.001 y $100.000 USD' },
  { value: 'D', label: 'Más de $100.000 USD' },
]

type DataLayerEntry = Record<string, unknown>
declare global {
  interface Window {
    dataLayer?: DataLayerEntry[]
  }
}
function pushDataLayer(entry: DataLayerEntry) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(entry)
}

type FieldKey = 'nombre' | 'apellidos' | 'telefono' | 'correo' | 'ingresos' | 'capital' | 'solvencia' | 'consent'
type FieldErrors = Partial<Record<FieldKey, string>>

export default function ShortForm() {
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')
  const [ingresos, setIngresos] = useState<IngresosRango | null>(null)
  const [capital, setCapital] = useState<CapitalChoice | null>(null)
  const [solvencia, setSolvencia] = useState<Solvencia | null>(null)
  const [consent, setConsent] = useState(false)

  const [errors, setErrors] = useState<FieldErrors>({})
  const [resultado, setResultado] = useState<CalificationResult | null>(null)
  const [contactId, setContactId] = useState<string | null>(null)

  const startedRef = useRef(false)
  const submittedRef = useRef(false)

  // form_start una sola vez al montar.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    pushDataLayer({ event: 'form_start', form_name: 'calificacion-corta' })
  }, [])

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!nombre.trim()) e.nombre = 'Ingrese su nombre.'
    if (!apellidos.trim()) e.apellidos = 'Ingrese sus apellidos.'
    if (!telefono.trim()) e.telefono = 'Ingrese su teléfono.'
    if (!correo.trim()) e.correo = 'Ingrese su correo.'
    else if (!EMAIL_RE.test(correo.trim())) e.correo = 'Ese correo no parece válido.'
    if (!ingresos) e.ingresos = 'Seleccione una opción.'
    if (!capital) e.capital = 'Seleccione una opción.'
    if (!solvencia) e.solvencia = 'Seleccione una opción.'
    if (!consent) e.consent = 'Necesitamos su consentimiento para continuar.'
    return e
  }

  function buildForm(): FormState {
    const capitalDisponible = capital === 'cero' ? 'B' : 'A'
    const rangoCapital = capital === 'cero' ? null : capital
    return {
      ...INITIAL_FORM_STATE,
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      ingresos,
      solvencia,
      capitalDisponible,
      rangoCapital,
      consentimientoDatos: true,
    }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (submittedRef.current) return
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return
    submittedRef.current = true

    const form = buildForm()
    const result = calificarLead(form)

    pushDataLayer({
      event: 'form_submit',
      form_name: 'calificacion-corta',
      form_result: result.cierre === 'agendar_llamada' ? 'calificado' : 'cierre_educativo',
      lead_etiqueta: result.etiqueta,
    })

    // Mostramos el cierre de inmediato; el contactId llega en segundo plano
    // y habilita el botón de confirmar cita (mismo patrón que el form largo).
    setResultado(result)

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, resultado: result, source: 'aplicar' }),
        keepalive: true,
      })
      const data = (await res.json().catch(() => ({}))) as { contactId?: string | null }
      if (data.contactId) setContactId(data.contactId)
    } catch {
      // El lead pudo no guardarse; el cierre calificado mostrará el aviso
      // de "falta tu información" si no hay contactId para agendar.
    }
  }

  // ── Cierre inline ──
  if (resultado) {
    return (
      <GlassCard variant="heavy" className="calif-card">
        {resultado.cierre === 'agendar_llamada' ? (
          <CierreCalificado
            decisorRequerido={false}
            contactId={contactId}
            leadName={`${nombre} ${apellidos}`.trim() || null}
          />
        ) : (
          <CierreEducativo />
        )}
      </GlassCard>
    )
  }

  // ── Formulario ──
  return (
    <GlassCard variant="heavy" className="calif-card">
      <StepHeader
        eyebrow="Asesoría financiera 1 a 1"
        title={<>Agende su <Em>diagnóstico sin costo.</Em></>}
      />

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre"
          name="nombre"
          value={nombre}
          onChange={setNombre}
          placeholder="Su nombre"
          autoComplete="given-name"
          invalid={!!errors.nombre}
          error={errors.nombre}
        />
        <TextField
          label="Apellidos"
          name="apellidos"
          value={apellidos}
          onChange={setApellidos}
          placeholder="Sus apellidos"
          autoComplete="family-name"
          invalid={!!errors.apellidos}
          error={errors.apellidos}
        />

        <div className="calif-field">
          <label className="calif-label">Número de teléfono</label>
          <PhoneInput value={telefono} onChange={setTelefono} placeholder="8888 8888" />
          {errors.telefono && <p className="calif-error">{errors.telefono}</p>}
        </div>

        <TextField
          label="Correo electrónico"
          name="correo"
          type="email"
          inputMode="email"
          value={correo}
          onChange={setCorreo}
          placeholder="usted@ejemplo.com"
          autoComplete="email"
          invalid={!!errors.correo}
          error={errors.correo}
        />

        <RadioGroup<IngresosRango>
          legend="¿Cuál es su rango de ingresos mensuales?"
          name="ingresos"
          options={ingresosOpts as ReadonlyArray<{ value: IngresosRango; label: string }>}
          value={ingresos}
          onChange={setIngresos}
        />
        {errors.ingresos && <p className="calif-error">{errors.ingresos}</p>}

        <RadioGroup<CapitalChoice>
          legend="¿Con cuánto capital cuenta hoy para invertir?"
          name="capital"
          options={capitalOpts}
          value={capital}
          onChange={setCapital}
        />
        {errors.capital && <p className="calif-error">{errors.capital}</p>}

        <RadioGroup<Solvencia>
          legend="Para iniciar a invertir es importante tener solvencia (gastar menos de lo que se gana al mes). ¿Considera que la tiene hoy?"
          name="solvencia"
          options={solvenciaOpts as ReadonlyArray<{ value: Solvencia; label: string }>}
          value={solvencia}
          onChange={setSolvencia}
        />
        {errors.solvencia && <p className="calif-error">{errors.solvencia}</p>}

        <ConsentCheckbox checked={consent} onChange={setConsent} name="consentimientoDatos">
          Autorizo el tratamiento de mis datos conforme a la Ley 8968 de Protección de
          Datos Personales de Costa Rica. No se comparten con terceros.
        </ConsentCheckbox>
        {errors.consent && <p className="calif-error">{errors.consent}</p>}

        <button
          type="submit"
          className="btn-primary recurso-form-submit"
          style={{ marginTop: 20 }}
        >
          Enviar y agendar
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </form>
    </GlassCard>
  )
}
```

- [ ] **Step 2: Crear la página `/aplicar`**

Crear `app/aplicar/page.tsx`:

```tsx
import type { Metadata } from 'next'
import ShortForm from '@/components/ShortForm/ShortForm'

export const metadata: Metadata = {
  title: 'Agende su diagnóstico financiero sin costo',
  description:
    'Déjenos sus datos y agende un diagnóstico financiero inicial sin costo con Alejandro Araya.',
  alternates: {
    canonical: '/aplicar',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function AplicarPage() {
  return (
    <main className="calif-page">
      <div className="calif-shell">
        <a href="/" className="aplicar-wordmark">Alejandro Araya</a>
        <ShortForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Agregar el CSS del wordmark**

En `app/globals.css`, justo después del bloque `.calif-shell { ... }` (cierra en la línea ~2572, dentro de `@layer components`), insertar:

```css

  /* ── /aplicar — Mini-landing de captura ───────── */
  .aplicar-wordmark {
    display: inline-block;
    margin-bottom: 28px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-3);
    text-decoration: none;
    transition: color 200ms ease;
  }
  .aplicar-wordmark:hover {
    color: var(--text);
  }
```

- [ ] **Step 4: Verificar typecheck + lint**

Run: `npm run lint && npm run build`
Expected: ambos pasan. El build genera la ruta `/aplicar` (aparece en la lista de rutas como `○ /aplicar`). Sin errores de tipos en `ShortForm.tsx` (capital → rangoCapital narrowing, props de cierres, etc.).

- [ ] **Step 5: Verificación manual en dev**

Run: `npm run dev` y abrir `http://localhost:3000/aplicar`. Confirmar:

1. **Render minimal:** se ve el wordmark "Alejandro Araya", el header ("Agende su diagnóstico sin costo") y el form en una sola tarjeta glass, sin nav ni footer.
2. **form_start:** en la consola, `window.dataLayer` contiene `{ event: 'form_start', form_name: 'calificacion-corta' }`.
3. **Validación:** enviar con campos vacíos muestra los errores por campo; no hace POST.
4. **Camino calificado:** llenar nombre/apellidos/teléfono/correo válido, ingresos = "Entre $1.500 y $3.000 USD" (o mayor), capital = cualquier rango, solvencia = "Sí, tengo la solvencia económica", marcar consentimiento → Enviar. Debe:
   - empujar `{ event: 'form_submit', form_name: 'calificacion-corta', form_result: 'calificado', lead_etiqueta: 'CALIFICADO_ALTO' }` al `dataLayer`;
   - hacer `POST /api/lead` (verlo en la pestaña Network con body que incluye `source: 'aplicar'`);
   - mostrar el cierre `CierreCalificado` con el botón "Elegir fecha y hora" → al abrir, el `CustomCalendar` carga disponibilidad y permite agendar.
5. **Camino educativo:** repetir con solvencia = "No, necesito aprender…" → muestra `CierreEducativo` (recursos), `form_result: 'cierre_educativo'`.

> Nota: el POST a `/api/lead` requiere `GHL_PIT` y `GHL_LOCATION_ID` en `.env.local` para crear el contacto. Si no están en local, el cierre se muestra igual y el `CustomCalendar` mostrará el aviso "Falta tu información" (sin `contactId`) — el tracking `form_submit` igual se dispara. Verificar el end-to-end de GHL en preview/staging con credenciales.

- [ ] **Step 6: Commit**

```bash
git add components/ShortForm/ShortForm.tsx app/aplicar/page.tsx app/globals.css
git commit -m "feat(aplicar): mini-landing de captura en una pantalla

Form corto (contacto + ingresos/capital/solvencia) que reusa /api/lead,
calificarLead y los cierres del form largo. Dispara form_start y
form_submit con form_name 'calificacion-corta'.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Documentar el evento en el measurement plan

**Files:**
- Modify: `docs/measurement-plan.md` (tabla de eventos + nota de `form_submit`)

**Interfaces:**
- Consumes: el comportamiento de tracking implementado en Task 2 (`form_name: 'calificacion-corta'`).

- [ ] **Step 1: Agregar la fila/nota del form corto**

En `docs/measurement-plan.md`, en la sección "### `form_submit` (calificación)", agregar al final de esa subsección:

```markdown
- El **mini-form `/aplicar`** (form corto) reusa este mismo evento con
  `form_name: 'calificacion-corta'`. Dispara los mismos tags (Meta `Lead` +
  GA4 `generate_lead`) porque el trigger `CE — form_submit` matchea por nombre
  de evento, no por `form_name` — **no requiere cambios en GTM**.
- Opcional: para separar form corto vs. largo en reportes de GA4, agregar el
  parámetro `form_name` al tag `GA4 — generate_lead (calification)` (`{{DLV - form_name}}`).
  Para contar Leads y optimizar Meta no hace falta.
```

Y en la sección "### `form_start`" / convenciones, anotar que `form_start` también
se dispara desde `/aplicar` con `form_name: 'calificacion-corta'`.

- [ ] **Step 2: Commit**

```bash
git add docs/measurement-plan.md
git commit -m "docs(tracking): documentar form corto /aplicar (calificacion-corta)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**1. Spec coverage:**
- Página minimal noindex `/aplicar` → Task 2 (page.tsx con robots index:false).
- Campos contacto + ingresos + capital + solvencia + consentimiento → Task 2 (ShortForm).
- Mapeo capital → `capitalDisponible` + `rangoCapital` → Task 2 (`buildForm`).
- POST a `/api/lead` con `source` → Task 1 (backend) + Task 2 (fetch).
- Tag `Form corto` en GHL → Task 1.
- Calificado → `CierreCalificado` + `CustomCalendar`; educativo → `CierreEducativo` → Task 2.
- Tracking `form_start` + `form_submit` con `form_name: 'calificacion-corta'` → Task 2.
- `appointment_booked` lo dispara `CustomCalendar` (reuso, sin código nuevo) → Task 2 (verificación manual).
- Documentación del evento → Task 3.
- Retrocompatibilidad del form largo → Task 1 (`source` opcional, sin tocar la llamada existente del form largo).

**2. Placeholder scan:** Sin TBD/TODO; todo el código está completo y literal.

**3. Type consistency:** `submitLeadToGHL(form, resultado, source?)` se define en Task 1 y se consume en Task 2 vía el body del POST (no se importa directo). `CierreCalificado` recibe `{ decisorRequerido, contactId, leadName }` (verificado contra el componente). `RadioGroup<V>`/`TextField`/`ConsentCheckbox` matchean las firmas de `fields.tsx`. `CapitalChoice` se estrecha a `RangoCapital` en el branch `!== 'cero'`. `IngresosRango`/`Solvencia` se importan de `types.ts`.

## Execution Handoff

Plan guardado. Ver sección final para elegir modo de ejecución.
