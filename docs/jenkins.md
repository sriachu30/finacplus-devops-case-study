# Jenkins CI/CD Implementation

## Purpose

Jenkins is used to automate the Continuous Integration and Continuous Deployment (CI/CD) workflow for the FinacPlus API.

The Jenkins pipeline automatically:

1. Checks out the source code from GitHub.
2. Installs Python dependencies.
3. Runs automated tests.
4. Builds the FinacPlus Docker image.
5. Verifies the Docker image.
6. Prepares the local Kind Kubernetes cluster.
7. Configures Kubernetes access for Jenkins.
8. Loads the Docker image into Kind.
9. Deploys the application to Kubernetes.
10. Verifies the Kubernetes deployment.
11. Performs an application health check.
12. Validates the accounts API.

The overall workflow is:

```text
GitHub
   |
   | Commit
   v
Jenkins
   |
   +--> Checkout
   |
   +--> Python Tests
   |
   +--> Docker Build
   |
   +--> Docker Image Verification
   |
   +--> Prepare Kind Cluster
   |
   +--> Configure Kubernetes Access
   |
   +--> Load Image into Kind
   |
   +--> Kubernetes Deployment
   |
   +--> Deployment Verification
   |
   +--> Health Check
   |
   +--> API Validation
   |
   v
FinacPlus API running on Kubernetes
```

---

## Jenkins Environment

Jenkins was installed locally on Windows and configured to run as a Windows service.

The local Jenkins server was accessed through:

```text
http://localhost:8081
```

Jenkins was installed using Jenkins 2.568.2.

The Jenkins service uses Java 21 as the supported Java runtime.

Java installation:

```text
C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot
```

The Jenkins environment was configured to access the required development tools.

---

## Required Tools

The Jenkins pipeline requires the following tools:

- Java
- Git
- Python
- Docker
- kubectl
- Kind

The environment was validated through a Jenkins environment-check job.

The validated tool versions included:

```text
Java       24.0.2
Git        2.55.0.windows.2
Python     3.13.7
Docker     29.6.2
kubectl    v1.36.1
Kind       v0.32.0
```

Jenkins successfully detected Docker, kubectl, and Kind after the required executable directories were added to the environment available to the Jenkins service.

---

## Jenkins PATH Configuration

The Jenkins Windows service runs with its own environment.

Therefore, tools that were available from a normal PowerShell terminal were not initially available to Jenkins.

Initially, the Jenkins environment could detect:

```text
Java
Git
Python
Kind
```

but Docker and kubectl were not available.

The following directories were added to the environment used by Jenkins:

```text
C:\Users\Krishna\AppData\Local\Programs\DockerDesktop\resources\bin

C:\Users\Krishna\AppData\Local\Microsoft\WinGet\Packages\Kubernetes.kind_Microsoft.Winget.Source_8wekyb3d8bbwe
```

The Docker Desktop directory contains the Docker CLI and kubectl executable used by the local environment.

After modifying the environment and restarting the Jenkins service, the environment-check pipeline successfully detected:

```text
docker --version
kubectl version --client
kind version
```

The successful Jenkins environment validation produced:

```text
Docker version 29.6.2, build dfc4efb

Client Version: v1.36.1
Kustomize Version: v5.8.1

kind v0.32.0 go1.26.3 windows/amd64
```

This configuration is important because Jenkins executes pipeline commands through its Windows service environment rather than the interactive user's PowerShell environment.

---

## GitHub Repository

The FinacPlus source code is hosted in GitHub.

Repository:

```text
https://github.com/sriachu30/finacplus-devops-case-study.git
```

The Jenkins pipeline retrieves the repository source code using Jenkins' Git integration.

The Jenkinsfile is stored in the root directory of the repository:

```text
Jenkinsfile
```

The source repository contains:

```text
app/
docs/
jenkins/
k8s/
tests/
Dockerfile
Jenkinsfile
README.md
requirements.txt
pytest.ini
```

---

## Jenkins Pipeline Job

The Jenkins pipeline job is named:

```text
FinacPlus-Pipeline
```

The pipeline uses the `Jenkinsfile` stored in the Git repository.

This approach keeps the pipeline definition under version control together with the application source code.

The Jenkinsfile is written using Jenkins Declarative Pipeline syntax and Groovy.

