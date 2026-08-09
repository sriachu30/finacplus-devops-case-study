// All values here are static, illustrative evidence of the pipeline's
// structure and behavior — not a live feed. Nothing here is fabricated
// beyond what the project brief specifies; placeholders are labeled.
export const EVIDENCE_LOG = [
  {
    system: 'GIT',
    icon: 'git-commit-horizontal',
    lines: ['ci: add Jenkins pipeline', 'feat: deploy FinacPlus API to Kubernetes'],
  },
  {
    system: 'JENKINS',
    icon: 'workflow',
    lines: ['Finished: SUCCESS', 'Stage view: 10/10 stages passed'],
  },
  {
    system: 'KUBERNETES',
    icon: 'boxes',
    lines: ['2 / 2 replicas available', 'deployment/finacplus-api  Ready'],
  },
  {
    system: 'APPLICATION',
    icon: 'heart-pulse',
    lines: ['GET /health', '{"status":"healthy"}'],
  },
  {
    system: 'API',
    icon: 'database',
    lines: ['GET /api/accounts', '3 accounts returned'],
  },
]
