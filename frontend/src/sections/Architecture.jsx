import SectionHeading from '../components/SectionHeading'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import RevealOnScroll from '../components/RevealOnScroll'

const SCOPE = [
  'GitHub — source control',
  'Jenkins + Groovy — pipeline orchestration',
  'pytest — automated testing',
  'Docker — image packaging',
  'Kind — local Kubernetes cluster',
  'Kubernetes — container orchestration',
  'FastAPI — application runtime',
]

export default function Architecture() {
  return (
    <section id="architecture" className="relative border-b border-line bg-base-900/40 py-24 md:py-32">
      <div className="container-industrial">
        <SectionHeading
          num="02"
          eyebrow="Architecture"
          title="What's actually running."
          description="No hidden services, no assumed infrastructure. This is the complete system as implemented today."
        />

        <div className="mt-16 grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-start">
          <RevealOnScroll delay={0.1} className="order-2 lg:order-1 w-full overflow-x-auto py-4">
            <ArchitectureDiagram />
          </RevealOnScroll>

          <RevealOnScroll delay={0.15} className="order-1 lg:order-2 lg:w-72 shrink-0">
            <div className="border border-line bg-base-900/60 p-6">
              <span className="text-mono-label">In scope</span>
              <ul className="mt-4 space-y-2.5">
                {SCOPE.map((s) => (
                  <li key={s} className="flex gap-2.5 font-mono text-[12px] text-paper-dim leading-relaxed">
                    <span className="text-amber-bright shrink-0">·</span>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-5 border-t border-line-soft font-mono text-[11px] text-paper-faint leading-relaxed">
                No databases, message queues, cloud load balancers, Terraform, Helm, ArgoCD or
                observability stack are part of this implementation.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
