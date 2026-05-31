# Planify 🗺️✈️

Planify es una aplicación web responsiva diseñada para la planificación de viajes inteligente. A través de un onboarding conversacional (10 preguntas clave), la aplicación recomienda destinos y alojamientos que se ajustan perfectamente a los gustos, presupuesto y estilo de cada viajero.

## Características Principales

- **Onboarding Conversacional**: Una experiencia guiada para descubrir tu viaje ideal.
- **Explorador de Destinos**: Resultados filtrados según el perfil del usuario.
- **Gestión de Viajes**: Guarda tus favoritos y gestiona tus reservas ("Próximo", "En curso", "Completado").
- **Comunidad**: Un feed al estilo Instagram para compartir tus viajes y buscar inspiración.
- **Modo Oscuro Glassmorphism**: Interfaz moderna y atractiva utilizando principios de diseño Neumórfico y Glassmorphism.
- **Persistencia en la Nube**: Autenticación y sincronización con Supabase.

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite.
- **Estilos**: Tailwind CSS, Framer Motion para animaciones fluidas, y variables CSS nativas para el sistema de diseño.
- **Estado**: Zustand (con persistencia local).
- **Backend / Auth**: Supabase.
- **Iconos**: Google Material Symbols.
- **Fuentes**: Syne y Plus Jakarta Sans.

## Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone <repo-url>
   cd planify
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y agrega tus claves de Supabase (opcional si usas los datos mockeados para pruebas básicas):
   ```env
   VITE_SUPABASE_URL=tu_url_aqui
   VITE_SUPABASE_ANON_KEY=tu_clave_aqui
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Construye la aplicación para producción.
- `npm run lint`: Ejecuta ESLint para analizar el código.
- `npm run preview`: Previsualiza la build de producción.

## Estructura del Proyecto

- `src/screens`: Vistas principales de la app (Home, Booking, Community, etc.)
- `src/components/ui`: Componentes de interfaz reutilizables (Botones, Navbar, etc.)
- `src/store`: Manejadores de estado global con Zustand (authStore, tripsStore, etc.)
- `src/services`: Servicios externos (Supabase DB)
- `src/animations`: Configuraciones reutilizables de Framer Motion

## Autores
Desarrollado como parte del TP de UX/UI.