---

## Jenkinsfile

The Jenkins pipeline is stored as:

```text
Jenkinsfile
```

The pipeline contains the following major sections:

```text
pipeline
├── triggers
├── environment
├── stages
│   ├── Checkout
│   ├── Python Tests
│   ├── Docker Build
│   ├── Verify Docker Image
│   ├── Prepare Kind Cluster
│   ├── Configure Kubernetes Access
│   ├── Load Image into Kind
│   ├── Deploy to Kubernetes
│   ├── Verify Kubernetes Deployment
│   ├── Application Health Check
│   └── API Validation
└── post
    ├── success
    ├── failure
    └── always
```

---

## Automatic Git Trigger

The pipeline is configured to automatically check the Git repository for changes.

The Jenkinsfile contains:

```groovy
triggers {
    pollSCM('H/2 * * * *')
}
```

This enables SCM polling.

Jenkins periodically checks the configured Git repository for new commits.

When a new commit is detected, Jenkins automatically starts a new pipeline build.

The implemented workflow is:

```text
Developer
    |
    | git push
    v
GitHub
    |
    | SCM polling
    v
Jenkins
    |
    v
Automatic Build
```

The current polling configuration checks the repository approximately every two minutes.

This satisfies the requirement that a commit to the configured Git repository automatically triggers the build process.

---

# Pipeline Environment Variables

The Jenkinsfile defines reusable environment variables:

```groovy
environment {
    IMAGE_NAME = 'finacplus-api:local'
    KIND_CLUSTER = 'finacplus'
    K8S_CONTEXT = 'kind-finacplus'
    HEALTH_PORT = '18000'
    KUBECONFIG = "${WORKSPACE}\\.kubeconfig"
}
```

These variables are used throughout the pipeline to avoid repeatedly hardcoding configuration values.

The current implementation uses:

```text
Docker image:       finacplus-api:local
Kind cluster:      finacplus
Kubernetes context: kind-finacplus
Health port:       18000
Kubeconfig:        Jenkins workspace
```

---

# Pipeline Stages

## 1. Checkout

The first stage retrieves the latest source code from the configured Git repository.

```groovy
stage('Checkout') {
    steps {
        echo 'Checking out source code...'
        checkout scm
    }
}
```

This ensures that every pipeline execution operates on the source revision retrieved by Jenkins.

---

## 2. Python Tests

The Python dependencies are installed using:

```bash
python -m pip install -r requirements.txt
```

The automated test suite is then executed using:

```bash
python -m pytest -v
```

The project currently contains six API tests covering:

- Health endpoint availability.
- Health endpoint response.
- Accounts endpoint availability.
- Account response fields.
- Retrieval of an existing account.
- Handling of a missing account.

The test suite validates:

```text
/health
/api/accounts
/api/accounts/{account_id}
```

A successful pipeline execution validated all six tests.

Expected result:

```text
6 passed
```

A test failure causes this stage to fail and prevents deployment from continuing.

---

## 3. Docker Build

After successful tests, Jenkins builds the Docker image:

```bash
docker build -t finacplus-api:local .
```

The Docker image contains the FastAPI application and its Python dependencies.

The Dockerfile uses:

```text
python:3.13-slim
```

The application listens on:

```text
8000
```

The container runs the FastAPI application using Uvicorn.

The Docker container also runs as a non-root application user.

---

## 4. Docker Image Verification

The generated Docker image is verified using:

```bash
docker image inspect finacplus-api:local
```

This ensures that the expected Docker image exists before Kubernetes deployment begins.

If the image does not exist or cannot be inspected, the pipeline stops.

---

## 5. Prepare Kind Cluster

The pipeline checks whether the required Kind cluster exists:

```bash
kind get clusters
```

The expected cluster is:

```text
finacplus
```

The pipeline also checks the Docker container associated with the Kind control plane.

If the cluster does not exist, Jenkins creates it automatically:

```bash
kind create cluster --name finacplus --wait 5m
```

If the cluster already exists, the existing cluster is reused.

This allows the pipeline to operate against a persistent local Kubernetes environment without recreating the cluster for every build.

---

## 6. Configure Kubernetes Access

Jenkins exports the Kind cluster's kubeconfig into the Jenkins workspace.

The pipeline uses:

