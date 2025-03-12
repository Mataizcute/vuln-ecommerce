pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_DIR = "/home/kali/vuln-ecommerce"
    }

    stages {
        stage('Cleanup Old Containers') {
            steps {
                script {
                    sh '''
                    echo "Stopping and removing old containers..."
                    docker stop $(docker ps -aq) || true
                    docker rm $(docker ps -aq) || true
                    docker network prune -f || true
                    '''
                }
            }
        }

        stage('Pull Latest Code') {
            steps {
                script {
                    sh '''
                    echo "Fetching latest code from GitHub..."
                    cd $DOCKER_COMPOSE_DIR
                    git fetch --all
                    git reset --hard origin/main
                    git pull origin main
                    '''
                }
            }
        }

        stage('Build and Deploy Docker Containers') {
            steps {
                script {
                    sh '''
                    echo "Building and deploying Docker containers..."
                    cd $DOCKER_COMPOSE_DIR
                    docker-compose down
                    docker-compose build
                    docker-compose up -d
                    '''
                }
            }
        }
    }

    post {
        success {
            echo " Deployment Successful!"
        }
        failure {
            echo " Deployment Failed! Check logs."
        }
    }
}
