import { motion } from 'framer-motion'
import { useEffect } from 'react'

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
      {/* Elementos inmersivos de fondo (ondas/chispas mágicas de IA) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,31,0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 0.8] }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,66,0.2) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(30px)',
        }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.5, 1], opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
      />

      {/* Contenedor principal del Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <motion.img
          src="/src/assets/logo.png"
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
