// Static description of the architecture diagram rendered in Section 03.
// Deliberately limited to what is actually implemented — see project scope.
export const ARCHITECTURE_NODES = [
  { id: 'github', label: 'GITHUB', sub: 'source control', row: 0 },
  { id: 'jenkins', label: 'JENKINS', sub: 'pipeline orchestration', row: 1 },
  { id: 'tests', label: 'TESTS', sub: 'pytest', row: 2, branch: true },
  { id: 'docker-build', label: 'DOCKER BUILD', sub: 'image assembly', row: 2, branch: true },
  { id: 'image', label: 'DOCKER IMAGE', sub: 'finacplus-api:local', row: 3 },
  { id: 'kind', label: 'KIND / KUBERNETES', sub: 'local cluster', row: 4 },
  { id: 'pod1', label: 'FINACPLUS POD 1', sub: 'fastapi', row: 5, branch: true },
  { id: 'pod2', label: 'FINACPLUS POD 2', sub: 'fastapi', row: 5, branch: true },
  { id: 'fastapi', label: 'FASTAPI', sub: 'application layer', row: 6 },
]
