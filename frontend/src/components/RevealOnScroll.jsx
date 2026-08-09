import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Fades + lifts content into place as it enters the viewport.
 * Respects prefers-reduced-motion by rendering with no animation.
 */
export default function RevealOnScroll({
  children,
  delay = 0,
  y = 18,
  className = '',
  as = 'div',
  once = true,
}) {
  const reduced = useReducedMotion()
  const Component = motion[as] || motion.div

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
