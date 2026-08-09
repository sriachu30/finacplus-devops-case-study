import SectionHeading from '../components/SectionHeading'
import RevealOnScroll from '../components/RevealOnScroll'
import { DELIVERY_STAGES } from '../data/deliveryStages'

export default function Delivery() {
  return (
    <section id="delivery" className="relative border-b border-line bg-base-900/40 py-24 md:py-32">
      <div className="container-industrial">
        <SectionHeading
          num="04"
          eyebrow="Delivery"
          title="What Jenkins runs, stage by stage."
          description="A representative run of the pipeline, shown as static evidence. The frontend has no live connection to Jenkins — this is a demonstration of the workflow's structure, not a real-time build."
        />

        <div className="mt-14 max-w-2xl border border-line bg-base-900 corner-ticks divide-y divide-line-soft">
          {DELIVERY_STAGES.map((s, i) => (
            <RevealOnScroll key={s.id} delay={Math.min(i * 0.05, 0.4)} y={10}>
              <div className="px-5 py-4 font-mono text-[12.5px]">
                <div className="flex items-center justify-between">
                  <span className="tracking-[0.14em] text-paper-dim text-[11px] uppercase">
                    STAGE // {s.stage}
                  </span>
                  <span className="text-signal-ok text-[11px]">✓ passed</span>
                </div>
                <div className="mt-2 text-paper-faint">{s.command}</div>
                <div className="mt-1.5 space-y-0.5">
                  {s.output.map((line, j) => (
                    <div key={j} className="text-amber-bright/85">{line}</div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
