// NOTE: All console output below is static demo evidence used to illustrate
// the pipeline's structure. It is not a live connection to Jenkins.
export const DELIVERY_STAGES = [
  {
    id: 'checkout',
    stage: 'CHECKOUT',
    command: '$ git checkout main && git pull',
    output: ['Already up to date.', 'HEAD at a1c9f2e'],
    status: 'ok',
  },
  {
    id: 'python-tests',
    stage: 'PYTHON TESTS',
    command: '$ python -m pytest -v',
    output: ['test_health.py::test_health_ok PASSED', 'test_accounts.py::test_list_accounts PASSED', 'test_accounts.py::test_get_account PASSED', '6 tests passed'],
    status: 'ok',
  },
  {
    id: 'docker-build',
    stage: 'DOCKER BUILD',
    command: '$ docker build -t finacplus-api:local .',
    output: ['Step 6/6 : CMD ["uvicorn", "app.main:app"]', 'Successfully built finacplus-api:local'],
    status: 'ok',
  },
  {
    id: 'image-verify',
    stage: 'IMAGE VERIFY',
    command: '$ docker inspect finacplus-api:local',
    output: ['Image present', 'Entrypoint verified'],
    status: 'ok',
  },
  {
    id: 'kind-cluster',
    stage: 'KIND CLUSTER',
    command: '$ kind get clusters',
    output: ['finacplus-local'],
    status: 'ok',
  },
  {
    id: 'load-image',
    stage: 'LOAD IMAGE',
    command: '$ kind load docker-image finacplus-api:local',
    output: ['Image loaded into node: finacplus-local-control-plane'],
    status: 'ok',
  },
  {
    id: 'k8s-deploy',
    stage: 'K8S DEPLOY',
    command: '$ kubectl apply -f k8s/',
    output: ['deployment.apps/finacplus-api configured', 'service/finacplus-api unchanged'],
    status: 'ok',
  },
  {
    id: 'rollout',
    stage: 'ROLLOUT',
    command: '$ kubectl rollout status deployment/finacplus-api',
    output: ['deployment "finacplus-api" successfully rolled out'],
    status: 'ok',
  },
  {
    id: 'health-check',
    stage: 'HEALTH CHECK',
    command: '$ curl -s localhost:8000/health',
    output: ['{"status":"healthy"}'],
    status: 'ok',
  },
  {
    id: 'api-validation',
    stage: 'API VALIDATION',
    command: '$ curl -s localhost:8000/api/accounts | jq length',
    output: ['3'],
    status: 'ok',
  },
]
