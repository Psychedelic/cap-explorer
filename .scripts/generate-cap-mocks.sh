#!/bin/bash

source "${BASH_SOURCE%/*}/utils.sh"

echo "🦖 Generate CAP mock data"
echo ""

DEFAULT_MOCK_COUNT=20
MOCK_COUNT=${1:-$DEFAULT_MOCK_COUNT}

echo "🦄 A total of $MOCK_COUNT transactions will be generated"
echo ""

# Check if DFX alive or abort
is_dfx_alive || exit 1

ROUTER_CANISTER_ID=$(cat cap_canister_id)

if [[ -z "$ROUTER_CANISTER_ID" ]]; then
  echo "🤡 Oops! Is the CAP Service \`ic-history-router\` running?"
  # Extra-white space between icon and text for alignment
  echo "✏️ Check the docs to learn how to deploy the CAP Service, please!"

  exit 1;
fi

echo "💡 The CAP Service ic-history-router Canister id is $ROUTER_CANISTER_ID"
echo ""

# Open the CAP workdir or exit
cd ./cap || exit 1

IC_MANAGEMENT_CANISTER="aaaaa-aa"
ROUTER_CANISTER_NAME="ic-history-router"
DFX_USER_WALLET=$(dfx identity get-wallet)
DFX_USER_PRINCIPAL=$(dfx identity get-principal)
GENERATED_CAP_MOCK_LOG_FILENAME="generate_cap_mock"
GENERATED_CAP_MOCK_LOG_FILEPATH="../$GENERATED_CAP_MOCK_LOG_FILENAME.log"

if [ -f "$GENERATED_CAP_MOCK_LOG_FILEPATH" ]; then
  echo "🦄 Clearing previous generated mock log..."
  echo ""

  rm "$GENERATED_CAP_MOCK_LOG_FILEPATH" || exit 1
fi

ROUTER_CANISTER_ID=$(dfx canister id "$ROUTER_CANISTER_NAME")

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to get the id for the Router canister"

  exit 1
fi;

echo "💡 The Router canister id is $ROUTER_CANISTER_ID"

echo "🤖 Creating root bucket canister..."
echo ""

CREATE_CANISTER_RESULT=$(dfx canister --wallet="$DFX_USER_WALLET" call "$IC_MANAGEMENT_CANISTER" create_canister "(record { cycles=(4_000_000_000_000:nat64); controller=(opt principal \"$DFX_USER_PRINCIPAL\") })")

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to create root bucket canister..."
  echo "💡 Oops! Was the CAP Service ic-history-router deployed?"
  # Extra-white space between icon and text for alignment
  echo "✏️ Check the docs to learn how to deploy the CAP Service, please!"

  exit 1
fi;

ROOT_CANISTER_ID=$(echo "$CREATE_CANISTER_RESULT" | cut -d '"' -f 2)

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to parse the Root canister id"

  exit 1
fi;

echo "🤖 Created root canister with id $ROOT_CANISTER_ID"

echo "🤖 Update controller settings via IC Management canister $IC_MANAGEMENT_CANISTER..."
echo "💡 Sets Router ($ROUTER_CANISTER_ID) as controller of Root bucket ($ROOT_CANISTER_ID)"

dfx canister --wallet="$DFX_USER_WALLET" call "$IC_MANAGEMENT_CANISTER" update_settings "(record { canister_id=(principal \"$ROOT_CANISTER_ID\"); settings=(record { controller = opt principal \"$ROUTER_CANISTER_ID\"; null; null; null; }) })"

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to update controller settings..."

  exit 1
fi;


echo "💡 Display the info for the Root Canister ($ROOT_CANISTER_ID)"

dfx canister info "$ROOT_CANISTER_ID"

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failure to provide Root canister info..."

  exit 1
fi;

echo "🤖 Install the bucket code..."
echo "💡 Where Root is ($ROOT_CANISTER_ID) passed via a call to Router ($ROUTER_CANISTER_ID)"

dfx canister call "$ROUTER_CANISTER_ID" install_bucket_code "(principal \"$ROOT_CANISTER_ID\")"

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to install bucket code"

  exit 1
