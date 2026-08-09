import SectionHeading from '../components/SectionHeading'
import ApiConsole from '../components/ApiConsole'
import RevealOnScroll from '../components/RevealOnScroll'
import { getHealth, getAccounts, getAccount, apiConfig } from '../services/api'

export default function Application() {
  return (
    <section id="application" className="relative border-b border-line bg-base-950 py-24 md:py-32">
      <div className="container-industrial">
        <SectionHeading
          num="03"
          eyebrow="Application"
          title="The thing the pipeline actually ships."
          description="FinacPlus runs as a FastAPI service. Run a request below — if a live backend is reachable at the configured API base it responds directly, otherwise you're looking at static demo data with the same shape."
        />

        <RevealOnScroll delay={0.1} className="mt-8">
          <p className="font-mono text-[11px] text-paper-faint">
            API_BASE_URL <span className="text-paper-dim">{apiConfig.baseUrl}</span>
          </p>
        </RevealOnScroll>

        <div className="mt-8 grid gap-5 max-w-2xl">
          <RevealOnScroll delay={0.12}>
            <ApiConsole
              path="/health"
              description="Confirms the service is running and reachable."
              fetcher={getHealth}
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.18}>
            <ApiConsole
              path="/api/accounts"
              description="Lists FinacPlus customer accounts."
              fetcher={getAccounts}
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.24}>
            <ApiConsole
              path="/api/accounts/{account_id}"
              description="Returns a single account by ID."
              fetcher={() => getAccount('ACC-1001')}
            />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
