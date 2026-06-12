interface SpinnerProps {
  /** Diámetro en px */
  size?: number
  className?: string
}

/** Anillo de carga reutilizable — botones, pantallas y Suspense fallbacks. */
export default function Spinner({ size = 24, className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block animate-spin rounded-full border-white/30 border-t-white ${className}`}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 12)) }}
    />
  )
}
