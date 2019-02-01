library identifier: 'pipeline-library', changelog: false

configuration {
  email = false
  slack = 'devops-build'
}

def npm(args) {
  nodejs('node-latest') {
    sh "npm $args"
  }
}

buildProject {
  node('ecs-small') {
    stage('checkout') {
      sh "git config --global credential.helper 'cache --timeout=3600'"
      checkout scm
      sh 'git fetch --tags'
      npm 'ci'
      npm 'run bump-version'
    }
    stage('build') {
      npm 'run build'
    }

    if (branch('master')) {
      stage('docker') {
        def packageJson = readJSON file: 'package.json'
        def image = "extenda/tech-radar:${commitId()}"
        dockerCli "build --squash -t $image ."
        dockerCli tagAndPush: image, tags: ["v${packageJson.version}", 'latest']
      }
    }
  }
}
