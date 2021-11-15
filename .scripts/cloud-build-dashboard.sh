#!/bin/bash

source "${BASH_SOURCE%/*}/utils.sh"

verifyDependency PAT

npm install -g lerna
npm install -g webpack-cli

npm set //npm.pkg.github.com/:_authToken "$PAT"

lerna bootstrap

# the cap-js package is pulled from the registry
# instead of linking the local version
# as otherwise require to pull the submodule

# the generate random principal source code lives
# in the cap-explorer project at the moment
# so we are interested in building it before usage
lerna run build --stream --scope=@psychedelic/generate-random-principal

if [[ "$NODE_ENV" == "production" ]]; then
  yarn build:production
elif [[ "$NODE_ENV" == "staging" ]]; then
  yarn build:staging
else
  echo "Oops! Missing or unknown NODE_ENV environment variable"
fi