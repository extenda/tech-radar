#!/bin/sh

projectVersion=$(node -p "require('./package.json').version")

sonarParams="-Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.projectVersion=$projectVersion \
  -Dsonar.login=$SONAR_AUTH_TOKEN"

if [ "$CIRCLE_BRANCH" != "master" ]; then
  # We need to fix the reference to master, due to how CircleCI checkout code:
  # https://discuss.circleci.com/t/git-checkout-of-a-branch-destroys-local-reference-to-master/23781
  # https://community.sonarsource.com/t/code-is-empty-on-pull-request-reviews/822/11?u=sasjo
  git fetch --no-tags origin master
  git branch -D master
  git rev-parse origin/master
fi

if [ -n "$CIRCLE_PULL_REQUEST" ]; then
  pullRequestId=$(echo "$CIRCLE_PULL_REQUEST" | sed s/\\//\\n/g | tail -n 1)
  sonarParams="$sonarParams \
    -Dsonar.pullrequest.base=master \
    -Dsonar.pullrequest.branch=$CIRCLE_BRANCH \
    -Dsonar.pullrequest.key=$pullRequestId \
    -Dsonar.pullrequest.provider=github \
    -Dsonar.pullrequest.github.repository=$SONAR_ORGANIZATION/$CIRCLE_PROJECT_REPONAME"
elif [ "$CIRCLE_BRANCH" != "master" ]; then
  sonarParams="$sonarParams \
    -Dsonar.branch.name=$CIRCLE_BRANCH"
fi

# shellcheck disable=SC2086
node_modules/.bin/sonar-scanner $sonarParams