```bash
kind export kubeconfig --name finacplus --kubeconfig "%WORKSPACE%\.kubeconfig"
```

The configured Kubernetes context is then validated using:

```bash
kubectl --kubeconfig "%WORKSPACE%\.kubeconfig" config current-context
```

The cluster nodes are verified using:

```bash
kubectl --kubeconfig "%WORKSPACE%\.kubeconfig" get nodes
```

The expected context is:

```text
kind-finacplus
```

This workspace-specific kubeconfig allows Jenkins to communicate with the Kind Kubernetes cluster during the pipeline.

---

## 7. Load Docker Image into Kind

Kind runs Kubernetes nodes as Docker containers.

Therefore, a locally built Docker image must be explicitly loaded into the Kind cluster before Kubernetes can use it.

The pipeline executes:

```bash
kind load docker-image finacplus-api:local --name finacplus
```

The Kubernetes Deployment uses:

```yaml
imagePullPolicy: Never
```

This ensures Kubernetes uses the image already loaded into the Kind node rather than attempting to pull it from an external container registry.

The workflow is:

```text
Jenkins
   |
   | docker build
   v
Local Docker Image
   |
   | kind load docker-image
   v
Kind Control Plane
   |
   v
Kubernetes Pod
```

---

## 8. Deploy to Kubernetes

The Kubernetes manifests are stored in:

```text
k8s/
```

The directory contains:

```text
k8s/deployment.yaml
k8s/service.yaml
```

The pipeline applies the manifests using:

```bash
kubectl apply -f k8s/
```

The Deployment manages two replicas of the FinacPlus API.

The deployment is then monitored using:

```bash
kubectl rollout status deployment/finacplus-api --timeout=120s
```

If the deployment does not become ready within the timeout period, the pipeline fails.

---

## 9. Kubernetes Deployment Verification

The pipeline checks the Kubernetes resources using:

```bash
kubectl get pods
kubectl get deployment
kubectl get service
```

The deployment is expected to have two available replicas.

The pipeline verifies:

```text
availableReplicas == 2
```

If the number of available replicas is not two, the pipeline fails.

This provides an automated validation that the expected application workload is running.

The expected deployment state is:

```text
NAME            READY   UP-TO-DATE   AVAILABLE
finacplus-api   2/2     2            2
```

---

## 10. Application Health Check

After Kubernetes deployment, Jenkins starts a temporary port-forward from the Kubernetes Service to the Jenkins host.

The forwarding uses:

```text
18000:8000
```

The application is therefore temporarily accessed through:

```text
http://127.0.0.1:18000
```

The health endpoint is:

```text
/health
```

The pipeline expects:

```json
{
  "status": "healthy"
}
```

If the response is not healthy, the pipeline fails.

The temporary port-forward process is terminated after the check.

This validates the application itself rather than only checking Kubernetes resource status.

---

## 11. API Validation

The pipeline also validates the main accounts API:

```text
/api/accounts
```

The endpoint is accessed through the temporary port-forward.

The pipeline expects three mock accounts to be returned.

The response count is validated using PowerShell.

The expected response contains:

```text
ACC-1001
ACC-1002
ACC-1003
```

If the expected number of accounts is not returned, the pipeline fails.

This provides an application-level validation in addition to Kubernetes-level validation.

---

# Error Handling

The pipeline is designed to stop when a critical stage fails.

For example:

```text
Python Tests fails
        |
        X
   Docker Build
        |
        X
   Kubernetes Deploy
```

This prevents deployment of an application that has failed its automated tests.

Similarly:

```text
Docker Build
      |
      X
Image Verification
      |
      X
Kubernetes Deployment
```

and:

```text
Kubernetes Deployment
      |
      X
Health Check
      |
      X
Pipeline Success
```

A deployment must therefore pass both infrastructure-level and application-level validation before the pipeline is considered successful.

---

# Post-Build Feedback

The Jenkinsfile defines `post` actions for successful and failed builds.

For successful builds:

```text
========================================
FinacPlus CI/CD Pipeline PASSED
========================================
```

For failed builds:

```text
========================================
FinacPlus CI/CD Pipeline FAILED
Check the stage logs above.
========================================
```

The `always` section also displays the final Kubernetes state:

```bash
kubectl get pods
kubectl get deployment
kubectl get service
```

