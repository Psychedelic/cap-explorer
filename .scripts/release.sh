#!/bin/bash

DASHBOARD_DIR=packages/dashboard/
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🤖 NPM Semantic release"

git remote set-url --push origin "https://ci:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}"

git config --global user.email 'notifications@github.com'
git config --global user.name "CI"

npm install

npm set //npm.pkg.github.com/:_authToken "$GITHUB_TOKEN"

npm run release

VERSION=$(node -p "require('./package.json').version")

(
  cd "$DASHBOARD_DIR" || exit

  npm version "$VERSION"
)

git add --force --ignore-errors packages/dashboard/package.json packages/dashboard/package-lock.json

git show --summary

# git push --follow-tags origin "$BRANCH"
# git push --atomic origin "$BRANCH" "v$VERSION"

git push origin "$BRANCH"

git push origin "v$VERSION"
