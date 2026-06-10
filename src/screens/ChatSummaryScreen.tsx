import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppBackground from '../components/ui/AppBackground'
import TopAppBar from '../components/ui/TopAppBar'
import { useChatStore } from '../store/chatStore'
import { useSearchStore } from '../store/searchStore'
import { staggerContainer, staggerItem } from '../animations/transitions'
import { CHAT_STEPS } from '../data/mockData'
import ChatAnswerChips from '../components/chat/ChatAnswerChips'
import type { TripSearchCriteria } from '../types'

const FIELD_META: Record<string, { icon: string; label: string }> = {
  destination:       { icon: 'location_on',    label: 'Destino' },
  departureDate:     { icon: 'calendar_month', label: 'Fecha de salida' },
  returnDate:        { icon: 'event',          label: 'Duración' },
  travelers:         { icon: 'group',          label: 'Viajeros' },
  budget:            { icon: 'payments',       label: 'Presupuesto' },
  accommodationType: { icon: 'hotel',          label: 'Alojamiento' },
  activities:        { icon: 'explore',        label: 'Actividades' },
  flightPreference:  { icon: 'flight_takeoff', label: 'Vuelo' },
  extras:            { icon: 'interests',      label: 'Extras' },
  vibe:              { icon: 'mood',           label: 'Vibra' },
}

export default function ChatSummaryScreen() {
  const navigate = useNavigate()
  const { criteria, setCriteria } = useChatStore()
  const { search, isLoading } = useSearchStore()

  const [editingField, setEditingField] = useState<keyof TripSearchCriteria | null>(null)
  const [editValue, setEditValue] = useState<string | string[]>('')

  const entries = Object.entries(criteria).filter(([, v]) => v !== undefined && v !== '')

  const handleSearch = async () => {
    await search(criteria)
    navigate('/results')
  }

  const handleEditClick = (key: string, value: any) => {
    setEditingField(key as keyof TripSearchCriteria)
    setEditValue(value)
  }

  const handleSaveEdit = () => {
    if (editingField) {
      setCriteria({ [editingField]: editValue })
    }
    setEditingField(null)
  }

  const editingStepData = editingField ? CHAT_STEPS.find(s => s.field === editingField) : null

  return (
    <AppBackground variant="chat">
      <TopAppBar backTo="/chat/10" title="Tu búsqueda" rightSlot={
        <span
          className="text-white/70"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600 }}
        >
          10/10
        </span>
      } />

      <main className="flex-1 flex flex-col relative z-10 px-6 pb-32 max-w-md mx-auto w-full">
        {/* Summary pills — glass-molded rounded-full, one per criteria item */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-3 mb-8"
        >
          {entries.length === 0 ? (
            <p
              className="text-white/55 text-sm py-8 text-center"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              No ingresaste ningún criterio.
            </p>
          ) : (
            entries.map(([key, value]) => {
              const meta = FIELD_META[key] ?? { icon: 'info', label: key }
              return (
                <motion.div
                  key={key}
                  variants={staggerItem}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                  onClick={() => handleEditClick(key, value)}
                  className="glass-molded rounded-full p-3.5 flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full glass-raised flex items-center justify-center text-white flex-shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {meta.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-white/65 uppercase tracking-wider"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.6875rem', fontWeight: 600 }}
                    >
                      {meta.label}
                    </p>
                    <p
                      className="text-white font-bold truncate drop-shadow-sm"
                      style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.0625rem' }}
                    >
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-white/40 mr-2" style={{ fontSize: 20 }}>edit</span>
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full py-4 rounded-full neu-btn-primary text-white font-bold disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {isLoading ? 'Buscando...' : 'Buscar opciones'}
            {!isLoading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>}
          </motion.button>
        </div>
      </main>

      {/* Edit Modal (Bottom Sheet) */}
      <AnimatePresence>
        {editingStepData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-0"
            onClick={() => setEditingField(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2" />
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem' }}>
                  Editar {FIELD_META[editingField as string]?.label}
                </h3>
                <button onClick={() => setEditingField(null)} className="text-white/60 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <p className="text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem' }}>
                {editingStepData.question}
              </p>
              
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pb-4">
                {editingStepData.chips && (
                  <div className="-ml-[52px]">
                    <ChatAnswerChips
                      chips={editingStepData.chips}
                      isMulti={editingStepData.isMulti}
                      selectedValues={Array.isArray(editValue) ? editValue : (editValue ? [editValue as string] : [])}
                      onSelect={(chip) => {
                        if (editingStepData.isMulti) {
                          let current = Array.isArray(editValue) ? [...editValue] : []
                          if (chip.includes('Nada más') || chip.includes('Ninguno')) {
                            current = [chip]
                          } else {
                            current = current.filter(c => !c.includes('Nada más') && !c.includes('Ninguno'))
                            if (current.includes(chip)) {
                              current = current.filter(c => c !== chip)
                            } else {
                              current.push(chip)
                            }
                          }
                          setEditValue(current)
                        } else {
                          setEditValue(chip)
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pb-6">
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-3.5 rounded-full neu-btn-primary text-white font-bold flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem' }}
                >
                  Guardar cambios
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppBackground>
  )
}