This provides useful diagnostic information even when a pipeline fails.

---

# Successful Pipeline Validation

The complete pipeline was successfully executed in Jenkins.

The successful build validated the complete workflow:

```text
Git Checkout             PASS
Python Tests             PASS
Docker Build             PASS
Docker Image Verify      PASS
Kind Cluster             PASS
Kubernetes Access        PASS
Image Load               PASS
Kubernetes Deployment    PASS
Deployment Rollout       PASS
Replica Validation       PASS
Health Check             PASS
API Validation           PASS
```

The automated test suite successfully passed:

```text
6 passed
```

The Kubernetes deployment successfully reached:

```text
2/2 replicas available
```

The application health check returned:

```json
{"status":"healthy"}
```

The accounts API successfully returned three mock accounts.

The Jenkins build completed with:

```text
Finished: SUCCESS
```

---

# Automatic Trigger Validation

The automatic SCM trigger was also validated.

After the Jenkins SCM polling configuration was added, a subsequent Git commit caused Jenkins to automatically create a new pipeline build.

The workflow was:

```text
Git Commit
    |
    v
GitHub
    |
    v
Jenkins SCM Polling
    |
    v
Automatic Pipeline Build
    |
    v
Tests
    |
    v
Docker Build
    |
    v
Kubernetes Deployment
    |
    v
Health + API Validation
    |
    v
SUCCESS
```

This demonstrates automatic CI/CD execution without manually selecting "Build Now".

---

# Kubernetes Architecture

The Jenkins deployment pipeline uses the following local architecture:

```text
                    GitHub
                       |
                       | Commit
                       v
                    Jenkins
                       |
              +--------+--------+
              |                 |
              v                 v
         Python Tests      Docker Build
              |                 |
              +--------+--------+
                       |
                       v
                Docker Image
                       |
                       v
                 Kind Cluster
                       |
                Kubernetes Service
                       |
              +--------+--------+
              |                 |
              v                 v
        FinacPlus Pod      FinacPlus Pod
          Replica 1          Replica 2
              |                 |
              +--------+--------+
                       |
                       v
                 FastAPI :8000
```

---

# Security Practices

The implementation follows several basic security practices.

## Container Runs as Non-Root

The Dockerfile creates a dedicated application user:

```dockerfile
RUN useradd --create-home --shell /usr/sbin/nologin appuser
```

The container then runs as:

```dockerfile
USER appuser
```

This prevents the application from running as the root user inside the container.

---

## Secrets Are Not Stored in the Jenkinsfile

The Jenkinsfile does not contain application passwords, GitHub passwords, or Kubernetes credentials.

Sensitive credentials should be managed through Jenkins Credentials rather than committed to source control.

---

## Kubeconfig Is Workspace-Specific

The pipeline exports Kubernetes configuration to:

```text
${WORKSPACE}\.kubeconfig
```

This avoids relying on the interactive user's default Kubernetes configuration.

The kubeconfig should not be committed to Git.

The project should ensure that `.kubeconfig` is excluded from source control.

---

## Source Code Remains Under Version Control

The Jenkinsfile itself is stored in GitHub:

```text
Jenkinsfile
```

This provides version history and makes pipeline changes auditable.

---

# Scalability and Adaptability

The current implementation is designed as a local reference implementation using:

```text
GitHub
Jenkins
Docker
Kind
Kubernetes
```

The pipeline stores important configuration values in Jenkins environment variables:

```groovy
environment {
    IMAGE_NAME = 'finacplus-api:local'
    KIND_CLUSTER = 'finacplus'
    K8S_CONTEXT = 'kind-finacplus'
    HEALTH_PORT = '18000'
    KUBECONFIG = "${WORKSPACE}\\.kubeconfig"
}
```

This provides a starting point for adapting the pipeline to different repositories and Kubernetes environments.

For a larger implementation, these values can be supplied through:

- Jenkins parameters.
- Jenkins Credentials.
- Jenkins shared libraries.
- Separate pipeline configurations.
- External configuration.

For example:

```text
Repository A
    |
    v
Jenkins Pipeline
    |
    +----> Kubernetes Cluster A


Repository B
    |
    v
Jenkins Pipeline
    |
    +----> Kubernetes Cluster B
```

The core pipeline stages can remain the same while repository, image, cluster, and deployment configuration changes.

