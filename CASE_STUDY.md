# Planify — Case Study

> **De la pregunta "¿a dónde te llevamos?" a un producto completo.**
> Caso de estudio del diseño, construcción y visión de negocio de Planify:
> una PWA que convierte la planificación de un viaje en una conversación de 10 preguntas.

🔗 **App en vivo:** https://planify-ashen.vercel.app/

---

## 1. El problema

Planificar un viaje es una de las experiencias digitales más fragmentadas que existen.

Una persona que quiere irse una semana a algún lado hoy hace esto: abre Google, abre Booking, abre Airbnb, compara en Despegar, busca qué hacer en TripAdvisor, pregunta en Instagram, anota en una nota del celular, y arma el presupuesto a mano en la cabeza. **El viaje se planifica en diez pestañas y ninguna habla con la otra.**

Detrás de esa fragmentación identificamos tres dolores concretos:

| Dolor | Cómo se manifiesta |
|---|---|
| **Parálisis por sobreoferta** | Miles de opciones sin un criterio que las ordene según *mi* viaje. La gente abandona la búsqueda antes de decidir. |
| **El presupuesto invisible** | Cada plataforma muestra su pedazo (el vuelo, la noche de hotel) pero nadie te dice *cuánto sale el viaje completo*. |
| **La inspiración no se convierte en acción** | Ves el viaje de otro en redes, te dan ganas… y esa intención muere ahí, porque pasar de "quiero ir" a "estoy buscando" requiere empezar de cero. |

### La oportunidad

Las plataformas grandes (Booking, Despegar, Airbnb) son excelentes **catálogos**, pero ninguna se ocupa del momento anterior: cuando todavía no sabés bien qué querés. Ahí no hace falta más oferta — hace falta **una conversación**.

---

## 2. Research y definición

### Benchmark competitivo

Analizamos cómo resuelven (o no) la etapa de descubrimiento los jugadores existentes:

- **Booking / Despegar:** formularios de búsqueda pensados para quien *ya sabe* destino y fechas. Filtros potentes, cero acompañamiento.
- **Airbnb:** la mejor experiencia visual del rubro, pero también asume que ya elegiste a dónde ir.
- **TripAdvisor / blogs:** mucha inspiración, ninguna conexión con la acción de reservar.
- **Agencias de viaje tradicionales:** resuelven exactamente este problema… con un humano, horario comercial y comisión alta. **La experiencia de "contale a alguien tu viaje ideal y que te lo arme" nunca se tradujo bien a digital.** Esa fue nuestra tesis.

### Usuario objetivo

Definimos una protopersona principal para guiar cada decisión:

> **Sofía, 26 años, Buenos Aires.** Trabaja, viaja 1–2 veces al año con su pareja o amigas. Planifica todo desde el celular, de noche, en momentos muertos. No le falta información — le sobra. Lo que no tiene es tiempo ni ganas de sintetizarla. Si una app le pide registrarse antes de mostrarle valor, la cierra.

De ahí salieron tres requisitos no negociables: **mobile-first real** (no un desktop achicado), **valor antes que registro** (podés buscar sin cuenta), y **lenguaje argentino cercano** (voseo, "¿A dónde te llevamos?").

### Insights que guiaron el diseño

1. **Elegir entre chips es infinitamente más fácil que escribir en un campo vacío.** La carga cognitiva de "¿Cuál es tu presupuesto?" con un input libre es alta; con tres opciones ("Económico 💸 / Medio / Alto ✨") es casi nula.
2. **La confianza se construye con honestidad, no con promesas.** Una app académica que simula procesar pagos genera desconfianza. Una que te dice "te llevamos a reservar en cada plataforma original" genera credibilidad — y casualmente, ese es también un modelo de negocio real (ver §6).
3. **El viaje no termina al reservar.** Volver del viaje y contarlo es parte de la experiencia, y es el insumo de inspiración del próximo viajero. Eso pedía un loop, no una pantalla más.

---

## 3. La solución

**Planify convierte la planificación en una conversación.** El corazón del producto es un chat de 10 preguntas — destino soñado, fechas, compañía, presupuesto, intereses — donde casi todo se responde tocando chips. Al final, la app rankea propiedades según *ese* viaje y arma el paquete completo.

### El flujo completo

```
Home → Chat (10 preguntas) → Resumen → Resultados rankeados
     → Mapa / Filtros → Detalle → Desglose de reserva → Mis Viajes
                                                      ↕
                                                  Comunidad
```

### Decisiones de producto clave

**El chat con chips y la opción de omitir.** Solo el destino es esencial; todo lo demás se puede saltear ("Omitir esta pregunta"). Respetamos el tiempo del usuario: una búsqueda con 3 respuestas funciona, una con 10 funciona mejor.

