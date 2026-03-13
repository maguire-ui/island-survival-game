# QA Runner

This folder contains the in-repo autonomous QA runner for the Island Survival Game.

Everything stays inside this repository:

- Python virtual environment: `qa/.venv/`
- Browser binaries: `qa/browsers/`
- Scripts: `qa/scripts/`
- Artifacts: `qa/artifacts/`
- Reports: `qa/reports/`

## Bootstrap

```bash
python3 -m venv qa/.venv
qa/.venv/bin/pip install -r qa/requirements.txt
PLAYWRIGHT_BROWSERS_PATH=qa/browsers qa/.venv/bin/python -m playwright install chromium
```

Or use:

```bash
sh qa/scripts/bootstrap_env.sh
```

## Run once

```bash
PLAYWRIGHT_BROWSERS_PATH=qa/browsers qa/.venv/bin/python qa/scripts/run_loop.py --once
```

## Watch mode

This reruns from Phase 1 whenever the suite fails and you then change code:

```bash
PLAYWRIGHT_BROWSERS_PATH=qa/browsers qa/.venv/bin/python qa/scripts/run_loop.py --watch
```

## Current automated phases

1. `boot_ui`
2. `solo_smoke`
3. `cave_linked_traversal`
4. `save_reload`
5. `multiplayer_join`
6. `multiplayer_cave_linked`
7. `mp_autotest_quick`
8. `mp_autotest_stress`

The runner records screenshots, JSON state, console errors, and a summary report for every attempt.
