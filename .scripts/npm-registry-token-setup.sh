#!/bin/bash

source "${BASH_SOURCE%/*}/utils.sh"

verifyDependency PAT

echo "🤖 NPM Registry token setup running..."

echo "//npm.pkg.github.com/:_authToken=$PAT" >> .npmrc

echo "👍 NPM Registry token setup done."
echo ""
