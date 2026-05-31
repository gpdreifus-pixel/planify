import { motion } from 'framer-motion'

/** Atmospheric gradient background used across all screens.
 *  variant="chat" → purple-to-orange gradient (screens 01–19)
 *  variant="app"  → dark glassmorphism with ambient circles (screens 15–24)
 */
interface AppBackgroundProps {
  variant?: 'chat' | 'app'
  children?: React.ReactNode
}

export default function AppBackground({ variant = 'chat', children }: AppBackgroundProps) {
  if (variant === 'app') {
    return (
      <div
        className="relative min-h-dvh flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)',
        }}
      >
        {/* Ambient blobs */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.05, 0.95, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none fixed -top-[15%] -right-[20%] w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #7459f7 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 0,
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none fixed -bottom-[10%] -left-[15%] w-[400px] h-[400px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, #ff6b1f 0%, transparent 70%)',
            filter: 'blur(70px)',
            zIndex: 0,
          }}
        />
        <motion.div
          animate={{ x: [0, 20, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none fixed top-[35%] left-[5%] w-[300px] h-[300px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #5b3cdd 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: 0,
          }}
        />
        {children}
      </div>
    )
  }

  return (
    <div className="app-bg-chat relative min-h-dvh flex flex-col text-white antialiased overflow-hidden">
      {/* Background animated blobs for chat variant */}
      <motion.div
        className="pointer-events-none fixed -bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-40 mix-blend-screen"
        animate={{ x: [0, 50, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.1, 0.9, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #ff8c42 0%, transparent 60%)',
          filter: 'blur(90px)',
          zIndex: 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed -bottom-[20%] left-[30%] w-[800px] h-[800px] rounded-full opacity-30 mix-blend-screen"
        animate={{ x: [0, -60, 40, 0], y: [0, 40, -60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #ff6b1f 0%, transparent 70%)',
          filter: 'blur(110px)',
          zIndex: 0,
        }}
      />
      <motion.div
        className="pointer-events-none fixed bottom-[5%] -right-[10%] w-[500px] h-[500px] rounded-full opacity-40 mix-blend-screen"
        animate={{ x: [0, 40, -50, 0], y: [0, -30, 50, 0], scale: [1, 1.2, 0.8, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, #c49ba2 0%, transparent 60%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full flex-1 flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}
