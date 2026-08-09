# Docker Implementation

## Purpose

Docker is used to package the FinacPlus API and its runtime dependencies into a reproducible container image.

The container image acts as the deployable artifact for the future CI/CD pipeline:

```text
Git
  |
  v
Jenkins
  |
  v
Build / Test
  |
  v
Docker Image
  |
  v
Kubernetes
```

The current Docker implementation is local and does not yet include Jenkins, Kubernetes, or a container registry.

---

## Dockerfile Design

The Dockerfile uses the official `python:3.13-slim` image as the base image.

Key design decisions:

### Slim base image

```dockerfile
FROM python:3.13-slim
```

A slim Python image is used to avoid unnecessary packages while retaining the required Python runtime.

### Python environment

```dockerfile
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
```

`PYTHONDONTWRITEBYTECODE` prevents Python from generating `.pyc` files.

`PYTHONUNBUFFERED` ensures application output is written immediately, which is useful for container logs and observability.

### Working directory

```dockerfile
WORKDIR /app
```

The application is kept under a predictable working directory inside the container.

### Non-root user

```dockerfile
RUN useradd --create-home --shell /usr/sbin/nologin appuser
```

The application runs as a dedicated non-root user instead of the root user.

The image switches to this user with:

```dockerfile
USER appuser
```

This reduces the privileges available to the application process inside the container.

### Dependency installation

```dockerfile
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
```

The dependency file is copied separately before the application source code. This allows Docker to reuse the dependency layer when application code changes but dependencies remain unchanged.

`--no-cache-dir` prevents pip's package cache from being retained in the image.

### Application source

```dockerfile
COPY app/ ./app/
```

Only the application package is copied into the image.

### Port

```dockerfile
EXPOSE 8000
```

The FastAPI application listens on port 8000.

### Application startup

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Uvicorn binds to `0.0.0.0` so the application can receive traffic through the container's network interface.

---

## `.dockerignore`

The `.dockerignore` file prevents unnecessary or sensitive local files from being included in the Docker build context.

Examples include:

- `.git`
- `.venv`
- Python cache files
- pytest cache
- `.env` files
- Kubernetes configuration files
- Terraform state
- IDE configuration

This reduces build context size and helps prevent accidental inclusion of local credentials or environment-specific files.

---

## Build the Image

From the project root:

```bash
docker build -t finacplus-api:local .
```

The resulting local image is:

```text
finacplus-api:local
```

Verify the image:

```bash
docker images finacplus-api
```

---

## Run the Container

Start the container with:

```bash
docker run --name finacplus-api-local -p 8000:8000 finacplus-api:local
```

The port mapping is:

```text
Host port 8000
      |
      v
Container port 8000
```

The API is then accessible through:

```text
http://localhost:8000
```

---

## Runtime Validation

### Health check

The application health endpoint is:

```text
http://localhost:8000/health
```

Expected response:

```json
{"status":"healthy"}
```

PowerShell validation:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Expected result:

```text
status
------
healthy
```

The raw response can also be checked with:

```powershell
curl.exe http://localhost:8000/health
```

Expected:

```json
{"status":"healthy"}
```

### API documentation

FastAPI's Swagger documentation is available at:

```text
http://localhost:8000/docs
```

The OpenAPI specification is available at:

```text
http://localhost:8000/openapi.json
```

### Container status

Check whether the container is running:

```bash
docker ps --filter "name=finacplus-api-local"
```

### Container logs

View application logs:

```bash
docker logs finacplus-api-local
```

### Runtime user

Verify that the application is running as the non-root user:

```bash
docker exec finacplus-api-local whoami
```

Expected:

```text
appuser
```

---

## Validation Results

The Docker implementation was validated locally with the following results:

| Check | Result |
|---|---|
| Docker image build | Passed |
| Docker image exists locally | Passed |
| Container startup | Passed |
| Uvicorn startup | Passed |
| `/health` endpoint | HTTP 200 |
| `/docs` endpoint | HTTP 200 |
| `/openapi.json` endpoint | HTTP 200 |
| Runtime user | `appuser` |
| PowerShell health check | `healthy` |

---

## Troubleshooting

### Check running containers

```bash
docker ps
```

### Check all containers

```bash
docker ps -a
```

### View container logs

```bash
docker logs finacplus-api-local
```

### Stop the container

```bash
docker stop finacplus-api-local
```

### Remove the container

```bash
docker rm finacplus-api-local
```

### Rebuild the image

```bash
docker build -t finacplus-api:local .
```

If port 8000 is already occupied, identify the process or container using the port before starting another container.

---

## Role in the Future CI/CD Pipeline

The current Docker image is intended to become the deployable artifact in the final CI/CD workflow.

The target flow is:

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
    +--> Test
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

Jenkins and Kubernetes are intentionally outside the scope of the current Docker phase.

The future pipeline should replace the local `:local` image tag with a versioned or commit-based image tag and publish the image to a container registry before deployment to Kubernetes.