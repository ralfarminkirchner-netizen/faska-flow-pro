# Codex-Arbeitsvertrag für FASKA Flow Pro

## Ziel

Dieses Repository enthält mehrere eigenständige Erfahrungsräume. Der neue Bereich `public/documentation/` ist ein vertikaler Prototyp für pädagogische Dokumentation. Er darf bestehende Spiele, 3D-Räume oder Bildbestände anschließen, aber nicht mit deren Zuständen, Scores oder Personenmodellen verschmelzen.

## Nicht verhandelbare Regeln

1. **Repräsentation ist nicht das Kind.** Eine Episode, Spur, Projektion oder KI-Ausgabe darf niemals als Identitätsaussage behandelt werden.
2. **Beobachtung ist nicht Deutung.** Direkte Beobachtung, berichtete Rede, Hypothese, Alternative, Angebot und Wirkung bleiben getrennte Typen.
3. **Bildungsplanbezug ist kein Kompetenznachweis.** Jede Zuordnung ist ein begründeter Kandidat mit Quellenreferenz, Geltungsbereich und menschlicher Entscheidung.
4. **Vorschlag ist kein Auftrag.** Angebote müssen veränderbar, ablehnbar, aufschiebbar und reversibel sein. Nichtintervention ist ein regulärer Ausgang.
5. **Keine Diagnose oder Wahrscheinlichkeit über Kinder.** Keine versteckten ADHS-, Trauma-, Begabungs-, Risiko- oder Typ-Scores.
6. **Kein globaler Lern- oder Entwicklungswert.** Konfligierende Dimensionen dürfen nicht in einem Gesamtscore kollabieren.
7. **Originalquellen werden nicht überschrieben.** Transformationen erzeugen neue versionierte Objekte und einen nachvollziehbaren Übergang.
8. **Keine automatische Kanonisierung.** KI, Regeln, Ähnlichkeitssuche und Spielresultate erzeugen höchstens Vorschläge.
9. **Menschliche Autorisierung bleibt getrennt.** Erzeugung, Prüfung, Entscheidung und Wirkung dürfen nicht unkontrolliert in derselben Funktion zusammenfallen.
10. **Rechte und Qualität sind getrennte Gates.** Ein sauber freigestelltes Bild ist noch nicht zur Nutzung autorisiert.

## Architekturgrenzen

```text
Dokumentationskern
  Episoden · Aussagen · Quellen · Bildungsplanlinks · Übergänge · Revision

Aktivitätskatalog
  Lernspiele · Aufgabenformen · Materialmanifeste · Adapter

Verkörperung
  Werkstatt · Tierwelt · Sternbild · Karte · spätere weitere Projektionen

Asset-Katalog
  Original · Cutout · automatische Vorprüfung · menschliche Sichtprüfung · Rechtefreigabe
```

Der Dokumentationskern darf keine Komponenten eines alten Spiels direkt importieren. Bestehende Spiele werden über versionierte Manifeste und schmale Adapter angeschlossen. Die Mindestgrenze lautet:

```text
Spielzustand / Punkte / Fortschritt
    !=
Beobachtung / Kompetenz / Kindprofil
```

Ein Spieladapter darf nur begrenzte Ereignisse liefern, zum Beispiel:

```json
{
  "activity_id": "deutsch-party-brett",
  "activity_version": "...",
  "operation": "sentence_ordering",
  "context": "frei gewählte Gruppenaktivität",
  "observed_event": "Runde beendet",
  "effect_claim": null
}
```

## Tierfiguren

- Quelle und Urheberschaft erhalten.
- `scripts/audit-animal-friends.py` erzeugt nur technische Indikatoren.
- Keine automatische Freigabe.
- Verwendung nur, wenn `visual_review = accepted` **und** `rights_confirmed = true`.
- Original, Cutout und spätere Varianten bleiben getrennt.
- Nachbearbeitung erzeugt eine neue Version; die alte Datei bleibt referenzierbar.

