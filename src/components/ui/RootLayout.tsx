import { Outlet, ScrollRestoration } from 'react-router-dom'

/** Layout raíz: resetea el scroll al navegar hacia adelante y lo restaura al
 *  volver atrás. Sin esto, abrir un detalle desde una lista scrolleada dejaba
 *  la nueva pantalla a mitad de página. */
export default function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
