// Capa 2 del fondo: blobs flotantes que dan variación tonal
// para que el backdrop-filter del glassmorphism tenga algo que desenfocar.
// Las animaciones son CSS puras (no JS) para máximo rendimiento.
// prefers-reduced-motion se maneja en globals.css.
export default function BackgroundBlobs() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none"
    >
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-purple" />
    </div>
  )
}
