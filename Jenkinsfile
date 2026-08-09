pipeline {
    agent any

    environment {
        IMAGE_NAME = 'finacplus-api:local'
        KIND_CLUSTER = 'finacplus'
        K8S_CONTEXT = 'kind-finacplus'
        HEALTH_PORT = '18000'
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
                echo 'Building FinacPlus Docker image...'
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Verify Docker Image') {
            steps {
                echo 'Verifying Docker image...'
                bat 'docker image inspect %IMAGE_NAME%'
            }
        }

        stage('Prepare Kind Cluster') {
            steps {
                echo 'Checking Kind cluster...'

                bat '''
                    kind get clusters | findstr /X "%KIND_CLUSTER%" >nul
                    if errorlevel 1 (
                        echo Kind cluster not found. Creating cluster...
                        kind create cluster --name %KIND_CLUSTER% --wait 5m
                    ) else (
                        echo Kind cluster already exists.
                    )
                '''

                echo 'Using Kind Kubernetes context...'
                bat 'kubectl config use-context %K8S_CONTEXT%'

                echo 'Checking Kubernetes node...'
                bat 'kubectl get nodes'
            }
        }

        stage('Load Image into Kind') {
            steps {
                echo 'Loading Docker image into Kind...'
                bat 'kind load docker-image %IMAGE_NAME% --name %KIND_CLUSTER%'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Applying Kubernetes manifests...'
                bat 'kubectl apply -f k8s/'

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
            }
        }

        stage('Application Health Check') {
            steps {
                echo 'Starting temporary port-forward...'

                bat '''
                    powershell -NoProfile -Command ^
                    "$p = Start-Process kubectl -ArgumentList 'port-forward','service/finacplus-api','%HEALTH_PORT%:8000' -PassThru -WindowStyle Hidden; ^
                    Start-Sleep -Seconds 5; ^
                    try { ^
                        $response = Invoke-RestMethod -Uri 'http://127.0.0.1:%HEALTH_PORT%/health' -TimeoutSec 10; ^
                        Write-Host ('Health response: ' + ($response | ConvertTo-Json -Compress)); ^
                        if ($response.status -ne 'healthy') { exit 1 } ^
                    } finally { ^
                        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue ^
                    }"
                '''
            }
        }

        stage('API Validation') {
            steps {
                echo 'Validating accounts API...'

                bat '''
                    powershell -NoProfile -Command ^
                    "$p = Start-Process kubectl -ArgumentList 'port-forward','service/finacplus-api','%HEALTH_PORT%:8000' -PassThru -WindowStyle Hidden; ^
                    Start-Sleep -Seconds 5; ^
                    try { ^
                        $response = Invoke-RestMethod -Uri 'http://127.0.0.1:%HEALTH_PORT%/api/accounts' -TimeoutSec 10; ^
                        Write-Host ('Accounts response: ' + ($response | ConvertTo-Json -Compress)); ^
                        if ($response.Count -ne 3) { exit 1 } ^
                    } finally { ^
                        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue ^
                    }"
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
            bat 'kubectl get pods 2>nul || exit /b 0'
            bat 'kubectl get deployment 2>nul || exit /b 0'
            bat 'kubectl get service 2>nul || exit /b 0'
        }
    }
}