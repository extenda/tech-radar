#!/bin/sh
version=$(git describe --abbrev=0 --tags 2> /dev/null || echo '1.0.0')
newVersion="$version"
branch=$(git rev-parse --abbrev-ref HEAD)
tagged=$(git tag -l --points-at HEAD)

# We only bump version on master if HEAD isn't already tagged.
# When bumped, the tagged is pushed, not the commit.
if [ "$branch" = "master" ] && [ -z "$tagged" ]; then
  newVersion=$(npx semver -i "$(npx conventional-recommended-bump -p angular)" "$version")
  echo "Bump $version => $newVersion"
  git tag -a "v$newVersion" -m "Release $newVersion"
  git push --tags
fi

npm version --no-git-tag-version "$newVersion"
