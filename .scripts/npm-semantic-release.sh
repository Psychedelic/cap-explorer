#!/bin/bash

DASHBOARD_DIR=packages/dashboard/

echo "🤖 NPM Semantic release"

(
  cd "$DASHBOARD_DIR" || exit

  npx semantic-release
)