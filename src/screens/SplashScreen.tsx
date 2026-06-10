import { motion } from 'framer-motion'
import { useEffect } from 'react'
import logoSrc from '../assets/logo.png'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // La animación dura aproximadamente 2.8s antes de avisarle a la app que terminó
    const timer = setTimeout(() => {
      onComplete()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      {/* Contenedor principal del Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <motion.img
          src={logoSrc}
          alt="Planify Logo"
          className="w-32 h-32 object-contain"
          initial={{ filter: 'drop-shadow(0 0 0px rgba(255,107,31,0))' }}
          animate={{ filter: 'drop-shadow(0 0 20px rgba(255,107,31,0.4))' }}
          transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        {/* Texto de la marca */}
        <motion.h1
          className="mt-6 text-4xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          planify
        </motion.h1>
      </motion.div>

      {/* Efecto de "Vórtice / Absorción" justo antes de salir */}
      <motion.div
        className="absolute inset-0 bg-[#ff6b1f]"
        style={{ mixBlendMode: 'overlay' }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 1, transition: { duration: 0.4 } }}
      />
    </motion.div>
  )
}
