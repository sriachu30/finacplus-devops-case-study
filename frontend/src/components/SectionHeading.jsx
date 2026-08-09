import RevealOnScroll from './RevealOnScroll'

export default function SectionHeading({ num, eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center mx-auto max-w-2xl' : ''}>
      <RevealOnScroll>
        <div className={`flex items-center gap-3 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="font-mono text-xs text-amber-bright">{num}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="text-eyebrow">{eyebrow}</span>
        </div>
      </RevealOnScroll>
      <RevealOnScroll delay={0.06}>
        <h2 className="font-display font-bold text-clamp-h2 leading-[1.05] text-paper tracking-tight">
          {title}
        </h2>
      </RevealOnScroll>
      {description && (
        <RevealOnScroll delay={0.12}>
          <p className="mt-5 text-paper-dim text-base md:text-lg leading-relaxed max-w-2xl">
            {description}
          </p>
        </RevealOnScroll>
      )}
    </div>
  )
}
