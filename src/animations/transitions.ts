import type { Variants } from 'framer-motion'

// Page enter/exit variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
}

export const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.22,
}

// Slide in from right (forward navigation)
export const slideRightVariants: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '-30%' },
}

// Slide in from bottom (sheet/modal)
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' },
}

export const sheetTransition = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
}

// Fade (subtle, no movement)
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// Stagger children
export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

// Button tap
export const tapScale = { scale: 0.95 }
export const hoverScale = { scale: 1.02 }

// Chat bubble entrance
export const chatBubbleVariants: Variants = {
  initial: { opacity: 0, scale: 0.85, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
}
