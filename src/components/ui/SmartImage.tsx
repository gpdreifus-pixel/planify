import { useEffect, useRef, useState } from 'react'

/** <img> con lazy loading + decode async + fade-in al cargar.
 *  Evita el pop-in brusco de imágenes en listas y mantiene el layout
 *  (el contenedor del caller define el tamaño, igual que con <img>). */
export default function SmartImage({
  className = '',
  style,
  onLoad,
  onError,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  // Imágenes ya cacheadas pueden completar antes de que React enganche onLoad
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <img
      ref={ref}
      loading="lazy"
      decoding="async"
      {...rest}
      onLoad={(e) => { setLoaded(true); onLoad?.(e) }}
      onError={(e) => { setLoaded(true); onError?.(e) }}
      className={`transition-opacity duration-500 ${className}`}
      // opacity inline solo durante la carga — al terminar vuelve a mandar la
      // clase del caller (p.ej. opacity-90 en cards con mix-blend)
      style={loaded ? style : { ...style, opacity: 0 }}
    />
  )
}
