import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import StatusDot from '../components/StatusDot'

const CHECKS = ['BUILD', 'TEST', 'CONTAINER', 'DEPLOYMENT']

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-schematic border-b border-line"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950 pointer-events-none" />

      <div className="container-industrial relative pt-28 pb-16">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-eyebrow mb-6"
        >
          FINACPLUS / DEVOPS CASE STUDY / 2026
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold text-clamp-hero leading-[0.92] tracking-tight text-paper"
        >
          FUSE
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 font-mono text-xs md:text-sm tracking-widest2 uppercase text-paper-dim"
        >
          FinacPlus Unified Software Engine
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 md:mt-12"
        >
          <p className="font-display font-semibold text-2xl md:text-4xl leading-tight text-paper">
            FROM COMMIT.
            <br />
            TO CLUSTER.
          </p>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-lg text-paper-dim text-sm md:text-base leading-relaxed"
        >
          An automated CI/CD system built around GitHub, Jenkins, Groovy, Docker and
          Kubernetes — delivering a live FastAPI service, commit by commit.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.52 }}
          className="mt-12 max-w-sm border border-line bg-base-900/70 corner-ticks"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-line">
            <StatusDot status="ok" label="PIPELINE OPERATIONAL" pulse />
          </div>
          <ul className="px-5 py-4 space-y-2.5">
            {CHECKS.map((c, i) => (
              <motion.li
                key={c}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.09 }}
                className="flex items-center justify-between font-mono text-xs tracking-[0.1em] uppercase"
              >
                <span className="text-paper-dim">{c}</span>
                <span className="text-signal-ok">✓</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-0 right-0 container-industrial flex items-center justify-between"
      >
        <span className="font-mono text-[10px] tracking-widest2 uppercase text-paper-faint">
          scroll
        </span>
        <span className="h-8 w-px bg-line-strong" />
      </motion.div>
    </section>
  )
}
