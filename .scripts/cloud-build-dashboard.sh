#!/bin/bash

source "${BASH_SOURCE%/*}/utils.sh"

verifyDependency PAT

npm install -g lerna
npm set //npm.pkg.github.com/:_authToken "$PAT"

lerna run build --scope=@psychedelic/cap-js
lerna run build --scope=@psychedelic/generate-random-principal

lerna bootstrap

if [[ "$NODE_ENV" == "production" ]]; then
  yarn build:production
elif [[ "$NODE_ENV" == "staging" ]]; then
  yarn build:staging
else
  echo "Oops! Missing or unknown NODE_ENV environment variable"
fi