import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Spinner from './Spinner'

/** Layout raíz:
 *  - Suspense para las rutas lazy (code splitting). El fallback es solo un
 *    spinner centrado: el gradiente de fondo vive en html (index.css), así
 *    que la transición es imperceptible, sin flashes.
 *  - ScrollRestoration: resetea el scroll al navegar hacia adelante y lo
 *    restaura al volver atrás. */
export default function RootLayout() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-dvh flex items-center justify-center">
            <Spinner size={32} />
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <ScrollRestoration />
    </>
  )
}
