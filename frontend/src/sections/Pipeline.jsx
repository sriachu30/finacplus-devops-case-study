import SectionHeading from '../components/SectionHeading'
import PipelineStageCard from '../components/PipelineStageCard'
import { PIPELINE_STAGES } from '../data/pipelineStages'

export default function Pipeline() {
  return (
    <section id="pipeline" className="relative border-b border-line bg-base-950 py-24 md:py-32">
      <div className="container-industrial">
        <SectionHeading
          num="01"
          eyebrow="Pipeline"
          title="Six stages. One path from commit to running system."
          description="Each stage gates the next. Nothing reaches production without passing through every step below — expand a stage to see what it does, why it's there, and what happens if it fails."
        />

        <div className="mt-16 max-w-3xl">
          {PIPELINE_STAGES.map((stage, i) => (
            <PipelineStageCard
              key={stage.id}
              stage={stage}
              index={i}
              isLast={i === PIPELINE_STAGES.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
