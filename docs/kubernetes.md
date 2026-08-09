# Kubernetes Implementation

## Purpose

Kubernetes is used to deploy and manage the containerized FinacPlus API.

The local Kubernetes environment is implemented using Kind. Kind runs Kubernetes nodes as Docker containers and provides a lightweight environment for validating the deployment locally.

The Kubernetes deployment is the next stage after Docker containerization:

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
  |
  v
FinacPlus API
```

---

## Local Kubernetes Environment

The Kubernetes cluster was created using Kind.

Cluster name:

```text
finacplus
```

Kubernetes context:

```text
kind-finacplus
```

Control-plane node:

```text
finacplus-control-plane
```

The cluster was validated with:

```bash
kubectl get nodes
```

Expected result:

```text
NAME                       STATUS   ROLES           VERSION
finacplus-control-plane   Ready    control-plane   v1.36.1
```

---

## Docker Image

The FinacPlus API Docker image was built locally:

```bash
docker build -t finacplus-api:local .
```

Because Kind uses its own Kubernetes node environment, the local Docker image was explicitly loaded into the Kind cluster:

```bash
kind load docker-image finacplus-api:local --name finacplus
```

The image was verified inside the Kubernetes node using:

```bash
docker exec finacplus-control-plane crictl images
```

The image was available as:

```text
docker.io/library/finacplus-api:local
```

---

## Kubernetes Deployment

The application deployment is defined in:

```text
k8s/deployment.yaml
```

The Deployment manages two replicas of the FinacPlus API.

The application image is:

```text
finacplus-api:local
```

The deployment uses:

```yaml
imagePullPolicy: Never
```

This prevents Kubernetes from attempting to pull the locally loaded image from an external container registry.

The application container listens on port:

```text
8000
```

The Deployment was applied using:

```bash
kubectl apply -f k8s/
```

Expected result:

```text
deployment.apps/finacplus-api created
service/finacplus-api created
```

---

## Pod Validation

The deployed Pods were verified using:

```bash
kubectl get pods
```

The resulting deployment contained two running replicas:

```text
finacplus-api-7bbcb6bb5b-gsb4k   1/1   Running
finacplus-api-7bbcb6bb5b-lmmrg   1/1   Running
```

The Deployment status was verified using:

```bash
kubectl get deployment
```

Result:

```text
NAME            READY   UP-TO-DATE   AVAILABLE
finacplus-api   2/2     2            2
```

This confirms that both requested replicas are running successfully.

---

## Kubernetes Service

The application is exposed through a Kubernetes Service defined in:

```text
k8s/service.yaml
```

The Service type is:

```text
NodePort
```

The Service was verified using:

```bash
kubectl get service
```

The local deployment produced:

```text
finacplus-api   NodePort   10.96.70.4   <none>   8000:32394/TCP
```

The Service forwards traffic to the FinacPlus API Pods.

---

## Local Access Using Port Forwarding

For reliable access from the Windows host, Kubernetes port forwarding was used:

```bash
kubectl port-forward service/finacplus-api 8000:8000
```

The command produced:

```text
Forwarding from 127.0.0.1:8000 -> 8000
```

This allowed the API to be accessed from the host at:

```text
http://127.0.0.1:8000
```

---

## Runtime Validation

### Health Endpoint

The Kubernetes deployment was tested using:

```bash
curl http://127.0.0.1:8000/health
```

Result:

```json
{"status":"healthy"}
```

The endpoint successfully returned HTTP 200.

### Accounts Endpoint

The application API was tested using:

```bash
curl http://127.0.0.1:8000/api/accounts
```

The endpoint successfully returned the mock account data:

```json
[
  {
    "id": "ACC-1001",
    "customer_name": "Alex Morgan",
    "account_type": "checking",
    "balance": 12500.75,
    "currency": "USD"
  },
  {
    "id": "ACC-1002",
    "customer_name": "Jordan Lee",
    "account_type": "savings",
    "balance": 48250.0,
    "currency": "USD"
  },
  {
    "id": "ACC-1003",
    "customer_name": "Riley Chen",
    "account_type": "investment",
    "balance": 103780.42,
    "currency": "USD"
  }
]
```

### Swagger Documentation

FastAPI's Swagger UI was successfully accessible at:

```text
http://127.0.0.1:8000/docs
```

The OpenAPI specification is available at:

```text
http://127.0.0.1:8000/openapi.json
```

---

## Kubernetes Architecture

The local deployment follows this architecture:

```text
                 Kind Kubernetes Cluster
                 -----------------------

                         Service
                    finacplus-api
                    NodePort :32394
                           |
             +-------------+-------------+
             |                           |
             v                           v
       FinacPlus Pod              FinacPlus Pod
          Replica 1                  Replica 2
             |                           |
             +-------------+-------------+
                           |
                           v
                     FastAPI :8000
```

The two replicas provide basic workload redundancy within the local Kubernetes environment.

---

## Useful Kubernetes Commands

### View cluster nodes

```bash
kubectl get nodes
```

### View Pods

```bash
kubectl get pods
```

### View detailed Pod information

```bash
kubectl get pods -o wide
```

### View Deployment

```bash
kubectl get deployment
```

### View Services

```bash
kubectl get service
```

### View application logs

```bash
kubectl logs deployment/finacplus-api
```

### View Deployment details

```bash
kubectl describe deployment finacplus-api
```

### View Pod details

```bash
kubectl describe pod <pod-name>
```

### Delete the deployment

```bash
kubectl delete -f k8s/
```

---

## Current Scope

The Kubernetes implementation is currently local and uses Kind for development and validation.

The current environment does not include:

- Jenkins
- Container registry
- Production Kubernetes cluster
- GCP/GKE
- Terraform
- Production ingress
- TLS configuration

These components can be introduced in later phases of the DevOps workflow.

---

## Future CI/CD Integration

The intended final workflow is:

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

The local Kind cluster provides the Kubernetes deployment environment used to validate the application before integrating the deployment into Jenkins.

In the future CI/CD pipeline, the local `finacplus-api:local` image will be replaced by a versioned image published to a container registry.