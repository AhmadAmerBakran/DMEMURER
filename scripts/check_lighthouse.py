#!/usr/bin/env python3
"""Fail CI when Lighthouse falls below the agreed baseline."""

from __future__ import annotations

import json
import sys
from pathlib import Path

THRESHOLDS = {
    "performance": 0.80,
    "accessibility": 0.95,
    "best-practices": 0.95,
    "seo": 0.95,
}


def main() -> int:
    if len(sys.argv) != 2:
        print("Brug: check_lighthouse.py <report.json>", file=sys.stderr)
        return 2

    report = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    categories = report.get("categories", {})
    failed = []

    for name, threshold in THRESHOLDS.items():
        score = categories.get(name, {}).get("score")
        if score is None:
            failed.append(f"{name}: mangler score")
            continue
        print(f"{name}: {score * 100:.0f} (krav {threshold * 100:.0f})")
        if score < threshold:
            failed.append(f"{name}: {score * 100:.0f} < {threshold * 100:.0f}")

    if failed:
        print("Lighthouse gate fejlede: " + "; ".join(failed), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
