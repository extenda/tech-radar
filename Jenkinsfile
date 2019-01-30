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

def notAlreadyTagged() {
  def result = sh returnStdout: true, script: 'git tag -l --points-at HEAD'
  if (result.trim()) {
    return true
  }
  return false
}

buildProject {
  node('ecs-small') {
    stage('checkout') {
      sh "git config --global credential.helper 'cache --timeout=3600'"
      checkout scm

      sh 'git fetch --tags'

      npm 'ci'

      try {
        npm 'version from-git'
      } catch (e) {
        echo "No git tag(s) exists, start with version 1.0.0"
        npm 'version --no-git-tag-version 1.0.0'
      }
    }

    // We only bump version on master if HEAD isn't already tagged.
    // When bumped, the tagged is pushed, not the commit.
    if (branch('master') && notAlreadyTagged()) {
      stage('bump-version') {
        npm 'version $(npx conventional-recommended-bump -p angular) -m "Release version %s"'
        sh 'git push --tags'
      }
    }

    stage('package') {
      npm 'run package'
    }

    if (branch('master')) {
      stage('docker') {
        def version = sh returnStdout: true, script: 'node -p -e "require(\'./package.json\').version"'
        def image = "extenda/tech-radar:${commitId}"
        dockerCli "build --squash -t $image ."
        dockerCli tagAndPush: image, tags: ["v${version.trim()}", 'latest']
      }
    }
  }
}
