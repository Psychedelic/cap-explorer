#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
VERSION=$(node -p "require('./package.json').version")

echo "🤖 Update develop branch package versions"

git config --global user.email 'notifications@github.com'
git config --global user.name "CI"

# use PAT instead
git remote set-url --push origin "https://ci:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}"

git fetch --all

git checkout -b develop origin/develop

git checkout "$BRANCH" -- package.json
git checkout "$BRANCH" -- packages/dashboard/package.json

git commit -m "chore: 🤖 on release, package version updates for v$VERSION"

git push origin develop