#!/usr/bin/env python3
"""Conservative QA report for the Animal Friends cutouts.

The script calculates technical indicators only. It never marks artwork as
accepted and never changes the source manifest. A human visual review and a
separate rights confirmation remain mandatory.

Usage:
    python scripts/audit-animal-friends.py
    python scripts/audit-animal-friends.py --output /tmp/animal-audit.json
    python scripts/audit-animal-friends.py --strict
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - operational dependency gate
    raise SystemExit("Pillow fehlt. Installiere es separat mit: python -m pip install Pillow") from exc


def resolve_asset_path(root: Path, value: str) -> Path:
    return root / "public" / value.lstrip("/")


def inspect_image(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {
            "recommendation": "unavailable",
            "human_decision_required": True,
            "notes": [f"Datei fehlt: {path.relative_to(path.parents[2]) if len(path.parents) > 2 else path}"],
        }

    with Image.open(path) as source:
        image = source.convert("RGBA")
        width, height = image.size
        pixels = image.load()

        visible = transparent = semi = halo = 0
        edge_visible = edge_total = 0
        min_x, min_y, max_x, max_y = width, height, -1, -1

        for y in range(height):
            for x in range(width):
                red, green, blue, alpha = pixels[x, y]
                is_edge = x in (0, width - 1) or y in (0, height - 1)
                if is_edge:
                    edge_total += 1
                    if alpha > 18:
                        edge_visible += 1
                if alpha < 8:
                    transparent += 1
                    continue
                visible += 1
                min_x, min_y = min(min_x, x), min(min_y, y)
                max_x, max_y = max(max_x, x), max(max_y, y)
                if alpha < 247:
                    semi += 1
                    brightness = (red + green + blue) / 3
                    saturation = max(red, green, blue) - min(red, green, blue)
                    if brightness > 218 and saturation < 34:
                        halo += 1

    total = max(1, width * height)
    visible_ratio = visible / total
    transparent_ratio = transparent / total
    edge_ratio = edge_visible / max(1, edge_total)
    halo_ratio = halo / max(1, semi)
    margin = 0 if max_x < 0 else min(min_x, min_y, width - 1 - max_x, height - 1 - max_y)
    has_transparency = transparent_ratio > 0.02
    notes: list[str] = []

    if not has_transparency:
        notes.append("Kein ausreichender transparenter Hintergrund erkannt.")
    if visible_ratio < 0.035:
        notes.append("Motiv ist sehr klein im verfügbaren Bild.")
    if visible_ratio > 0.82:
        notes.append("Motiv oder Hintergrund füllt fast die gesamte Fläche.")
    if edge_ratio > 0.025:
        notes.append("Sichtbare Pixel berühren den Außenrand.")
    if halo_ratio > 0.18:
        notes.append("Möglicher heller Saum an halbtransparenten Kanten.")
    if margin < 3:
        notes.append("Zu wenig Sicherheitsabstand zum Bildrand.")
    if width < 220 or height < 220:
        notes.append("Auflösung ist für größere Druckformen knapp.")

    return {
        "recommendation": "candidate" if not notes else "rework",
        "human_decision_required": True,
        "dimensions": {"width": width, "height": height},
        "has_transparency": has_transparency,
        "visible_ratio": round(visible_ratio, 5),
        "transparent_ratio": round(transparent_ratio, 5),
        "edge_contact_ratio": round(edge_ratio, 5),
        "light_halo_indicator": round(halo_ratio, 5),
        "minimum_margin_px": margin,
        "notes": notes,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--manifest", default="public/catalog/visual-assets/animal-friends.json")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--strict", action="store_true", help="Exit 1 when files are missing or require rework.")
    args = parser.parse_args()

    manifest_path = args.root / args.manifest
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    results = []

    for asset in manifest["assets"]:
        source_value = asset.get("cutoutPath") or asset["path"]
        path = resolve_asset_path(args.root, source_value)
        results.append({
            "id": asset["id"],
            "name": asset["name"],
            "source": source_value,
            "rights_status": asset.get("rightsStatus", "unknown"),
            "manifest_review_status": asset.get("reviewStatus", "review_required"),
            "audit": inspect_image(path),
        })

    report = {
        "schema_version": "0.1",
        "generated_by": "scripts/audit-animal-friends.py",
        "automatic_acceptance": False,
        "collection": manifest["collection"]["id"],
        "results": results,
        "summary": {
            "total": len(results),
            "candidate": sum(item["audit"]["recommendation"] == "candidate" for item in results),
            "rework": sum(item["audit"]["recommendation"] == "rework" for item in results),
            "unavailable": sum(item["audit"]["recommendation"] == "unavailable" for item in results),
        },
    }
    rendered = json.dumps(report, ensure_ascii=False, indent=2)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)

    blocked = any(item["audit"]["recommendation"] != "candidate" for item in results)
    return 1 if args.strict and blocked else 0


if __name__ == "__main__":
    sys.exit(main())
