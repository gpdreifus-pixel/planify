import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import BottomNav from '../components/ui/BottomNav'
import { useSearchStore } from '../store/searchStore'
import { MOCK_PROPERTIES } from '../data/mockData'
import type { Property } from '../types'

// ── Custom price-label marker icon ────────────────────────────────────────────
function makePriceIcon(price: number, selected: boolean): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${selected ? '#ffffff' : 'linear-gradient(to right, #ff8c42, #ff6b1f)'};
      color: ${selected ? '#ff6b1f' : '#ffffff'};
      padding: 6px 13px;
      border-radius: 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0,0,0,0.45);
      border: ${selected ? '2px solid #ff6b1f' : '1.5px solid rgba(255,255,255,0.35)'};
      cursor: pointer;
      transform: ${selected ? 'scale(1.12)' : 'scale(1)'};
      transition: transform 0.15s ease;
    ">$${price}</div>`,
    iconSize: [72, 32],
    iconAnchor: [36, 16],
  })
}

export default function MapScreen() {
  const navigate = useNavigate()
  const { filteredResults } = useSearchStore()
  const properties = filteredResults.length > 0 ? filteredResults : MOCK_PROPERTIES

  const [selected, setSelected] = useState<Property | null>(null)

  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  // ── Initialise map ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const center: [number, number] =
      properties.length > 0
        ? [properties[0].coordinates.lat, properties[0].coordinates.lng]
        : [-34.6037, -58.3816]

    const map = L.map(mapDivRef.current, {
      center,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    })

    // Dark map tiles — free, no API key required
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        detectRetina: true,
      }
    ).addTo(map)

    // Minimal attribution in the corner
    L.control
      .attribution({ position: 'bottomleft', prefix: false })
      .addAttribution(
        '© <a href="https://carto.com/attributions" style="color:#fff8" target="_blank">CARTO</a>'
      )
      .addTo(map)

    // Add markers
    properties.forEach((property) => {
      const marker = L.marker(
        [property.coordinates.lat, property.coordinates.lng],
        { icon: makePriceIcon(property.pricePerNight, false) }
      ).addTo(map)

      marker.on('click', () => {
        setSelected((prev) => (prev?.id === property.id ? null : property))
      })

      markersRef.current.set(property.id, marker)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Update marker icons when selection changes ────────────────────────────
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const prop = properties.find((p) => p.id === id)
      if (!prop) return
      marker.setIcon(makePriceIcon(prop.pricePerNight, selected?.id === id))
    })
  }, [selected, properties])

  return (
    <AppBackground variant="chat">
      <TopAppBar backTo="/results" title="Mapa" />

      {/* Map fills remaining height; BottomNav is fixed so no pb needed */}
      <div className="flex-1 relative w-full" style={{ minHeight: 0 }}>
        {/* Leaflet mount target */}
        <div ref={mapDivRef} className="absolute inset-0" />

        {/* Tap-away overlay — closes bottom sheet without interacting with map */}
        {selected && (
          <div
            className="absolute inset-0"
            style={{ zIndex: 400 }}
            onClick={() => setSelected(null)}
          />
        )}

        {/* ── Bottom property card ────────────────────────────────────────── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              // sits above BottomNav (z-50 = 50 in Tailwind ≈ z-index:50)
              // Leaflet tiles are z-200 but we need the sheet above Leaflet
              className="absolute left-4 right-4 glass-panel rounded-[24px] p-3 flex gap-3 items-center"
              style={{ bottom: '5.5rem', zIndex: 1001 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Thumbnail */}
              <img
                src={selected.images[0]}
                alt={selected.name}
                className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-white font-bold truncate"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem' }}
                >
                  {selected.name}
                </p>
                <p
                  className="text-white/55 truncate mt-0.5"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.8125rem',
                  }}
                >
                  {selected.location}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span style={{ color: '#ffb597', fontSize: '0.8rem' }}>★</span>
                  <span
                    className="text-white font-semibold"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.8125rem',
                    }}
                  >
                    {selected.rating}
                  </span>
                  <span
                    className="ml-auto text-white font-bold"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem' }}
                  >
                    ${selected.pricePerNight}
                    <span
                      className="text-white/50 font-normal"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {' '}
                      /noche
                    </span>
                  </span>
                </div>
              </div>

              {/* Ver detalle arrow */}
              <motion.button
                whileTap={{ scale: 0.90 }}
                onClick={() => navigate(`/results/${selected.id}`)}
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(to right, #ff8c42, #ff6b1f)',
                  boxShadow: '0 4px 14px rgba(255,140,66,0.45)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  arrow_forward
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeIndex={0} />
    </AppBackground>
  )
}