**Resultados con scoring, no con filtros duros.** En vez de filtrar estrictamente (y arriesgar "0 resultados"), cada propiedad recibe un puntaje según cuánto matchea los criterios. Siempre hay algo para mostrar, ordenado por relevancia.

**El desglose honesto.** La pantalla de reserva muestra el **combo total estimado** (alojamiento + vuelo + transporte + actividades) y un botón por rubro que te lleva a reservar a la plataforma real: Airbnb, Despegar, Uber, Civitatis. Planify no procesa pagos — y lo dice explícitamente. La transparencia es la feature.

**El loop de comunidad.** Cada post de la comunidad tiene "Copiar este viaje": un tap y la app arma una búsqueda con ese destino. Y cuando un viaje tuyo termina, tu card en Mis Viajes te invita: *"¿Cómo te fue? Contale a la comunidad"* — con el destino ya pre-cargado. **La inspiración genera viajes, los viajes generan contenido, el contenido genera inspiración.** Es el motor de crecimiento orgánico del producto.

---

## 4. Diseño: identidad y sistema

### La identidad

Un gradiente atmosférico **violeta → naranja** que recorre toda la app como un atardecer continuo, superficies de **glass morphism** (vidrio esmerilado) para el contenido y controles **neumórficos** para lo interactivo. Tipografía **Syne** (display, con personalidad) + **Plus Jakarta Sans** (lectura). El resultado es cálido, distintivo y reconocible en una miniatura — no se parece a Booking ni a ninguna plantilla.

### El sistema (no solo pantallas bonitas)

Todo está documentado en `DESIGN_SYSTEM.md` con reglas escritas:

- **Tokens únicos** de color, tipografía y espaciado — un solo lugar de verdad.
- **Regla glass vs. neu:** contenido → glass, control → neumorfismo. Cualquier diseñador nuevo sabe qué usar.
- **Escala tipográfica cerrada** (12 estilos `t-*`): se acabaron los tamaños inventados.
- **Componentes reutilizables:** estados vacíos, sheets de confirmación, tabs, spinners e imágenes con carga elegante se ven idénticos en toda la app porque *son el mismo componente*.

### Accesible = profesional

Contraste AA, áreas táctiles de 44px, foco visible para teclado, etiquetas ARIA en español, soporte de `prefers-reduced-motion`. La accesibilidad no fue una pasada final: es parte del sistema.

---

## 5. Iteración: de prototipo a producto

La primera versión funcionaba. La versión final **se siente** profesional. En el medio hubo una auditoría sistemática en fases, con criterio de director creativo y de QA al mismo tiempo:

- **Bugs de confianza:** el botón "Limpiar filtros" no limpiaba; el desglose de precios mostraba un cálculo estático que contradecía la propiedad elegida; había botones que no hacían nada. *Un botón que miente rompe más confianza que un botón que falta.* Todos eliminados.
- **Cada acción responde:** feedback háptico, toasts que enseñan ("Guardado en **Mis viajes**"), spinners reales, animaciones con física de resorte.
- **Velocidad real y percibida:** la app pasó de cargar 1,9MB a **200KB iniciales** (cada pantalla carga su propio código al visitarla). El primer contenido aparece de inmediato gracias a un splash estático en el HTML.
- **Estados honestos:** banner de "estás viendo publicaciones de ejemplo", indicador de "sin conexión — mostrando datos guardados", pantalla de error con recuperación. La app nunca te deja adivinando.

### Resultados medidos (no estimados)

| Métrica | Resultado |
|---|---|
| Lighthouse Performance (mobile, red 4G lenta) | **~93/100** |
| Bloqueo del hilo principal (TBT) | **0 ms** |
| Saltos de layout (CLS) | **0** |
| Peso de instalación de la PWA | **1,5 MB** |
| Tests automatizados | **17/17 en verde** |
| Errores de consola | **0** |

Planify es además una **PWA instalable**: se agrega a la pantalla de inicio, funciona sin conexión y se actualiza sola.

---

## 6. Modelo de negocio: cómo Planify genera plata

La decisión de diseño más honesta del producto — "no procesamos pagos, te llevamos a la plataforma original" — **es** el modelo de negocio. Planify no compite con Booking ni con Despegar: les manda clientes ya decididos.

### Fuente principal: afiliación (revenue share)

Cada botón del desglose de reserva es un **link de afiliado**. Las plataformas de viaje pagan comisión por cada reserva que les acercás — típicamente entre el **3% y el 8%** del valor según la vertical (alojamiento, actividades, vuelos). El usuario paga exactamente lo mismo; la plataforma comparte su margen con quien le trajo la venta.

La belleza del modelo: **el incentivo está alineado con la experiencia.** Planify gana solo si el usuario encuentra un viaje que realmente quiere reservar. No hay banners, no hay venta de datos, no hay fricción agregada.

