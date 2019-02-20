#!/bin/sh
reference="$CIRCLE_SHA1"
if [ -z "$reference" ]; then
  reference="HEAD"
fi

branch="$CIRCLE_BRANCH"
if [ -z "$branch" ]; then
  branch=$(git rev-parse --abbrev-ref "$reference")
fi

git fetch --tags

version=$(git describe --abbrev=0 --tags 2> /dev/null || echo '1.0.0')
newVersion="$version"
tagged=$(git tag -l --points-at "$reference")

# We only bump version on master if ref isn't already tagged.
# When bumped, the tagged is pushed, not the commit.
if [ "$branch" = "master" ] && [ -z "$tagged" ]; then
  newVersion=$(npx semver -i "$(npx conventional-recommended-bump -p angular)" "$version")
  echo "Bump $version => $newVersion"
  git tag -a "v$newVersion" -m "Release $newVersion"
  git push origin "v$newVersion"
fi

npm version --no-git-tag-version "$newVersion"
