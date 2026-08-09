# FinacPlus DevOps Case Study

## Case Study Objective

Demonstrate an end-to-end DevOps workflow for FinacPlus using Git, Jenkins, Docker, and Kubernetes, from source control through automated build, test, containerization, and deployment.

## Current Status

- Phase 1 complete: sample FinacPlus API implemented with automated tests.
- Phase 2 complete: API containerized with Docker and validated locally.
- Phase 3 complete: API deployed to a local Kubernetes cluster using Kind and validated end-to-end.
- Jenkins CI/CD pipeline is planned for the next phase.

## Application

The **FinacPlus API** is a small mock financial REST service. It provides static account data for the CI/CD pipeline to build, test, containerize, and deploy.

### Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Returns service health status |
| GET | `/api/accounts` | Returns a list of mock financial accounts |
| GET | `/api/accounts/{account_id}` | Returns a single account by ID, or HTTP 404 if not found |

---

## Local Development

### Install dependencies

Create and activate a local virtual environment, then install dependencies:

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### Run the API locally

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Example health check:

```bash
curl http://127.0.0.1:8000/health
```

### Run the tests

```bash
pytest
```

The current test suite contains six tests covering the API endpoints and expected responses.

---

## Docker

The application is containerized as a reproducible deployment artifact using Docker.

### Build the Docker image

```bash
docker build -t finacplus-api:local .
```

### Run the container

```bash
docker run --name finacplus-api-local -p 8000:8000 finacplus-api:local
```

The API is then available at:

```text
http://localhost:8000
```

### Validate the container

Health endpoint:

```text
http://localhost:8000/health
```

Expected response:

```json
{"status":"healthy"}
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

The container is configured to run the application as a non-root user (`appuser`) for improved container security.

### Docker image

The locally built image is:

```text
finacplus-api:local
```

The image is intended to become the deployable artifact consumed by the future CI/CD pipeline.

Detailed Docker implementation and validation steps are documented in:

```text
docs/docker.md
```

---

## Kubernetes

The FinacPlus API is deployed to a local Kubernetes cluster using Kind.

### Create the cluster

```bash
kind create cluster --name finacplus --wait 5m
```

The Kubernetes context is:

```text
kind-finacplus
```

Verify the cluster:

```bash
kubectl get nodes
```

### Load the Docker image into Kind

Because Kind uses its own node environment, the locally built Docker image is explicitly loaded into the cluster:

```bash
kind load docker-image finacplus-api:local --name finacplus
```

### Deploy the application

Kubernetes manifests are stored under:

```text
k8s/
├── deployment.yaml
└── service.yaml
```

Apply the manifests:

```bash
kubectl apply -f k8s/
```

### Verify the deployment

Check the Pods:

```bash
kubectl get pods
```

Expected state:

```text
finacplus-api-xxxxx   1/1   Running
finacplus-api-xxxxx   1/1   Running
```

Check the Deployment:

```bash
kubectl get deployment
```

Expected:

```text
finacplus-api   2/2   2   2
```

### Access the application

The Kubernetes Service exposes the application using NodePort.

For reliable local access from Windows, use port forwarding:

```bash
kubectl port-forward service/finacplus-api 8000:8000
```

The API is then available at:

```text
http://127.0.0.1:8000
```

### Validate Kubernetes deployment

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected:

```json
{"status":"healthy"}
```

Accounts:

```bash
curl http://127.0.0.1:8000/api/accounts
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

The Kubernetes deployment was validated successfully with two running replicas, a functional Service, a successful health check, successful account retrieval, and accessible Swagger documentation.

Detailed Kubernetes implementation and validation steps are documented in:

```text
docs/kubernetes.md
```

---

## Planned High-Level Architecture

The intended end-to-end DevOps workflow is:

```text
Developer
    |
    | git push
    v
GitHub
    |
    | webhook
    v
Jenkins
    |
    +--> Checkout
    |
    +--> Run Tests
    |
    +--> Build Docker Image
    |
    +--> Push Image to Registry
    |
    v
Kubernetes
    |
    v
FinacPlus API
```

The current implementation has completed the Git, application testing, Docker containerization, and local Kubernetes deployment stages.

Jenkins CI/CD automation is the next major phase.

---

## Project Structure

```text
FinacPlus-DevOps-CaseStudy/
│
├── app/
│   └── main.py
│
├── tests/
│   └── test_api.py
│
├── docs/
│   ├── docker.md
│   └── kubernetes.md
│
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
│
├── .dockerignore
├── Dockerfile
├── requirements.txt
├── pytest.ini
└── README.md
```

---

## Future Extension

The following components are outside the current implemented scope:

- Jenkins CI/CD
- Container registry
- Production Kubernetes cluster
- GCP/GKE
- Terraform
- Production ingress
- TLS configuration

GCP/GKE and Terraform may be considered as later extensions because they are relevant to the target DevOps role.

The next implementation phase will focus on Jenkins automation for continuous integration and delivery.
<!-- CI trigger test -->
