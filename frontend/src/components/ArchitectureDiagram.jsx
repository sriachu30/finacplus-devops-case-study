import RevealOnScroll from './RevealOnScroll'

function Node({ label, sub, wide }) {
  return (
    <div
      className={`corner-ticks border border-line-strong bg-base-900 px-4 py-3 text-center ${wide ? 'w-full sm:w-56' : 'w-44 sm:w-48'}`}
    >
      <div className="font-mono text-[12px] sm:text-[13px] tracking-[0.08em] text-paper">{label}</div>
      {sub && <div className="mt-1 font-mono text-[10px] text-paper-faint">{sub}</div>}
    </div>
  )
}

function VLine({ h = 28 }) {
  return <div className="w-px bg-line-strong" style={{ height: h }} aria-hidden="true" />
}

export default function ArchitectureDiagram() {
  return (
    <div className="flex flex-col items-center" role="img" aria-label="Architecture diagram: GitHub commits trigger Jenkins, which runs tests and a Docker build, producing a Docker image deployed to a Kind Kubernetes cluster running two FinacPlus pods behind FastAPI.">
      <RevealOnScroll><Node label="GITHUB" sub="commit" /></RevealOnScroll>
      <VLine />
      <RevealOnScroll delay={0.05}><Node label="JENKINS" sub="pipeline orchestration" /></RevealOnScroll>
      <VLine h={20} />

      {/* branch: tests + docker build */}
      <div className="relative w-full max-w-md">
        <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-px bg-line-strong" />
      </div>
      <div className="flex gap-8 sm:gap-16">
        <div className="flex flex-col items-center">
          <VLine h={16} />
          <RevealOnScroll delay={0.1}><Node label="TESTS" sub="pytest" /></RevealOnScroll>
        </div>
        <div className="flex flex-col items-center">
          <VLine h={16} />
          <RevealOnScroll delay={0.15}><Node label="DOCKER BUILD" sub="image assembly" /></RevealOnScroll>
        </div>
      </div>

      <div className="relative w-full max-w-md h-6">
        <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-px bg-line-strong" />
      </div>
      <VLine h={8} />
      <RevealOnScroll delay={0.2}><Node label="DOCKER IMAGE" sub="finacplus-api:local" /></RevealOnScroll>
      <VLine />
      <RevealOnScroll delay={0.25}><Node label="KIND / KUBERNETES" sub="local cluster" wide /></RevealOnScroll>
      <VLine h={20} />

      <div className="flex gap-8 sm:gap-20">
        <div className="flex flex-col items-center">
          <VLine h={16} />
          <RevealOnScroll delay={0.3}><Node label="FINACPLUS POD 1" sub="fastapi" /></RevealOnScroll>
        </div>
        <div className="flex flex-col items-center">
          <VLine h={16} />
          <RevealOnScroll delay={0.35}><Node label="FINACPLUS POD 2" sub="fastapi" /></RevealOnScroll>
        </div>
      </div>

      <div className="relative w-full max-w-md h-6">
        <div className="hidden sm:block absolute top-0 left-1/4 right-1/4 h-px bg-line-strong" />
      </div>
      <VLine h={8} />
      <RevealOnScroll delay={0.4}>
        <div className="border border-amber-dim bg-amber-faint px-5 py-3 text-center">
          <div className="font-mono text-[13px] tracking-[0.1em] text-amber-bright">FASTAPI</div>
          <div className="mt-1 font-mono text-[10px] text-paper-faint">application layer</div>
        </div>
      </RevealOnScroll>
    </div>
  )
}
