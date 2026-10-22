#!/bin/sh
set -eu
cd "$(dirname "$0")"
if [ -x .runtime/venv/bin/python ]; then
  exec .runtime/venv/bin/python -m backend.run
fi
exec .venv/bin/python -m backend.run
