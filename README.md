# FASKA Flow Pro

Ein wachsendes Repository für getrennte, aber anschließbare Lern-, Spiel- und Dokumentationsräume.

## Bereiche

| Bereich | Route | Status |
|---|---|---|
| FASKA Flow | `/?app=flow` | bestehender Lern- und Erfahrungsraum |
| Retro Arcade | `/?app=arcade` | bestehender Spielraum |
| Lernspuren · Dokumentation | `/documentation/` | neuer lokaler Alpha-Slice mit fiktiven Daten |

Die Bereiche teilen ein Repository, aber keine unkontrollierten Zustände. Lernspiele werden über Aktivitätsmanifeste angeschlossen. Punkte, Spielprofile oder Fortschrittswerte dürfen nicht als Kompetenznachweise oder Kindprofile in die Dokumentation gelangen.

## Lernspuren-Alpha

Der neue Bereich zeigt einen vollständigen lokalen Durchstich:

```text
Originalbeobachtung
→ getrennte Aussagearten
→ begründete Bildungsplan-Kandidaten
→ menschliche Prüfung
→ Episode, Spur und Landschaft
→ mehrere ablehnbare Anschlussangebote
→ Wirkungsbeobachtung
→ neue Episode
```

Enthalten sind außerdem:

- lokales Ereignisprotokoll;
- JSON-Export;
- druckbare Lernkarte;
- Werkstatt-, Tierwelt-, Sternbild- und Kartenprojektion;
- Katalogadapter für `Deutsch Party Brett`;
- elf Animal-Friends-Motive mit technischer Vorprüfung;
- getrennte menschliche Sichtprüfung und Rechtebestätigung;
- Supabase-Schema- und RLS-Blueprint;
- CI-Konformitätsprüfung.

Der Alpha verwendet ausschließlich einen fiktiven Demonstrationsfall und Browser-`localStorage`. Er ist nicht für reale Kinderdaten freigegeben.

## Lokal starten

```bash
npm install
npm run dev
```

Danach:

- Startseite: `http://localhost:5173/`
- Lernspuren: `http://localhost:5173/documentation/`

## Prüfen

```bash
npm run check:documentation
npm run build
python -m py_compile scripts/audit-animal-friends.py
python -m pip install Pillow
python scripts/audit-animal-friends.py --output /tmp/animal-friends-audit.json
```

Die technische Tierprüfung erzeugt nur Hinweise. Sie akzeptiert keine Datei automatisch.

## Architektur und Recherche

- [`AGENTS.md`](AGENTS.md) – verbindlicher Codex-Arbeitsvertrag und Schutzregeln
- [`docs/FASKA_DOCUMENTATION_V0.md`](docs/FASKA_DOCUMENTATION_V0.md) – Produkt- und Architekturkonzept
- [`docs/RESEARCH_AND_COMPLIANCE_2026-07.md`](docs/RESEARCH_AND_COMPLIANCE_2026-07.md) – Quellen, Rechts- und Umsetzungsgates
- [`BESTANDSAUFNAHME.md`](BESTANDSAUFNAHME.md) – statische Bestandsaufnahme vorhandener Spielmodule
- [`supabase/migrations/202607240001_faska_documentation_v0.sql`](supabase/migrations/202607240001_faska_documentation_v0.sql) – versioniertes Datenmodell mit RLS

## Verfassungsgrenzen

- Episode ist nicht Ereignis.
- Spur ist nicht Eigenschaft.
- Hypothese ist nicht Diagnose.
- Bildungsplanbezug ist nicht Kompetenznachweis.
- Vorschlag ist nicht Auftrag.
- Nutzung ist nicht Erfolg.
- KI-Ausgabe ist nicht autorisierte Aussage.
- Ein sauber ausgeschnittenes Bild ist noch nicht zur Nutzung berechtigt.

Die OpenAI-API ist im aktuellen Branch bewusst noch nicht angebunden. Vor jeder API-Implementierung muss die sichere Credential-Entscheidung getroffen werden; reale schulische Daten bleiben bis zur Datenschutz-, Rollen- und Governance-Freigabe blockiert.
