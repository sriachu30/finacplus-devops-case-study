pipeline {
    agent any

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_REPOSITORY = 'finacplus-api'
        KIND_CLUSTER = 'finacplus'
        K8S_CONTEXT = 'kind-finacplus'
        HEALTH_PORT = '18000'
        KUBECONFIG = "${WORKSPACE}\\.kubeconfig"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'

                checkout scm

                script {
                    // Use the Git commit as the Docker image version.
                    // This gives every build an immutable, traceable image tag.
                    env.IMAGE_TAG = env.GIT_COMMIT.take(7)
                    env.IMAGE_NAME = "${env.IMAGE_REPOSITORY}:${env.IMAGE_TAG}"

                    echo "Git commit: ${env.GIT_COMMIT}"
                    echo "Docker image: ${env.IMAGE_NAME}"
                }
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
                echo "Building Docker image ${env.IMAGE_NAME}..."

                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Verify Docker Image') {
            steps {
                echo "Verifying Docker image ${env.IMAGE_NAME}..."

                bat 'docker image inspect %IMAGE_NAME%'
            }
        }

        stage('Prepare Kind Cluster') {
            steps {
                echo 'Checking Kind cluster...'

                bat '''
                    kind get clusters
                    docker ps --filter "name=finacplus-control-plane"

                    kind get clusters | findstr "finacplus" >nul

                    if errorlevel 1 (
                        echo Kind cluster not found. Creating cluster...
                        kind create cluster --name %KIND_CLUSTER% --wait 5m
                    ) else (
                        echo Kind cluster already exists.
                    )
                '''
            }
        }

        stage('Configure Kubernetes Access') {
            steps {
                echo 'Configuring Kubernetes access for Jenkins...'

                bat '''
                    kind export kubeconfig --name %KIND_CLUSTER% --kubeconfig "%KUBECONFIG%"

                    echo ===== KUBERNETES CONTEXT =====
                    kubectl config current-context

                    echo ===== KUBERNETES NODES =====
                    kubectl get nodes
                '''
            }
        }

        stage('Load Image into Kind') {
            steps {
                echo "Loading ${env.IMAGE_NAME} into Kind..."

                bat 'kind load docker-image %IMAGE_NAME% --name %KIND_CLUSTER%'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests...'

                bat 'kubectl apply -f k8s/'

                echo "Updating deployment to image ${env.IMAGE_NAME}..."

                bat '''
                    kubectl set image deployment/finacplus-api ^
                        finacplus-api=%IMAGE_NAME% ^
                        --record
                '''

                echo 'Waiting for deployment rollout...'

                bat 'kubectl rollout status deployment/finacplus-api --timeout=120s'
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                echo 'Checking Kubernetes resources...'

                bat 'kubectl get pods'
                bat 'kubectl get deployment'
                bat 'kubectl get service'

                echo 'Verifying that two replicas are available...'

                bat '''
                    kubectl get deployment finacplus-api -o jsonpath="{.status.availableReplicas}" > replicas.txt
                    set /p AVAILABLE_REPLICAS=<replicas.txt

                    if not "%AVAILABLE_REPLICAS%"=="2" (
                        echo Expected 2 available replicas but found %AVAILABLE_REPLICAS%
                        exit /b 1
                    )

                    echo Two replicas are available.
                '''

                echo 'Verifying deployed image...'

                bat '''
                    kubectl get deployment finacplus-api -o jsonpath="{.spec.template.spec.containers[0].image}"
                '''
            }
        }

        stage('Application Health Check') {
            steps {
                echo 'Starting temporary port-forward...'

                bat '''
                    powershell -NoProfile -Command "$p = Start-Process kubectl -ArgumentList 'port-forward','service/finacplus-api','%HEALTH_PORT%:8000' -PassThru -WindowStyle Hidden; Start-Sleep -Seconds 5; try { $response = Invoke-RestMethod -Uri 'http://127.0.0.1:%HEALTH_PORT%/health' -TimeoutSec 10; Write-Host ('Health response: ' + ($response | ConvertTo-Json -Compress)); if ($response.status -ne 'healthy') { exit 1 } } finally { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }"
                '''
            }
        }

        stage('API Validation') {
            steps {
                echo 'Validating accounts API...'

                bat '''
                    powershell -NoProfile -Command "$p = Start-Process kubectl -ArgumentList 'port-forward','service/finacplus-api','%HEALTH_PORT%:8000' -PassThru -WindowStyle Hidden; Start-Sleep -Seconds 5; try { $response = Invoke-RestMethod -Uri 'http://127.0.0.1:%HEALTH_PORT%/api/accounts' -TimeoutSec 10; Write-Host ('Accounts response: ' + ($response | ConvertTo-Json -Compress)); if ($response.Count -ne 3) { exit 1 } } finally { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue }"
                '''
            }
        }
    }

    post {

        success {
            echo '========================================'
            echo 'FinacPlus CI/CD Pipeline PASSED'
            echo "Deployed image: ${env.IMAGE_NAME}"
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

            bat 'kubectl get pods 2>nul || exit /b 0'
            bat 'kubectl get deployment 2>nul || exit /b 0'
            bat 'kubectl get service 2>nul || exit /b 0'
        }
    }
}