import SectionHeading from '../components/SectionHeading'
import RevealOnScroll from '../components/RevealOnScroll'

const BLOCK_CHAIN = ['COMMIT', 'JENKINS', 'PYTEST']
const RECOVER_CHAIN = ['FAIL', 'FIX', 'COMMIT', 'REBUILD', 'DEPLOY']

export default function FailureRecovery() {
  return (
    <section id="recovery" className="relative border-b border-line bg-base-950 py-24 md:py-32">
      <div className="container-industrial">
        <SectionHeading
          num="05"
          eyebrow="Failure & Recovery"
          title="Designed to stop, not to compromise."
          description="A failed test should not become a failed deployment. Every stage in the pipeline is a gate — if one doesn't pass, nothing after it runs."
        />

        <div className="mt-16 grid md:grid-cols-2 gap-10 md:gap-16">
          <RevealOnScroll>
            <span className="text-mono-label">If a stage fails</span>
            <div className="mt-6 flex flex-col items-start gap-0">
              {BLOCK_CHAIN.map((step, i) => (
                <div key={step} className="flex flex-col items-start">
                  <span className="font-mono text-sm tracking-[0.1em] text-paper-dim px-4 py-2 border border-line-soft bg-base-900/50">
                    {step}
                  </span>
                  {i < BLOCK_CHAIN.length - 1 && <span className="h-6 w-px bg-line-strong ml-4" />}
                </div>
              ))}
              <span className="h-6 w-px bg-signal-err ml-4" />
              <div className="border border-signal-err/50 bg-signal-err/10 px-4 py-3">
                <div className="font-mono text-signal-err text-sm tracking-[0.1em]">✕ DEPLOYMENT BLOCKED</div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <span className="text-mono-label">The recovery path</span>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {RECOVER_CHAIN.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="font-mono text-sm tracking-[0.1em] text-paper-dim px-4 py-2 border border-line-soft bg-base-900/50">
                    {step}
                  </span>
                  {i < RECOVER_CHAIN.length - 1 && (
                    <span className="text-amber-bright font-mono text-sm">→</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 text-paper-dim text-sm leading-relaxed max-w-sm">
              Recovery is just the pipeline running again, correctly. There is no special
              rollback ritual — the same six stages that shipped the last working build ship
              the next one.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
