import type { Property, Trip, CommunityPost, ChatStep } from '../types'

// ── AI avatar ──────────────────────────────────────────────────────────────
export const AI_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrsWtM8p6_I5pCt6dtNtzQ3l6-g9mkCpKL2f7TfJfEDIc6gM7gfUn8674ZkryLsk4fjQCpkadIixdwKSwx20LtKhYQZ-cqpEyp_LTRvWpkccKXL6meYhfgSUKpd42D2AxlnbwM6E500QtI54yPZYLIJd0TBeGo4tVQq13vIlWF7clr9rKYhXPPpA7jOBTSkQMymVhmB3JepVMA0bP5GDR5c6ErHW54Jcwod67PtZg2i0Pwmj6IZaxu9S_6fUymkmU0i4LAUBJZ4X2h'

// ── Chat steps ─────────────────────────────────────────────────────────────
export const CHAT_STEPS: ChatStep[] = [
  {
    step: 1,
    question: 'Hola, ¿a dónde querés ir?',
    hint: 'Escribí un destino o elegí una vibración.',
    chips: ['Beach vibe 🏖️', 'City exploration 🏙️', 'Mountains ⛰️'],
    placeholder: 'Escribí tu destino...',
    field: 'destination',
  },
  {
    step: 2,
    question: '¿Cuándo querés salir?',
    hint: 'Indicá las fechas que tenés en mente.',
    chips: ['Este finde 📅', 'Próximas semanas 🗓️', 'El mes que viene 🌙'],
    placeholder: 'Fecha de salida...',
    field: 'departureDate',
  },
  {
    step: 3,
    question: '¿Cuánto tiempo vas a estar?',
    hint: 'Más días = más experiencias.',
    chips: ['Un finde 2d', 'Una semana 7d', 'Dos semanas 14d'],
    placeholder: 'Duración del viaje...',
    field: 'returnDate',
  },
  {
    step: 4,
    question: '¿Con quién viajás?',
    hint: 'Para encontrar las mejores opciones para tu grupo.',
    chips: ['Solo/a 🧳', 'En pareja 💑', 'Con amigos 👯', 'Familia 👨‍👩‍👧'],
    placeholder: '¿Con quién vas?',
    field: 'travelers',
  },
  {
    step: 5,
    question: '¿Cuál es tu presupuesto?',
    hint: 'Te mostramos opciones que se ajustan a lo que tenés.',
    chips: ['Económico 💸', 'Estándar 💳', 'Confort ✨', 'Lujo 👑'],
    placeholder: 'Tu presupuesto por persona...',
    field: 'budget',
  },
  {
    step: 6,
    question: '¿Qué tipo de alojamiento preferís?',
    hint: 'Cada uno tiene su onda.',
    chips: ['Hotel 🏨', 'Hostel 🛏️', 'Apartamento 🏠', 'Resort 🌴'],
    placeholder: 'Tipo de alojamiento...',
    field: 'accommodationType',
  },
  {
    step: 7,
    question: '¿Qué actividades te interesan?',
    hint: 'Seleccioná todo lo que te llame la atención.',
    chips: ['Playa 🏖️', 'Cultura 🏛️', 'Naturaleza 🌿', 'Gastronomía 🍴'],
    placeholder: 'Actividades...',
    field: 'activities',
  },
  {
    step: 8,
    question: '¿Cómo preferís volar?',
    hint: 'O si vas en otro transporte, cuéntame.',
    chips: ['Vuelo directo ✈️', 'Lo más barato 💸', 'Me da igual 🤷'],
    placeholder: 'Preferencia de vuelo...',
    field: 'flightPreference',
  },
  {
    step: 9,
    question: '¿Algún extra que necesités?',
    hint: 'Detalles que marcan la diferencia.',
    chips: ['WiFi 📶', 'Estacionamiento 🚗', 'Desayuno 🥐', 'Pet-friendly 🐾'],
    placeholder: 'Extras...',
    field: 'extras',
  },
  {
    step: 10,
    question: '¿Algo más que quieras contarme?',
    hint: 'Cuéntame más sobre tu viaje ideal.',
    chips: ['¡Todo perfecto! 🎉', 'Sorprendeme 🎲', 'Accesible ♿'],
    placeholder: 'Comentarios adicionales...',
    field: 'vibe',
  },
]