## Bildungsplanquellen

- Nur offizielle, versionierte Quellen des Landes Baden-Württemberg als Primärquelle.
- Deutsch und Mathematik müssen den jeweils geltenden V2-Stand ausweisen.
- Sachunterricht und weitere Fächer führen ihren eigenen Versionsstand.
- Modellgedächtnis ist keine Curriculumquelle.
- Jeder Link speichert mindestens `source_version`, `node_code`, `title`, `source_url`, `evidence_excerpt`, `status` und `reviewed_by`.

## KI-Grenze

Bis zur bestätigten OpenAI-Credential-Entscheidung bleibt `public/documentation/` vollständig lokal und deterministisch. Vor jeder Implementierung, Konfiguration oder Ausführung eines OpenAI-API-Pfads muss der Credential-Gate-Workflow durchgeführt werden. Keine API-Schlüssel in Commits, Logs, Issues, Screenshots oder Browsercode.

Für die spätere KI-Schicht gelten zusätzlich:

- serverseitiger Aufruf;
- strikte strukturierte Ausgabe;
- Quellen- und Statusfelder obligatorisch;
- keine freien Personenattribute;
- keine automatische Entscheidung;
- Modellname, Promptversion, Eingabequellen und Ausgabe-Hash im Übergangsprotokoll;
- Human-in-the-loop vor jeder Übernahme in einen Bericht oder eine längerfristige Spur.

## Datenschutz

Der aktuelle Alpha-Bereich darf nur fiktive Daten verwenden. Vor Realbetrieb sind mindestens erforderlich:

- Verantwortlichkeit und Rollenmodell der Schule;
- Rechtsgrundlage und Zweckbindung je Datentyp;
- Auftragsverarbeitungsverträge;
- EU/EWR-Datenflussprüfung;
- Datenschutz-Folgenabschätzung;
- Lösch-, Berichtigungs-, Auskunfts-, Widerspruchs- und Exportwege;
- kindgerechte Information und Beteiligung;
- technische Zugriffstrennung mit Row-Level Security;
- getrennte Entwicklungs-, Test- und Produktionsdaten.

## Qualitätsregeln für Code

- Kleine, überprüfbare Commits.
- Keine stillen Datenmigrationen.
- Keine Speicherung aus UI-Ereignissen ohne expliziten Intent.
- Alle folgenmächtigen Statuswechsel erhalten ein Ledger-Ereignis.
- Barrierefreiheit nach WCAG 2.2 AA anstreben: Tastatur, Fokus, Kontrast, reduzierte Bewegung, verständliche Beschriftung.
- Mobile und Tablet zuerst prüfen.
- Fehlerzustände dürfen keine Originaldaten löschen.

## Lokale Prüfung

```bash
npm install
npm run build
node --check public/documentation/app.js
node --check public/documentation/data.js
node --check public/documentation/ui.js
node --check public/documentation/assets.js
python -m py_compile scripts/audit-animal-friends.py
python scripts/audit-animal-friends.py --output /tmp/animal-friends-audit.json
```

Der Asset-Audit ist ohne `--strict` informativ. `--strict` ist erst sinnvoll, wenn alle Quellen im Checkout vorhanden und die Schwellenwerte gemeinsam festgelegt sind.

## Abnahmekriterium des ersten Slices

Ein fiktiver Lernmoment kann vollständig durchlaufen werden:

```text
Originalbeobachtung
→ getrennte Aussagen
→ begründete Curriculumkandidaten
→ menschliche Prüfung
→ Lernspurprojektion
→ mehrere unterschiedliche Anschlussangebote
→ dokumentierte Annahme, Veränderung, Ablehnung oder Aufschub
→ neue Episode
```

Dabei bleiben Herkunft, Aussageart, Unsicherheit, Rechte, Nichtgleichsetzungen und Revisionsweg sichtbar.
