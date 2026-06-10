import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../animations/transitions'

interface Review {
  id: string
  user: string
  avatar: string
  rating: number
  date: string
  comment: string
}

interface ReviewsModalProps {
  onClose: () => void
  propertyName: string
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    user: 'Marte',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaIyipApXEiL6RXW5RGEy_2Yj7EKd8yj3IaJkIkT1CkBrQEyFhKJexGmHaEdJG3WdcWa0hcFzQPLqd8d9hLsP5mhDdUcj0y1lH_LPJSh4eWXxQiHXGNIeKGdQqGZJbvBDv2IgwB23E0tdXEQ_q4ItRFNfhXvH59dMi9WqsJO0B-Ib0LXGdBKqTMWNEL9F9o3f7Ln5p8Y49OWjdHJIABdZEeDJO-W0',
    rating: 5,
    date: 'Hace 2 semanas',
    comment: '¡Increíble experiencia! El lugar es tal cual las fotos, súper limpio y la atención inmejorable. Definitivamente volveremos.'
  },
  {
    id: 'r2',
    user: 'Julián',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: 'Hace 1 mes',
    comment: 'Muy buena ubicación, cerca de todo. La cama era súper cómoda. El único detalle es que el wifi a veces fallaba un poco.'
  },
  {
    id: 'r3',
    user: 'Sofía',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: 'Hace 2 meses',
    comment: 'Me encantó todo. La vista es espectacular y el lugar tiene una onda muy relajante. ¡Súper recomendado!'
  }
]

export default function ReviewsModal({ onClose, propertyName }: ReviewsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md p-4 pb-0"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4 shadow-2xl h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2" />
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-white font-bold" style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.25rem' }}>
              Reseñas
            </h3>
            <p className="text-white/60" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}>
              {propertyName}
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white w-8 h-8 flex items-center justify-center rounded-full glass-raised">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col gap-4">
            {MOCK_REVIEWS.map((review) => (
              <motion.div key={review.id} variants={staggerItem} className="glass-molded rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                    <div>
                      <p className="text-white font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem' }}>
                        {review.user}
                      </p>
                      <p className="text-white/50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem' }}>
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        style={{ fontSize: 14, color: s <= review.rating ? '#ffb597' : 'rgba(255,255,255,0.2)' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.875rem' }}>
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
