#!/usr/bin/env bash
set -euo pipefail
PID="$1"
sed -i.bak "s/declare_id!(\"[0-9A-Za-z]*\"\);/declare_id!(\"$PID\");/" programs/vanta/src/lib.rs
