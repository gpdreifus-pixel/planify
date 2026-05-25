import type { Variants } from 'framer-motion'

// ── Spring presets ─────────────────────────────────────────────────────────
/** Snappy press/release feedback — no bounce */
export const springSnap = { type: 'spring' as const, stiffness: 420, damping: 36 }
/** Smooth card / panel entrance */
export const gentleSpring = { type: 'spring' as const, stiffness: 280, damping: 26, mass: 0.8 }
/** Tab indicator slide */
export const tabSpring = { type: 'spring' as const, stiffness: 400, damping: 34 }

// ── Page enter / exit ──────────────────────────────────────────────────────
/** Subtle scale + fade gives a premium "zoom from depth" feel on enter.
 *  Exit is a fast tween so it doesn't block the incoming screen. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 22, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 28, stiffness: 260, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.985,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

/** Kept for screens that pass transition as a separate prop */
export const pageTransition = {
  type: 'spring' as const,
  damping: 28,
  stiffness: 260,
  mass: 0.8,
}

// Slide in from right (forward navigation)
export const slideRightVariants: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '-30%' },
}

// Slide in from bottom (sheet / modal)
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
}

export const sheetTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 300,
}

// Fade (subtle, no movement)
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// ── Stagger children ───────────────────────────────────────────────────────
/** Slightly faster stagger (55 ms) with shorter delay = snappier list load */
export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
}

/** Spring-based item entrance so every staggered card feels alive */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 280, mass: 0.8 },
  },
}

// ── Interaction helpers ────────────────────────────────────────────────────
export const tapScale = { scale: 0.95 }
export const hoverScale = { scale: 1.02 }

/** Subtle card hover lift with spring snap-back */
export const cardHover = {
  y: -4,
  transition: { type: 'spring' as const, stiffness: 320, damping: 22 },
}

// ── Chat bubble entrance ───────────────────────────────────────────────────
export const chatBubbleVariants: Variants = {
  initial: { opacity: 0, scale: 0.85, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
}
