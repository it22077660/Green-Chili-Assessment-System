#!/bin/sh
set -eu
cd "$(dirname "$0")"
port="${PORT:-5173}"
if [ -x .runtime/venv/bin/python ]; then
  exec env PORT="$port" .runtime/venv/bin/python -m backend.run
fi
exec env PORT="$port" .venv/bin/python -m backend.run
