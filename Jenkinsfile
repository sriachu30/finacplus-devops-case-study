pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    parameters {
        string(
            name: 'IMAGE_REPOSITORY',
            defaultValue: 'finacplus-api',
            description: 'Docker image repository name'
        )

        string(
            name: 'APP_NAME',
            defaultValue: 'finacplus-api',
            description: 'Kubernetes application/deployment name'
        )

        string(
            name: 'KIND_CLUSTER',
            defaultValue: 'finacplus',
            description: 'Target Kubernetes/Kind cluster'
        )

        string(
            name: 'K8S_NAMESPACE',
            defaultValue: 'finacplus',
            description: 'Target Kubernetes namespace'
        )
    }

    environment {
        IMAGE_REPOSITORY = "${params.IMAGE_REPOSITORY}"
        APP_NAME = "${params.APP_NAME}"
        KIND_CLUSTER = "${params.KIND_CLUSTER}"
        K8S_NAMESPACE = "${params.K8S_NAMESPACE}"

        K8S_CONTEXT = "kind-${params.KIND_CLUSTER}"
        IMAGE_NAME = "${params.IMAGE_REPOSITORY}:local"

        HEALTH_PORT = '18000'
        KUBECONFIG = "${WORKSPACE}\\.kubeconfig"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Python Tests') {
            steps {
                echo 'Installing Python dependencies...'
                bat 'python -m pip install -r requirements.txt'

                echo 'Running pytest...'
                bat 'python -m pytest -v'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image: ${env.IMAGE_NAME}"

                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Verify Docker Image') {
            steps {
                echo "Verifying Docker image: ${env.IMAGE_NAME}"

                bat 'docker image inspect %IMAGE_NAME%'
            }
        }

        stage('Prepare Kind Cluster') {
            steps {
                echo "Checking Kind cluster: ${env.KIND_CLUSTER}..."

                bat '''
                    kind get clusters

                    docker ps --filter "name=%KIND_CLUSTER%-control-plane"

                    kind get clusters | findstr /X /C:"%KIND_CLUSTER%" >nul

                    if errorlevel 1 (
                        echo Kind cluster "%KIND_CLUSTER%" not found.
                        echo Creating cluster...
                        kind create cluster --name %KIND_CLUSTER% --wait 5m
                    ) else (
                        echo Kind cluster "%KIND_CLUSTER%" already exists.
                    )
                '''
            }
        }

        stage('Configure Kubernetes Access') {
            steps {
                echo "Configuring Kubernetes access for cluster: ${env.KIND_CLUSTER}..."

                bat '''
                    kind export kubeconfig ^
                        --name %KIND_CLUSTER% ^
                        --kubeconfig "%KUBECONFIG%"

                    echo ===== KUBERNETES CONTEXT =====
                    kubectl config current-context

                    powershell -NoProfile -Command "$actual = (kubectl config current-context).Trim(); $expected = '%K8S_CONTEXT%'.Trim(); if ($actual -ne $expected) { Write-Host 'ERROR: Kubernetes context does not match target cluster.'; Write-Host ('Expected: ' + $expected); Write-Host ('Actual: ' + $actual); exit 1 } else { Write-Host ('Kubernetes context verified: ' + $actual) }"

                    echo ===== KUBERNETES NODES =====
                    kubectl get nodes

                    echo Kubernetes context verified: %K8S_CONTEXT%
                '''
            }
        }

        stage('Prepare Kubernetes Namespace') {
            steps {
                echo "Preparing Kubernetes namespace: ${env.K8S_NAMESPACE}..."

                bat '''
                    kubectl create namespace %K8S_NAMESPACE% ^
                        --dry-run=client ^
                        -o yaml | kubectl apply -f -
                '''
            }
        }

        stage('Load Image into Kind') {
            steps {
                echo "Loading Docker image into Kind cluster: ${env.KIND_CLUSTER}..."

                bat '''
                    kind load docker-image %IMAGE_NAME% ^
                        --name %KIND_CLUSTER%
                '''
            }
        }

 stage('Prepare Kind Cluster') {
    steps {
        echo "Checking Kind cluster: ${env.KIND_CLUSTER}..."

        bat '''
            kind get clusters

            kind get clusters > kind-clusters.txt

            findstr /X /C:"%KIND_CLUSTER%" kind-clusters.txt >nul

            if errorlevel 1 (
                echo Kind cluster "%KIND_CLUSTER%" not found.
                echo Creating cluster...
                kind create cluster --name %KIND_CLUSTER% --wait 5m
            ) else (
                echo Kind cluster "%KIND_CLUSTER%" already exists.
            )

            del kind-clusters.txt
        '''
    }
}

        stage('Validate Kubernetes Manifests') {
            steps {
                echo 'Validating generated Kubernetes manifests...'

                bat '''
                    kubectl apply ^
                        --dry-run=client ^
                        -f generated-k8s/ ^
                        -n %K8S_NAMESPACE%
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying ${env.APP_NAME} to cluster ${env.KIND_CLUSTER}, namespace ${env.K8S_NAMESPACE}..."

                bat '''
                    kubectl apply ^
                        -f generated-k8s/ ^
                        -n %K8S_NAMESPACE%
                '''

                echo 'Restarting deployment to ensure the newly built image is used...'

                bat '''
                    kubectl rollout restart deployment/%APP_NAME% ^
                        -n %K8S_NAMESPACE%
                '''

                echo 'Waiting for deployment rollout...'

                bat '''
                    kubectl rollout status deployment/%APP_NAME% ^
                        -n %K8S_NAMESPACE% ^
                        --timeout=120s
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                echo 'Checking Kubernetes resources...'

                bat 'kubectl get pods -n %K8S_NAMESPACE%'
                bat 'kubectl get deployment -n %K8S_NAMESPACE%'
                bat 'kubectl get service -n %K8S_NAMESPACE%'

                echo 'Verifying that two replicas are available...'

                bat '''
                    kubectl get deployment %APP_NAME% ^
                        -n %K8S_NAMESPACE% ^
                        -o jsonpath="{.status.availableReplicas}" > replicas.txt

                    set /p AVAILABLE_REPLICAS=<replicas.txt

                    if not "%AVAILABLE_REPLICAS%"=="2" (
                        echo Expected 2 available replicas but found %AVAILABLE_REPLICAS%
                        exit /b 1
                    )

                    echo Two replicas are available.
                '''
            }
        }

        stage('Application Health Check') {
            steps {
                echo 'Starting temporary port-forward for health check...'

                bat '''
                    powershell -NoProfile -Command "$p = Start-Process kubectl -ArgumentList 'port-forward','-n','%K8S_NAMESPACE%','service/%APP_NAME%','%HEALTH_PORT%:8000' -PassThru -WindowStyle Hidden; Start-Sleep -Seconds 5; try { $response = Invoke-RestMethod -Uri 'http://127.0.0.1:%HEALTH_PORT%/health' -TimeoutSec 10; Write-Host ('Health response: ' + ($response | ConvertTo-Json -Compress)); if ($response.status -ne 'healthy') { exit 1 } } finally { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }"
                '''
            }
        }

        stage('API Validation') {
            steps {
                echo 'Validating accounts API...'

                bat '''
                    powershell -NoProfile -Command "$p = Start-Process kubectl -ArgumentList 'port-forward','-n','%K8S_NAMESPACE%','service/%APP_NAME%','%HEALTH_PORT%:8000' -PassThru -WindowStyle Hidden; Start-Sleep -Seconds 5; try { $response = Invoke-RestMethod -Uri 'http://127.0.0.1:%HEALTH_PORT%/api/accounts' -TimeoutSec 10; Write-Host ('Accounts response: ' + ($response | ConvertTo-Json -Compress)); if ($response.Count -ne 3) { exit 1 } } finally { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }"
                '''
            }
        }
    }

    post {

        success {
            echo '========================================'
            echo 'FinacPlus CI/CD Pipeline PASSED'
            echo '========================================'
        }

        failure {
            echo '========================================'
            echo 'FinacPlus CI/CD Pipeline FAILED'
            echo 'Check the stage logs above.'
            echo '========================================'
        }

        always {
            echo 'Final Kubernetes state:'

            bat 'kubectl get pods -n %K8S_NAMESPACE% 2>nul || exit /b 0'
            bat 'kubectl get deployment -n %K8S_NAMESPACE% 2>nul || exit /b 0'
            bat 'kubectl get service -n %K8S_NAMESPACE% 2>nul || exit /b 0'
        }
    }
}