fi;

echo "🤖 Mock Transaction data insertion"
echo "🦄 A total of $MOCK_COUNT will be inserted to the Root bucket $ROOT_CANISTER_ID"
echo ""

# Iterator over the request mock count (or default count)
for i in $(seq "$MOCK_COUNT"); do
  echo "Inserting transaction nr $i to the Root bucket"

  dfx canister call "$ROOT_CANISTER_ID" insert "(record { to=(principal \"$DFX_USER_PRINCIPAL\"); fee=(1:nat64); from=(opt principal \"$DFX_USER_PRINCIPAL\"); memo=(0:nat32); operation=(variant {\"Approve\"}); caller=(principal \"$DFX_USER_PRINCIPAL\"); amount=(10:nat64); })"

  if [ $? -ne 0 ]; then
    echo "🤡 Oops! Failed to Insert a transaction to the Root bucket..."

    exit 1
  fi;
done

echo "🤖 Get all transactions for the root bucket"
LOG_ALL_TRANSACTIONS=$(dfx canister call "$ROOT_CANISTER_ID" get_transactions "(record {page=null; witness=(false:bool)})")

echo "🤖 Get user transactions"
LOG_USER_TRANSACTIONS=$(dfx canister call "$ROOT_CANISTER_ID" get_user_transactions "(record {user=(principal \"$DFX_USER_PRINCIPAL\"); witness=(false:bool)})")

echo "🤖 Get user Root buckets"
LOG_USER_ROOT_BUCKETS=$(dfx canister call "$ROUTER_CANISTER_ID" get_user_root_buckets "(record { user=(principal \"$DFX_USER_PRINCIPAL\"); witness=(false:bool)})")

echo "🤖 Get all Root buckets in CAP"
LOG_GET_ALL_ROOT_BUCKETS_IN_CAP=$(dfx canister call "$ROUTER_CANISTER_ID" get_user_root_buckets "(record { user=(principal \"$IC_MANAGEMENT_CANISTER\"); witness=(false:bool)})")

echo "🤖 Index Canisters"
LOG_INDEX_CANISTERS=$(dfx canister call "$ROUTER_CANISTER_ID" get_index_canisters "(record {witness=(false:bool)})")

echo "🤖 Get next canisters"
LOG_GET_NEXT_CANISTERS=$(dfx canister call "$ROOT_CANISTER_ID" get_next_canisters "(record {witness=(false:bool)})")

echo "🤖 Contract root buckets"
LOG_CONTRACT_ROOT_BUCKETS=$(dfx canister call "$ROUTER_CANISTER_ID" get_token_contract_root_bucket "(record { canister=(principal \"$DFX_USER_PRINCIPAL\"); witness=(false:bool)})")

echo "🤖 Log the details onto project root $GENERATED_CAP_MOCK_LOG_FILENAME"

{
  echo "🦖 Generated CAP mock data (Log)"
  echo ""

  insert_to_log "The Router Canister id" "$ROUTER_CANISTER_ID"
  insert_to_log "The Root Canister id" "$ROOT_CANISTER_ID"
  insert_to_log "All transactions" "$LOG_ALL_TRANSACTIONS"
  insert_to_log "User transactions" "$LOG_USER_TRANSACTIONS"
  insert_to_log "User root buckets" "$LOG_USER_ROOT_BUCKETS"
  insert_to_log "Get all root buckets in CAP" "$LOG_GET_ALL_ROOT_BUCKETS_IN_CAP"
  insert_to_log "Index Canisters" "$LOG_INDEX_CANISTERS"
  insert_to_log "Get next Canisters" "$LOG_GET_NEXT_CANISTERS"
  insert_to_log "Contract root buckets" "$LOG_CONTRACT_ROOT_BUCKETS"
  echo ""

  echo "🏁 End of generated CAP mock data log file!"
} >> "$GENERATED_CAP_MOCK_LOG_FILEPATH"

if [ $? -ne 0 ]; then
  echo "🤡 Oops! Failed to generate the log"

  exit 1
fi;

echo ""
echo ""

echo "👍 Generate CAP mocks has completed!"
echo ""
