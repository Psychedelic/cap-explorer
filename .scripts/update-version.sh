#!/bin/bash

DASHBOARD_DIR=packages/dashboard/
VERSION=$(node -p "require('./package.json').version")

(
  cd "$DASHBOARD_DIR" || exit

  npm version "$VERSION"
)
