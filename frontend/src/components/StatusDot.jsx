const COLORS = {
  ok: 'bg-signal-ok',
  warn: 'bg-signal-warn',
  err: 'bg-signal-err',
  idle: 'bg-base-500',
}

export default function StatusDot({ status = 'ok', label, pulse = false }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-paper-dim">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${COLORS[status]} opacity-50`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${COLORS[status]}`} />
      </span>
      {label}
    </span>
  )
}
