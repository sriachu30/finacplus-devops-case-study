import SectionHeading from '../components/SectionHeading'
import RevealOnScroll from '../components/RevealOnScroll'

const BRANCHES = [
  { repo: 'REPO A', cluster: 'K8S-A' },
  { repo: 'REPO B', cluster: 'K8S-B' },
  { repo: 'REPO C', cluster: 'K8S-C' },
]

export default function Scale() {
  return (
    <section id="scale" className="relative border-b border-line bg-base-900/40 py-24 md:py-32">
      <div className="container-industrial">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-xs text-amber-bright">06</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="text-eyebrow">Scale</span>
          <span className="ml-2 px-2 py-0.5 border border-amber-dim text-amber-bright font-mono text-[10px] tracking-widest2 uppercase">
            Future evolution — not implemented
          </span>
        </div>

        <RevealOnScroll delay={0.06}>
          <h2 className="font-display font-bold text-clamp-h2 leading-[1.05] text-paper tracking-tight max-w-2xl">
            Today it's one cluster. The pipeline is shaped to hold more.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.12}>
          <p className="mt-5 text-paper-dim text-base md:text-lg leading-relaxed max-w-2xl">
            The current implementation runs locally against a single Kind cluster. Jenkins is
            already parameterized enough that repositories, environments, and clusters could be
            added without redesigning the pipeline — this is a direction the architecture allows
            for, not something running today.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.18} className="mt-16 overflow-x-auto">
          <div className="min-w-[560px] flex flex-col items-center">
            <div className="border border-line-strong bg-base-900 px-5 py-3 font-mono text-[13px] tracking-[0.08em] text-paper">
              JENKINS
            </div>
            <div className="w-full max-w-md h-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-px bg-line-strong" />
              <div className="absolute top-4 left-1/6 right-1/6 h-px bg-line-strong" />
            </div>
            <div className="flex gap-10">
              {BRANCHES.map((b) => (
                <div key={b.repo} className="flex flex-col items-center">
                  <span className="h-4 w-px bg-line-strong" />
                  <div className="border border-line-soft bg-base-900/60 px-4 py-2 font-mono text-[11px] text-paper-dim">
                    {b.repo}
                  </div>
                  <span className="h-6 w-px bg-line-strong" />
                  <div className="border border-dashed border-amber-dim bg-amber-faint px-4 py-2 font-mono text-[11px] text-amber-bright">
                    {b.cluster}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