// ── Mock properties ────────────────────────────────────────────────────────
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Casa Mia Boutique Hotel',
    location: 'Marte, Zona Norte',
    country: 'Planeta Rojo',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    reviewCount: 247,
    pricePerNight: 120,
    currency: 'USD',
    type: 'boutique',
    tags: ['Destacado', 'Vista al mar', 'Desayuno'],
    amenities: [
      { icon: 'wifi', label: 'WiFi gratis' },
      { icon: 'pool', label: 'Piscina' },
      { icon: 'restaurant', label: 'Restaurante' },
      { icon: 'local_parking', label: 'Estacionamiento' },
      { icon: 'fitness_center', label: 'Gimnasio' },
      { icon: 'ac_unit', label: 'Aire acondicionado' },
    ],
    description:
      'Un boutique hotel con vistas espectaculares y servicio personalizado. Cada habitación está diseñada con materiales locales y detalles únicos.',
    coordinates: { lat: -34.6037, lng: -58.3816 },
    platform: {
      name: 'Booking.com',
      price: 120,
      currency: 'USD',
      url: '#',
    },
    externalUrl: '#',
  },
  {
    id: 'prop-2',
    name: 'Ocean Dreams Resort',
    location: 'Playa Central',
    country: 'Costa Azul',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    reviewCount: 189,
    pricePerNight: 95,
    currency: 'USD',
    type: 'resort',
    tags: ['Todo incluido', 'Family friendly'],
    amenities: [
      { icon: 'wifi', label: 'WiFi gratis' },
      { icon: 'pool', label: 'Piscina' },
      { icon: 'beach_access', label: 'Acceso playa' },
    ],
    description: 'Resort frente al mar con todo incluido y actividades para toda la familia.',
    coordinates: { lat: -34.61, lng: -58.39 },
    platform: { name: 'Airbnb', price: 95, currency: 'USD', url: '#' },
    externalUrl: '#',
  },
  {
    id: 'prop-3',
    name: 'Urban Nest Apartments',
    location: 'Centro histórico',
    country: 'Villa Colonial',
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.4,
    reviewCount: 312,
    pricePerNight: 65,
    currency: 'USD',
    type: 'apartment',
    tags: ['Súper anfitrión', 'Cocina completa'],
    amenities: [
      { icon: 'wifi', label: 'WiFi gratis' },
      { icon: 'kitchen', label: 'Cocina' },
      { icon: 'local_laundry_service', label: 'Lavandería' },
    ],
    description: 'Apartamentos modernos en el corazón de la ciudad colonial.',
    coordinates: { lat: -34.62, lng: -58.37 },
    platform: { name: 'Airbnb', price: 65, currency: 'USD', url: '#' },
    externalUrl: '#',
  },
]

// ── Mock trips ─────────────────────────────────────────────────────────────
export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    property: MOCK_PROPERTIES[0],
    criteria: { destination: 'Marte', budget: 'comfort', travelers: 2 },
    status: 'upcoming',
    bookedAt: '2025-05-01T10:00:00Z',
    checkIn: '2025-06-15',
    checkOut: '2025-06-22',
    totalPrice: 840,
    currency: 'USD',
    travelers: 2,
    confirmationCode: 'PLF-ABC123',
  },
  {
    id: 'trip-2',
    property: MOCK_PROPERTIES[1],
    criteria: { destination: 'Costa Azul', budget: 'standard', travelers: 4 },
    status: 'completed',
    bookedAt: '2025-01-10T12:00:00Z',
    checkIn: '2025-02-20',
    checkOut: '2025-02-27',
    totalPrice: 2660,
    currency: 'USD',
    travelers: 4,
    confirmationCode: 'PLF-DEF456',
  },
]

// ── Community posts ────────────────────────────────────────────────────────
export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: {
      id: 'user-2',
      name: 'Sofia M.',
      email: 'sofia@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaIyipApXEiL6RXW5RGEy_2Yj7EKd8yj3IaJkIkT1CkBrQEyFhKJexGmHaEdJG3WdcWa0hcFzQPLqd8d9hLsP5mhDdUcj0y1lH_LPJSh4eWXxQiHXGNIeKGdQqGZJbvBDv2IgwB23E0tdXEQ_q4ItRFNfhXvH59dMi9WqsJO0B-Ib0LXGdBKqTMWNEL9F9o3f7Ln5p8Y49OWjdHJIABdZEeDJO-W0',
      joinDate: '2024-06-01',
      tripsCount: 8,
      reviewsCount: 24,
      badges: ['Explorer', 'Foodie'],
    },
    destination: 'Santorini, Grecia',
    images: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8eeee8f?auto=format&fit=crop&w=800&q=80',
    ],
    caption:
      'Las vistas desde Oia al atardecer son simplemente mágicas 🌅. Planifiqué todo con Planify en 5 minutos y quedó perfecto.',
    likes: 142,
    comments: 23,
    likedByUser: false,
    createdAt: '2025-05-10T18:30:00Z',
    tags: ['Grecia', 'Santorini', 'Sunset', 'Viaje en pareja'],
  },
  {
    id: 'post-2',
    author: {
      id: 'user-3',
      name: 'Marcos R.',
      email: 'marcos@example.com',
      joinDate: '2024-09-15',
      tripsCount: 5,
      reviewsCount: 15,
      badges: ['Adventurer'],
    },
    destination: 'Machu Picchu, Perú',
    images: [
      'https://images.unsplash.com/photo-1526772662643-4c8d1b51c85b?auto=format&fit=crop&w=800&q=80',
    ],
    caption:
      'Después de 4 días de trekking, llegar a Machu Picchu al amanecer fue el momento más épico de mi vida 🏔️.',
    likes: 89,
    comments: 17,
    likedByUser: true,
    createdAt: '2025-04-28T09:15:00Z',
    tags: ['Perú', 'MachuPicchu', 'Trekking', 'Aventura'],
  },
  {
    id: 'post-3',
    author: {
      id: 'user-4',
      name: 'Valentina L.',
      email: 'vale@example.com',
      joinDate: '2025-01-20',
      tripsCount: 2,
      reviewsCount: 6,
      badges: ['Foodie'],
    },
    destination: 'Tokio, Japón',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    ],
    caption: 'Tokio en temporada de sakura es otro nivel 🌸. El ramen a las 3am en Shinjuku fue lo más.',
    likes: 215,
    comments: 41,
    likedByUser: false,
    createdAt: '2025-03-31T14:00:00Z',
    tags: ['Japón', 'Tokio', 'Sakura', 'Gastronomía'],
  },
]
