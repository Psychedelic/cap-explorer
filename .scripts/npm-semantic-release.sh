#!/bin/bash

DASHBOARD_DIR=packages/dashboard/

echo "🤖 NPM Semantic release"

npm set //npm.pkg.github.com/:_authToken "$GITHUB_TOKEN"

(
  cd "$DASHBOARD_DIR" || exit

  npx semantic-release
)