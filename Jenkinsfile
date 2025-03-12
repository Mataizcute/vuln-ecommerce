pipeline {
    agent any

    stages {
        stage('Pull latest code') {
            steps {
                git branch: 'main', credentialsId: 'your-jenkins-git-credentials', url: 'https://github.com/Mataizcute/vuln-ecommerce.git'
            }
        }

        stage('Build Docker Containers') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
