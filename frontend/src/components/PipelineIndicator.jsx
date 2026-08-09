import { useScrollProgress } from '../hooks/useScrollProgress'

const STAGES = ['SOURCE', 'BUILD', 'TEST', 'PACKAGE', 'DEPLOY', 'OPERATE']

export default function PipelineIndicator() {
  const progress = useScrollProgress()
  const activeIndex = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))

  return (
    <div
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3"
      aria-hidden="true"
    >
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex items-center gap-2.5 group">
          <span
            className={`font-mono text-[10px] tracking-[0.14em] transition-colors duration-500 ${
              i === activeIndex ? 'text-amber-bright' : 'text-paper-faint/50'
            }`}
          >
            {stage}
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? 'bg-amber-bright scale-125 shadow-[0_0_8px_rgba(224,152,59,0.7)]'
                : i < activeIndex
                  ? 'bg-amber-dim'
                  : 'bg-base-600'
            }`}
          />
        </div>
      ))}
      <div className="w-px h-24 bg-line mt-1 relative">
        <div
          className="absolute top-0 left-0 w-px bg-amber-bright transition-all duration-300"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
