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
        <div
          className="pointer-events-none fixed -top-[15%] -right-[20%] w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, #7459f7 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 0,
          }}
        />
        <div
          className="pointer-events-none fixed -bottom-[10%] -left-[15%] w-[400px] h-[400px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, #ff6b1f 0%, transparent 70%)',
            filter: 'blur(70px)',
            zIndex: 0,
          }}
        />
        <div
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
    <div className="app-bg-chat relative min-h-dvh flex flex-col items-center text-white antialiased">
      <div className="bg-circle-1" />
      <div className="bg-circle-2" />
      <div className="bg-circle-3" />
      {children}
    </div>
  )
}
