import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function PipelineStageCard({ stage, index, isLast }) {
  const [open, setOpen] = useState(false)
  const panelId = `stage-panel-${stage.id}`

  return (
    <div className="relative">
      <div className="flex gap-4 md:gap-6">
        <div className="flex flex-col items-center">
          <span className="font-mono text-[11px] text-paper-faint pt-1">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className={`mt-2 h-2.5 w-2.5 border transition-colors ${
              open ? 'bg-amber border-amber' : 'border-line-strong bg-base-900'
            }`}
          />
          {!isLast && <span className="w-px flex-1 bg-line mt-2" />}
        </div>

        <div className="flex-1 pb-8">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between gap-4 border border-line bg-base-900/50 hover:border-line-strong px-5 py-4 transition-colors">
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display font-bold text-lg md:text-xl text-paper tracking-tight">
                    {stage.label}
                  </h3>
                  <span className="font-mono text-[11px] text-paper-faint tracking-widest2 uppercase">
                    {stage.tool}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-paper-faint shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-amber-bright' : ''}`}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-3 gap-px bg-line mt-px border border-t-0 border-line">
                  <DetailBlock label="WHAT IT DOES" text={stage.what} />
                  <DetailBlock label="WHY IT EXISTS" text={stage.why} />
                  <DetailBlock label="IF IT FAILS" text={stage.fail} accent />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function DetailBlock({ label, text, accent }) {
  return (
    <div className="bg-base-900 p-5">
      <span className={`font-mono text-[10px] tracking-widest2 uppercase ${accent ? 'text-signal-err' : 'text-amber-bright'}`}>
        {label}
      </span>
      <p className="mt-2.5 text-sm text-paper-dim leading-relaxed">{text}</p>
    </div>
  )
}
