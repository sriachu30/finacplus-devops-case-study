import { GitCommitHorizontal, Workflow, Boxes, HeartPulse, Database } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import RevealOnScroll from '../components/RevealOnScroll'
import { EVIDENCE_LOG } from '../data/evidence'

const ICONS = {
  'git-commit-horizontal': GitCommitHorizontal,
  workflow: Workflow,
  boxes: Boxes,
  'heart-pulse': HeartPulse,
  database: Database,
}

export default function Evidence() {
  return (
    <section id="evidence" className="relative border-b border-line bg-base-950 py-24 md:py-32">
      <div className="container-industrial">
        <SectionHeading
          num="07"
          eyebrow="Evidence"
          title="Don't take my word for it."
          description="Static logs pulled from the actual pipeline run and application responses — not testimonials, not marketing copy."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line max-w-4xl">
          {EVIDENCE_LOG.map((entry, i) => {
            const Icon = ICONS[entry.icon]
            return (
              <RevealOnScroll key={entry.system} delay={i * 0.06} className="bg-base-950">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className="text-amber-bright" />
                    <span className="font-mono text-[11px] tracking-widest2 uppercase text-paper-dim">
                      {entry.system}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1.5 font-mono text-[12px] text-paper-faint leading-relaxed">
                    {entry.lines.map((line, j) => (
                      <div key={j} className={j === 0 ? 'text-paper' : ''}>{line}</div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
