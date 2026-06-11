#!/usr/bin/env python3
"""
Erzeugt public/rap/kid-rhymes.json fuer den FASKA Rap-Writer.

Laedt REIMWERKERs phonetische Reim-Engine (Repo: rhyme-engine) OFFLINE und
laesst sie ueber das kuratierte Kinder-Vokabular (scripts/kid_words.txt) laufen.
Vokabular = Such- UND Kandidaten-Korpus  ->  alle Reime sind kindersicher
("Kinder-Filter by design"). Kein Backend zur Laufzeit noetig: faskar-flow
liefert nur die fertige JSON statisch aus.

REIMWERKER-Pfad via Umgebungsvariable REIMWERKER_DIR ueberschreibbar.
Lauf:  /tmp/rw_venv/bin/python scripts/generate_kid_rhymes.py
"""
from __future__ import annotations
import os
import sys
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
RW = os.environ.get("REIMWERKER_DIR", "/Volumes/ThunderBolt4_2TB/Downloads/REiMWERKER")
sys.path.insert(0, RW)

try:
    from app.services.parser import parse_german_word
    from app.services.rhyme_engine import RhymeEngine
    from app.schemas.rhyme import Mode
except ImportError as e:
    sys.exit(f"REIMWERKER-Engine nicht gefunden unter {RW!r} ({e}). "
             f"Setze REIMWERKER_DIR.")

MIN_SCORE = 0.60      # nur klare Reime aufnehmen
MAX_PER_WORD = 8


def load_words(path: pathlib.Path) -> list[str]:
    seen, out = set(), []
    for line in path.read_text(encoding="utf-8").splitlines():
        w = line.strip()
        if not w or w.startswith("#"):
            continue
        if w.lower() in seen:
            continue
        seen.add(w.lower())
        out.append(w)
    return out


def main() -> None:
    words = load_words(HERE / "kid_words.txt")
    parsed, ok = [], []
    for w in words:
        try:
            parsed.append(parse_german_word(w))
            ok.append(w)
        except Exception as e:
            print(f"  parse-fail: {w}: {e}", file=sys.stderr)

    engine = RhymeEngine(parsed)
    print(f"Vokabular: {len(ok)} Woerter geparst")

    rhymes: dict[str, list[str]] = {}
    for w in ok:
        try:
            resp = engine.search(parse_german_word(w), mode=Mode.STRICT, limit=MAX_PER_WORD * 2)
        except Exception as e:
            print(f"  search-fail: {w}: {e}", file=sys.stderr)
            continue
        cands = [c.text for c in resp.results if c.score >= MIN_SCORE][:MAX_PER_WORD]
        if cands:
            rhymes[w] = cands

    out_dir = ROOT / "public" / "rap"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "kid-rhymes.json"
    payload = {
        "_meta": {
            "source": "REIMWERKER (rhyme-engine) - phonetische Engine",
            "mode": "strict",
            "minScore": MIN_SCORE,
            "wordCount": len(rhymes),
        },
        "rhymes": rhymes,
    }
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=0), encoding="utf-8")

    covered = len(rhymes)
    avg = sum(len(v) for v in rhymes.values()) / covered if covered else 0
    orphans = [w for w in ok if w not in rhymes]
    print(f"-> {out_path}")
    print(f"   {covered}/{len(ok)} Woerter mit Reimen, oe {avg:.1f} Reime/Wort, {out_path.stat().st_size} Bytes")
    if orphans:
        print(f"   ohne Reim ({len(orphans)}): {', '.join(orphans)}")


if __name__ == "__main__":
    main()
