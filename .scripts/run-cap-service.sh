#!/bin/bash

SERVICE_NAME="CAP"
AMOUNT_CYCLES=10000000000000000000
CAP_CANISTER_ID_OUTPUT=../cap_canister_id

echo "🤖 $SERVICE_NAME service initilisation..."

cd ./cap || exit 1

echo "⚠️  Clearing $SERVICE_NAME dfx cache, please wait..."

rm -rf .dfx

# extra white space added for alignment
echo "⚠️  Deploying $SERVICE_NAME, please wait..."

dfx deploy --with-cycles "$AMOUNT_CYCLES" ic-history-router

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to deploy $SERVICE_NAME"

  exit 1
fi;

LOCAL_CAP_CANISTER_ID=$(dfx canister id ic-history-router)

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to retrieve the $SERVICE_NAME canister id"

  exit 1
fi;

echo "⚠️ The local replica $SERVICE_NAME id is $LOCAL_CAP_CANISTER_ID"

echo "🤖 Generating file to hold the $SERVICE_NAME Canister id..."

rm -f "$CAP_CANISTER_ID_OUTPUT"

touch "$CAP_CANISTER_ID_OUTPUT"

echo "$LOCAL_CAP_CANISTER_ID" > "$CAP_CANISTER_ID_OUTPUT"

echo "👍 $SERVICE_NAME service is ready!"