> Ejemplo conservador: un viaje promedio de US$800 con una comisión ponderada del 4% deja ~US$32 por viaje concretado. Con 1.000 viajes concretados al mes, el producto factura ~US$32.000 mensuales con estructura mínima.

### Fuentes secundarias (a medida que crece)

1. **Planify Pro (suscripción, ~US$3–5/mes):** alertas de precio del combo, viajes ilimitados guardados, itinerarios con IA, exportes premium. El plan gratuito siempre cubre el flujo completo — Pro vende *conveniencia*, no desbloquea lo básico.
2. **Posicionamiento patrocinado (con etiqueta):** destinos u operadores destacados en resultados, siempre marcados como tales. La confianza del ranking orgánico no se vende.
3. **B2B (largo plazo):** el motor conversacional como widget embebible para agencias y operadores turísticos que quieren digitalizar su "contame tu viaje ideal".

---

## 7. Si Planify fuese una startup: objetivos

**Métrica norte (North Star): viajes concretados** — búsquedas que terminan en click de reserva hacia una plataforma. Mide al mismo tiempo la salud del producto (la gente encuentra lo que busca) y del negocio (cada una es facturación potencial).

### Fase 1 — Validación (meses 0–6)

- **Objetivo:** demostrar que el flujo conversacional convierte mejor que un buscador tradicional.
- Inventario real vía APIs de afiliados (Travelpayouts, Booking Affiliate, Civitatis Partners).
- **KPIs:** tasa de finalización del chat > 60% · búsqueda → click de reserva > 8% · usuarios que vuelven a los 30 días > 20%.

### Fase 2 — Crecimiento (meses 6–18)

- **Objetivo:** encender el loop de comunidad como canal de adquisición orgánico.
- Posts compartibles fuera de la app (cada viaje contado es marketing gratis), notificaciones push de la PWA ("tu viaje a Bariloche es en 7 días"), itinerarios día por día generados por IA.
- **KPIs:** % de viajes que generan post > 15% · % de búsquedas originadas en "Copiar este viaje" > 25% · CAC orgánico tendiendo a cero.

### Fase 3 — Monetización plena (meses 18+)

- **Objetivo:** ingresos recurrentes sobre la base de afiliación.
- Lanzamiento de Planify Pro, primeros pilotos B2B.
- **KPIs:** conversión a Pro > 4% de usuarios activos · ingreso promedio por viaje concretado creciendo trimestre a trimestre.

---

## 8. Cómo escala

**Mercado.** Nace es-AR por diseño (lenguaje, moneda, Despegar como vertical de vuelos) — un mercado que las apps globales atienden con traducciones genéricas. La expansión natural es **LATAM hispanohablante** (mismo idioma, mismos dolores, mismas plataformas regionales) y recién después la internacionalización completa. La arquitectura ya separa textos, monedas (USD/EUR/ARS con preferencia por usuario) y formatos regionales.

**Producto.** El chat de 10 preguntas es un *motor*, no una pantalla: los mismos criterios que hoy rankean alojamientos pueden rankear paquetes, cruceros, escapadas de fin de semana o viajes corporativos sin rediseñar la experiencia. Cada vertical nueva es una fuente de afiliación nueva.

**Tecnología.** Por ser una PWA, escalar usuarios no requiere tiendas de aplicaciones ni builds nativos: una sola base de código sirve a Android, iOS y escritorio, con costo de distribución cercano a cero. El frontend ya está preparado para inventario real: la capa de datos está aislada, y cambiar los datos de demostración por APIs de afiliados no toca ninguna pantalla.

**Datos.** Cada conversación del chat es investigación de mercado estructurada: qué busca la gente, con qué presupuesto, en qué fechas, con quién. Con escala, ese dataset alimenta mejores rankings, predicción de demanda y la negociación de mejores comisiones — una ventaja competitiva que se profundiza sola con el uso.

---

## 9. Aprendizajes

1. **Los detalles son la marca.** La diferencia entre "un TP" y "un producto" no fue ninguna feature grande: fue arreglar el botón que mentía, unificar 80 estilos sueltos en 12, y que cada acción tenga respuesta.
2. **La honestidad es una decisión de diseño.** Decir "esto es contenido de ejemplo", "no procesamos pagos", "estás sin conexión" hizo la app más creíble, no menos.
3. **Medir cambia la conversación.** "La app es rápida" es una opinión; "Lighthouse 93, cero bloqueo, cero saltos de layout" es un argumento.
4. **Conectar vale más que agregar.** La mejor feature del producto final no fue una pantalla nueva: fue el loop que conecta dos flujos que ya existían.

---

*Planify — TP2 · Diseño UX/UI · 2026*
