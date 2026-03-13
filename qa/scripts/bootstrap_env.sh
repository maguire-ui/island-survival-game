#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

python3 -m venv qa/.venv
qa/.venv/bin/pip install -r qa/requirements.txt
PLAYWRIGHT_BROWSERS_PATH="$ROOT_DIR/qa/browsers" qa/.venv/bin/python -m playwright install chromium

echo "QA environment ready."
