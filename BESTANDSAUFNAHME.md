# FASKA Flow — Bestandsaufnahme der Spiele

> Erstellt: 2026-06-02 · Basis: Ordner A (`.gemini/antigravity/scratch/faskar-flow`, GitHub `faska-flow-pro` → Railway)
> Methode: **statische Analyse** (Datei-Struktur, Größe, Touch-Steuerung). ⚠️ Sagt aus, ob ein Spiel *vollständig gebaut* ist — **nicht**, ob es sich im Browser fehlerfrei *spielt*. Das muss separat getestet werden.

## Gesamtbild
- **98** Spiel-Ordner, davon **96** im Hub verlinkt
- Build kompiliert **fehlerfrei** (alle Importe lösen auf)
- Eingebaute Kategorien im Hub heute: **Pure Arcade** (5 Premium), **Learncade** (nur Animal-Friends-RPG), **Argschade** (= „Schrott", alle übrigen)

| Status | Bedeutung | Anzahl |
|---|---|---|
| 🟩 **FULL** | Vollständige modulare Architektur (Welt/Player/UI/Logik) + Touch | **14** |
| 🟨 **PARTIAL** | Eine Datei, oft kein Touch — funktioniert evtl., aber nicht „AAA" | **74** |
| 🟥 **STUB** | Platzhalter (9–16 Zeilen) — leer/kaputt | **7** |
| ⬛ **MISSING** | Keine Hauptdatei vorhanden (nicht mal verlinkt) | **3** |

---

## 🟩 FULL — die besten Kandidaten (14)
Diese haben die echte „Swarm"-Architektur **und** Touch-Steuerung. Beste Basis für die Aufwertung.

| Spiel | Dateien | Zeilen | Touch | Premium? |
|---|---|---|---|---|
| FaskaKartSwarm | 7 | 1199 | ✅ | ⭐ |
| FaskaSixtyFour | 8 | 1010 | ✅ | ⭐ (⚠️ laut Handoff kaputt) |
| FaskaDoomSwarm | 6 | 657 | ✅ | |
| FaskaFZeroSwarm | 6 | 614 | ✅ | |
| FaskaSnakeSwarm | 6 | 589 | ✅ | |
| FaskaFighter3 | 6 | 588 | ✅ | |
| FaskaBlocksSwarm | 6 | 568 | ✅ | |
| FaskaZeldaSwarm | 6 | 494 | ✅ | |
| FaskaJump | 6 | 422 | ✅ | |
| FaskaSpaceInvadersSwarm | 6 | 383 | ✅ | |
| FaskaLearncadeRPG | 7 | 369 | ✅ | (= Animal Friends RPG) |
| FaskaMicroMachinesSwarm | 6 | 361 | ✅ | |
| FaskaTonyHawkSwarm | 6 | 344 | ✅ | ⭐ |
| FaskaMoorhuhnSwarm | 6 | 312 | ✅ | |

## 🟥 STUB — leer/kaputt, müssen repariert oder entfernt werden (7)
`Faska64Part2` · `FaskaBreakoutSwarm` · `FaskaContraSwarm` · `FaskaKazooieSwarm` · `FaskaMarbleSwarm` · `FaskaSonicSwarm` · `FaskaTombSwarm`

## ⬛ MISSING — keine Hauptdatei, nicht verlinkt → löschen (3)
`FaskaFrisbee` · `FaskaSoccer` · `FaskaTennis`

## 🟨 PARTIAL — Einzeldatei-Spiele (74)
Existieren, aber dünn und meist **ohne Touch**. Kandidaten für „Argschade" bzw. spätere Auswahl.
Größere/substanziellere darunter (evtl. rettenswert):
- FaskaPinballSwarm (1292) · FaskaPacSwarm (940) · FaskaCoreArcade (875 ⭐, Touch ✅) · FaskaDarkCitadel (842 ⭐, Touch ✅) · FaskaRage (623) · FaskaWolfSwarm (595, Touch ✅) · FaskaTurtles (578)
- **Nur ~4 der 74 haben Touch** → großes Mobil-Problem laut deinem Anspruch.

---

## ⚠️ Wichtigste Erkenntnis
Der „Premium"-Tag ≠ „funktioniert". Beispiel: **FaskaSixtyFour** ist als Premium markiert und sieht strukturell komplett aus (8 Dateien) — laut Handoff stürzt es aber ab. **Nur ein echter Browser-Test** zeigt, was wirklich spielbar ist.

## Empfohlene nächste Schritte
1. **Runtime-Test** der wichtigsten Titel im Browser (die 5 Premium + die laut Handoff kaputten: Faska64, Zelda, Doom, Kart) → echte „läuft / kaputt"-Wahrheit.
2. **Aufräumen**: 7 Stubs + 3 Missing entfernen oder klar als „kaputt" kennzeichnen.
3. **Trennung** in zwei Apps planen: FASKA Flow (Lern-Module + beste Spiele + Kunst) ↔ Retro Arcade (Rest, nach Reifegrad sortiert).
