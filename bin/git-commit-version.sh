#!/bin/sh
version=$(node -p -e "require('./package.json').version")
git add package.json package-lock.json
git commit -m "Update version to $version"
