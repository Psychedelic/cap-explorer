#!/bin/bash

echo "🤖 Semantic release"

npm install

npm set //npm.pkg.github.com/:_authToken "$GITHUB_TOKEN"

npx semantic-release
