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