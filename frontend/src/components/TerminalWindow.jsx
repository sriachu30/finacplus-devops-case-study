export default function TerminalWindow({ title, children, className = '' }) {
  return (
    <div className={`border border-line bg-base-900 corner-ticks ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 border border-line-strong" />
          <span className="h-2.5 w-2.5 border border-line-strong" />
          <span className="h-2.5 w-2.5 border border-line-strong" />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-faint">
          {title}
        </span>
        <span className="w-14" aria-hidden="true" />
      </div>
      <div className="p-4 md:p-5 font-mono text-[13px] leading-relaxed">{children}</div>
    </div>
  )
}
