import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Loader2 } from 'lucide-react'
import TerminalWindow from './TerminalWindow'

export default function ApiConsole({ method = 'GET', path, description, fetcher }) {
  const [state, setState] = useState('idle') // idle | loading | done
  const [result, setResult] = useState(null)

  const run = async () => {
    if (state === 'loading') return
    setState('loading')
    const { data, source } = await fetcher()
    setResult({ data, source })
    setState('done')
  }

  return (
    <TerminalWindow title={source(result)}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 border border-signal-ok/50 text-signal-ok text-[10px] tracking-wider">
              {method}
            </span>
            <span className="text-paper">{path}</span>
          </div>
          {description && <p className="mt-1.5 text-paper-faint text-[12px]">{description}</p>}
        </div>
        <button
          onClick={run}
          className="flex items-center gap-1.5 border border-line-strong px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase text-paper-dim hover:border-amber hover:text-amber-bright transition-colors focus-visible:outline-amber"
        >
          {state === 'loading' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Play size={11} />
          )}
          {state === 'idle' ? 'Run' : state === 'loading' ? 'Running' : 'Run again'}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden border-t border-line-soft pt-4 text-amber-bright/90 whitespace-pre-wrap break-words text-[12px]"
          >
            {JSON.stringify(result.data, null, 2)}
          </motion.pre>
        )}
      </AnimatePresence>
    </TerminalWindow>
  )
}

function source(result) {
  if (!result) return 'response // awaiting request'
  return result.source === 'live' ? 'response // live' : 'response // static demo data'
}
