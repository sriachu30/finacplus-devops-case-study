import Nav from './components/Nav'
import PipelineIndicator from './components/PipelineIndicator'
import Hero from './sections/Hero'
import Pipeline from './sections/Pipeline'
import Architecture from './sections/Architecture'
import Application from './sections/Application'
import Delivery from './sections/Delivery'
import FailureRecovery from './sections/FailureRecovery'
import Scale from './sections/Scale'
import Evidence from './sections/Evidence'
import Final from './sections/Final'

export default function App() {
  return (
    <div className="min-h-screen bg-base-950 text-paper">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-amber focus:text-base-950 focus:px-4 focus:py-2 focus:font-mono focus:text-xs"
      >
        Skip to content
      </a>
      <Nav />
      <PipelineIndicator />
      <main>
        <Hero />
        <Pipeline />
        <Architecture />
        <Application />
        <Delivery />
        <FailureRecovery />
        <Scale />
        <Evidence />
        <Final />
      </main>
    </div>
  )
}
