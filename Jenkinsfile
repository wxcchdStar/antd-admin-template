pipeline {
  agent any
  stages {
    stage('build-jenkins') {
      when {
        branch 'feature-jenkins'
      }
      steps {
        sh 'npm install --prefer-offline'
        sh 'REACT_APP_API_DEBUG=true npm run build'
        sh 'docker build -t antd-admin-template:dev-1.0.0 .'
      }
    }
    stage('build-dev') {
      when {
        branch 'develop'
      }
      steps {
        sh 'npm install --prefer-offline'
        sh 'REACT_APP_API_DEBUG=false npm run build'
        sh 'docker build -t antd-admin-template:1.0.0 .'
      }
    }
  }
}