---

# Useful Jenkins Operations

## Check Jenkins Service

PowerShell:

```powershell
Get-Service jenkins
```

---

## Restart Jenkins Service

PowerShell:

```powershell
Restart-Service jenkins
```

This is useful after modifying the Windows environment variables used by the Jenkins service.

---

## Check Jenkins Service Status

PowerShell:

```powershell
Get-Service jenkins
```

Expected state:

```text
Running
```

---

# Useful Pipeline Validation Commands

## Run Tests Locally

```bash
python -m pytest -v
```

---

## Build Docker Image Locally

```bash
docker build -t finacplus-api:local .
```

---

## Verify Docker Image

```bash
docker image inspect finacplus-api:local
```

---

## Check Kind Clusters

```bash
kind get clusters
```

---

## Check Kubernetes Nodes

```bash
kubectl get nodes
```

---

## Check Pods

```bash
kubectl get pods
```

---

## Check Deployment

```bash
kubectl get deployment
```

---

## Check Services

```bash
kubectl get service
```

---

## View Application Logs

```bash
kubectl logs deployment/finacplus-api
```

---

## Check Deployment Rollout

```bash
kubectl rollout status deployment/finacplus-api
```

---

# Troubleshooting

## Docker Is Not Recognized by Jenkins

If Jenkins reports:

```text
'docker' is not recognized as an internal or external command
```

verify that the Docker executable directory is available in the environment used by the Jenkins Windows service.

Docker Desktop executable directory:

```text
C:\Users\Krishna\AppData\Local\Programs\DockerDesktop\resources\bin
```

Restart Jenkins after modifying the environment.

Then run the Jenkins environment-check job again.

---

## kubectl Is Not Recognized by Jenkins

If Jenkins reports:

```text
'kubectl' is not recognized as an internal or external command
```

verify that the directory containing `kubectl.exe` is available to Jenkins.

In the current local setup, kubectl is available through:

```text
C:\Users\Krishna\AppData\Local\Programs\DockerDesktop\resources\bin
```

Restart the Jenkins service after changing the environment.

---

## Kind Is Not Recognized by Jenkins

If Jenkins reports:

```text
'kind' is not recognized as an internal or external command
```

verify that the Kind executable directory is available to Jenkins.

The current installation uses:

```text
C:\Users\Krishna\AppData\Local\Microsoft\WinGet\Packages\Kubernetes.kind_Microsoft.Winget.Source_8wekyb3d8bbwe
```

Restart Jenkins after changing the environment.

---

## Kubernetes Deployment Fails

Check:

```bash
kubectl get pods
kubectl get deployment
kubectl describe deployment finacplus-api
```

Then inspect application logs:

```bash
kubectl logs deployment/finacplus-api
```

---

## Docker Image Is Not Available in Kind

Because Kind uses Docker containers as Kubernetes nodes, locally built images must be loaded into the cluster.

Run:

```bash
kind load docker-image finacplus-api:local --name finacplus
```

The Kubernetes Deployment uses:

```yaml
imagePullPolicy: Never
```

This prevents Kubernetes from attempting to pull the image from Docker Hub or another external registry.

---

## Health Check Fails

Check the application Pods:

```bash
kubectl get pods
```

Then check logs:

```bash
kubectl logs deployment/finacplus-api
```

The health endpoint should return:

```json
{"status":"healthy"}
```

---

## Jenkins Build Takes a Long Time

The pipeline performs several operations that can take time during the first execution:

```text
Python dependency installation
        |
        v
Docker image build
        |
        v
Kind image loading
        |
        v
Kubernetes deployment
        |
        v
Rollout verification
```

Later builds can be faster because Docker and Kind can reuse existing resources.

---

# Current Scope

The current Jenkins implementation is a local CI/CD demonstration environment.

It uses:

```text
GitHub
Jenkins
Docker Desktop
Kind
Kubernetes
```

The current implementation does not require:

- A production Jenkins server.
- A cloud Kubernetes cluster.
- GKE.
- Terraform.
- A production container registry.
- Production ingress.
- TLS.
- External monitoring infrastructure.

These components can be introduced when moving the implementation from local development to a production environment.

---

# Future Improvements

Potential future improvements include:

