import RevealOnScroll from '../components/RevealOnScroll'

export default function Final() {
  return (
    <section id="final" className="relative bg-schematic py-28 md:py-36">
      <div className="container-industrial text-center flex flex-col items-center">
        <RevealOnScroll>
          <span className="font-mono text-[11px] tracking-widest2 uppercase text-paper-faint">
            KARMANYE VADHIKARASTE
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08}>
          <p className="mt-6 font-display font-semibold text-xl md:text-2xl text-paper max-w-md">
            Own the work.
            <br />
            Let the system speak for itself.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.16}>
          <div className="mt-14">
            <span className="font-display font-extrabold text-3xl tracking-tight text-paper">FUSE</span>
            <p className="mt-2 font-mono text-[11px] tracking-widest2 uppercase text-paper-faint">
              FinacPlus Unified Software Engine
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.22}>
          <p className="mt-8 font-mono text-[11px] tracking-[0.14em] uppercase text-paper-faint">
            DevOps Case Study / 2026
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
