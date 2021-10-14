#!/bin/bash

echo "🦖 CAP Service reset"

CAP_WORKDIR=./cap

dfx stop

rm -rf .dfx

cd "$CAP_WORKDIR" || (echo "🤡 Oops! Missing CAP Service repo..." & exit 1)

cargo clean
rm -rf .dfx
rm -rf target

echo "👍 CAP Service reset completed!"
