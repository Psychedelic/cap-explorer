#!/bin/bash

insert_to_log() {
  TITLE="$1"
  OUTPUT="$2"

  echo ""
  echo "# $TITLE"
  echo ""
  echo "$OUTPUT"
  echo ""
  echo "------------------------------------------------------"
}

is_dfx_alive() {
  dfx ping &> /dev/null

  if [ $? -ne 0 ]; then
    echo "🤡 Oops! Is the DFX Local replica running?"
    # Extra-white space between icon and text for alignment
    echo "✏️  Check the docs to learn how to start the local replica, please!"

    exit 1
  fi;
}

verifyDependency() {
  for var in "$@"; do
    if [[ ! ${!var+set} ]]; then
      echo "🤡 Oops! Missing the $var environment variable..."

      exit 1
    fi;
  done;
}
