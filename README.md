# FinacPlus DevOps Case Study

## Case Study Objective

Demonstrate an end-to-end DevOps workflow for FinacPlus using Git, Jenkins, Docker, and Kubernetes, from source control through automated build, test, containerization, and deployment.

## Current Status

Phase 1 complete: sample FinacPlus API implemented with tests. Containerization, CI/CD pipeline, and deployment configurations are not yet implemented.

## Application

The **FinacPlus API** is a small mock financial REST service. It provides static account data for the future CI/CD pipeline to build, test, containerize, and deploy.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Returns service health status |
| GET | `/api/accounts` | Returns a list of mock financial accounts |
| GET | `/api/accounts/{account_id}` | Returns a single account by ID, or HTTP 404 if not found |

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

## Planned High-Level Architecture

```
Git
  |
  v
Jenkins
  |
  v
Build / Test
  |
  v
Container Image
  |
  v
Kubernetes
  |
  v
Application
```

## Future Extension (Out of Current Scope)

GCP/GKE and Terraform may be considered as a later extension because they are relevant to the target role, but they are **not** part of the current implemented scope.