- GitHub webhook integration instead of SCM polling.
- Jenkins Credentials for repository authentication.
- Container registry integration.
- Versioned Docker image tags.
- Parameterized Kubernetes cluster selection.
- Jenkins shared libraries.
- Separate development and production environments.
- Kubernetes namespace isolation.
- RBAC for Jenkins deployment permissions.
- Centralized logging.
- Pipeline monitoring.
- Deployment notifications.
- Production Kubernetes deployment.
- Automated rollback strategies.
- Kubernetes readiness and liveness monitoring.
- Container vulnerability scanning.
- Dependency vulnerability scanning.

---

# Assignment Requirement Mapping

The implementation addresses the assignment requirements as follows.

## Automatic Build on Git Commit

Implemented using Jenkins SCM polling:

```groovy
triggers {
    pollSCM('H/2 * * * *')
}
```

A Git commit causes Jenkins to detect the change and start a new pipeline build.

---

## Deployment After Successful Build

The pipeline executes Kubernetes deployment only after successful testing and Docker image creation.

```text
Tests
  |
  v
Docker Build
  |
  v
Docker Image Verification
  |
  v
Kubernetes Deployment
```

This ensures that failed tests prevent deployment.

---

## Scalable and Adaptable Pipeline

Important pipeline configuration is maintained through environment variables:

```text
IMAGE_NAME
KIND_CLUSTER
K8S_CONTEXT
HEALTH_PORT
KUBECONFIG
```

This provides a foundation for supporting different repositories, images, and Kubernetes clusters.

---

## Groovy Automation

The complete Jenkins pipeline is implemented in a version-controlled:

```text
Jenkinsfile
```

using Jenkins Declarative Pipeline syntax and Groovy.

The pipeline stages are structured so that additional stages and deployment logic can be added later.

---

## Error Handling

Pipeline stages fail automatically when commands return errors.

Deployment readiness, replica count, application health, and API responses are explicitly validated.

The `post` section provides success/failure feedback and final Kubernetes state.

---

## Documentation

The project contains documentation covering:

```text
Docker
Kubernetes
Jenkins CI/CD
```

The documentation explains the setup, execution flow, validation procedures, and troubleshooting steps.

---

# Final CI/CD Workflow

The completed local FinacPlus CI/CD workflow is:

```text
                         Developer
                             |
                             | git push
                             v
                          GitHub
                             |
                             | SCM polling
                             v
                         Jenkins
                             |
                             v
                         Checkout
                             |
                             v
                       Python Tests
                         6/6 PASS
                             |
                             v
                       Docker Build
                             |
                             v
                   Docker Image Verify
                             |
                             v
                     Prepare Kind
                             |
                             v
                Configure Kubernetes Access
                             |
                             v
                   Load Image into Kind
                             |
                             v
                  Deploy to Kubernetes
                             |
                             v
                  Rollout Verification
                             |
                             v
                     2 Replicas Ready
                             |
                             v
                      Health Check
                             |
                             v
                    API Validation
                             |
                             v
                    Jenkins SUCCESS
```

The implementation therefore demonstrates an automated Git-to-Jenkins-to-Docker-to-Kubernetes CI/CD workflow for the FinacPlus API.

---

# Project Documentation Structure

The relevant documentation files are:

```text
docs/
├── docker.md
├── kubernetes.md
└── jenkins.md
```

The documentation progression is:

```text
Docker
  |
  v
Containerized FinacPlus API
  |
  v
Kubernetes
  |
  v
FinacPlus API deployed to Kind
  |
  v
Jenkins
  |
  v
Automated CI/CD
```

---

# Final Project State

At this stage, the FinacPlus DevOps case study demonstrates:

```text
Git
 |
 v
GitHub
 |
 v
Jenkins
 |
 +--> Automated SCM Trigger
 |
 +--> Checkout
 |
 +--> Automated Python Tests
 |
 +--> Docker Build
 |
 +--> Docker Image Verification
 |
 +--> Kind Cluster Preparation
 |
 +--> Kubernetes Access
 |
 +--> Image Loading
 |
 +--> Kubernetes Deployment
 |
 +--> Replica Verification
 |
 +--> Health Check
 |
 +--> API Validation
 |
 v
FinacPlus API
```

The pipeline has been successfully executed and validated locally using Jenkins, Docker Desktop, Kind, and Kubernetes.
