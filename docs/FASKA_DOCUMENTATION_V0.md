# FASKA Dokumentation · Lernspuren v0

**Status:** ausführbarer lokaler Alpha-Slice, keine Produktivfreigabe  
**Route:** `/documentation/`  
**Branch:** `codex/faska-dokumentation-v0`

## Produktkern

Die Anwendung entlastet Lernbegleitungen von maschinenförmiger Erinnerungs-, Vergleichs- und Zuordnungsarbeit, ohne aus Dokumentation ein verborgenes Bewertungs- oder Diagnosesystem zu machen.

Der Kernsatz lautet:

> Nicht das Kind ist die Datenstruktur. Sein Weg ist die Datenstruktur.

Die App speichert im Zielsystem keine abschließenden Persönlichkeitsprofile. Sie verwaltet quellengebundene Episoden, getrennte Aussagearten, Bildungsplanbezüge, Erprobungsangebote, Wirkungsbeobachtungen und Revisionen.

## Was der Alpha-Slice bereits zeigt

1. Eine kurze Beobachtung wird als unveränderte Originalspur gehalten.
2. Direkte Beobachtung, berichtete Rede, Hypothese, alternative Erklärungen und Grenze werden getrennt dargestellt.
3. Bildungsplanbezüge erscheinen als einzelne, evidenzgebundene Kandidaten.
4. Eine menschliche Prüfung bleibt vor dem Status `reviewed` zwingend.
5. Derselbe Episodenzusammenhang kann als Episode, Spur oder Landschaft betrachtet werden.
6. Die sichtbare Verkörperung kann zwischen Werkstatt, Tierwelt, Sternbild und Karte wechseln.
7. Sechs grundverschiedene Anschlussrichtungen bleiben nebeneinander bestehen.
8. Annahme, Veränderung, Ablehnung und Aufschub eines Angebots können als neue Episode zurückkehren.
9. Das ältere `Deutsch Party Brett` ist über ein Manifest angeschlossen, nicht in den Dokumentationskern kopiert.
10. Tiermotive besitzen getrennte technische Vorprüfung, menschliche Sichtprüfung und Rechtebestätigung.
11. Alle folgenmächtigen lokalen Aktionen erscheinen in einem Ereignisprotokoll.
12. Der Slice funktioniert ohne Cloud, Login oder externe KI-API und verwendet ausschließlich einen fiktiven Fall.

## End-to-End-Bewegung

```text
Originalbeobachtung
  ↓
Episode
  ↓
Aussagearten und Grenzen
  ↓
Bildungsplan-Kandidaten
  ↓
menschliche Prüfung
  ↓
Spurprojektion
  ↓
mehrere Anschlussräume
  ↓
gewählte, veränderte, abgelehnte oder aufgeschobene Erprobung
  ↓
Wirkungsbeobachtung
  ↓
neue Episode und Re-Entry
```

## Begriffs- und Statusordnung

| Typ | Bedeutung | Darf nicht automatisch werden |
|---|---|---|
| `SourceRecord` | unveränderte Beobachtung, Diktat, Bild oder Selbstbericht | Interpretation |
| `Episode` | dokumentierter Ausschnitt einer Situation | Ereignis selbst |
| `Statement` | typisierte Aussage innerhalb einer Episode | allgemeine Wahrheit |
| `CurriculumLinkCandidate` | möglicher Bezug zu einer offiziellen Planstelle | Kompetenznachweis |
| `TraceProjection` | situierte Ansicht mehrerer Episoden und Beziehungen | Kindprofil |
| `Offer` | vorbereitete, ablehnbare Möglichkeit | Auftrag |
| `EffectObservation` | perspektivische Beobachtung nach einem Angebot | Kausalitätsbeweis |
| `TransitionEvent` | append-only Spur eines Status- oder Bearbeitungsschritts | vollständige Wirkung |

## Erkenntnisleiter

```text
Direkte Beobachtung
→ wiederkehrendes Muster
→ mögliche funktionale Deutung
→ alternative Erklärungen
→ erprobbares Angebot
→ beobachtete Wirkung
```

Jede Stufe kann offenbleiben. Eine höhere Stufe überschreibt die frühere nicht. Widerspruch und neue Beobachtungen erzeugen Revisionen, keine rückwirkende Unsichtbarkeit.

## Bildungsplan als Karte

Die Bewegungsrichtung ist:

```text
Tätigkeit des Kindes
→ erkennbare Zusammenhänge
→ mögliche Bildungsplanbezüge
```

Nicht:

```text
Bildungsplan
→ Aufgabe
→ Kind muss sich der Aufgabe angleichen
```

Der Alpha-Slice enthält exemplarische Quellenanker für:

- Sachunterricht `3.1.3.3 Bauten und Konstruktionen`;
- Sachunterricht `3.1.6 Experimente`;
- Mathematik V2 `2.3 Probleme mathematisch lösen`;
- Mathematik V2 `3.1.2 Mit Größen umgehen`;
- Deutsch V2 `2.1 Sprechen und Zuhören`.

Im Produktivsystem wird der vollständige Plan als versioniertes Quellenregister importiert. Jede Zuordnung führt Quelle, Version, Code, Evidenzausschnitt, Geltungsbereich und Prüfentscheidung mit.

## Projektionen und Zoom

Der gemeinsame Hintergrund darf mehrere radikal unterschiedliche Ansichten hervorbringen:

- **Episode:** einzelne Quelle und Aussagearten;
- **Spur:** Beziehungen zwischen Bauen, Überarbeiten, Erklären, Ortswechsel und Rückkehr;
- **Landschaft:** mehrere Episoden, Themen, Medien und offene Fragen;
- **Gruppen- oder Schulansicht:** nur aggregierte, zweckgebundene und datenschutzgeprüfte Strukturen; keine Rückrechnung auf Personen.

Eine Projektion ist eine wählbare Zugangsweise. Sie ist weder Personmodell noch Wahrheitsschicht. Ein Wechsel der Bildsprache darf keinen semantischen Statuswechsel erzeugen.

## Anschlussräume

Der Demo-Fall erzeugt bewusst keine Rangliste, sondern sechs qualitativ verschiedene Richtungen:

- praktisch bauen und vergleichen;
- messen und formal beschreiben;
- erzählen, erklären oder dokumentieren;
- Bewegung oder Klang als Modell verwenden;
- eine kooperative Spielvariante öffnen;
- ruhen lassen, parken, zurückkehren oder beenden.

Zu jedem Angebot gehören:

- vorbereitete Umgebung;
- Beobachtungsfrage;
- Grenze der zulässigen Folgerung;
- Annahme-, Änderungs-, Ablehnungs- und Aufschubweg;
- spätere Wirkungsbeobachtung.

## Bestehende Lernspiele

Alte Spiele bleiben eigenständige Produkte. FASKA Dokumentation liest lediglich ein `LearningActivityManifest` und später ein begrenztes Adapterprotokoll.

```text
Legacy-Spiel
→ Bestandsaufnahme
→ Mechanik- und Rechteprüfung
→ Manifest
→ optionaler Adapter
→ kuratierter Vorschlag
→ reale Nutzung
→ begrenzte Wirkungsbeobachtung
```

Nicht zulässig:

- kompletter Import eines alten App-Zustands;
- Übernahme von Punkten oder Erfolgsquoten als Kompetenz;
- Ableitung eines Kinderprofils aus Spielwahl oder Spielverhalten;
- automatische Auswahl aufgrund einer angenommenen Eigenschaft.

`Deutsch Party Brett` ist als erster Kandidat registriert. Stärken der vorhandenen Architektur sind die Trennung von Aufgaben-Generator und Minispiel-Renderer, ein gemeinsames Minispiel-Interface und eine große Bandbreite sprachlicher Mechaniken. Der Laufzeit-, Inhalts-, Zugänglichkeits- und Unterrichtstest steht noch aus.

## Tieratelier

Die Tierfiguren sind kein dekorativer Nebenbestand, sondern autorisierte visuelle Materialien mit eigener Genealogie.

```text
Original
→ Freistellungsvariante
→ technische Vorprüfung
→ menschliche Sichtprüfung
→ Rechtebestätigung
→ verwendbare Version
```

Technische Indikatoren:

- Transparenz;
- Motivfläche;
- sichtbarer Randkontakt;
- möglicher heller Saum;
- Sicherheitsabstand;
- Auflösung.

Diese Werte sind kein Freigabescore. Verwendbar ist ein Motiv nur bei:

```text
visual_review = accepted
AND
rights_confirmed = true
```

## Zielarchitektur

```text
apps/documentation
  Capture · Review · Trace · Offer · Material · Report · Governance

packages/learning-core
  SourceRecord · Episode · Statement · EffectObservation

packages/curriculum-registry
  CurriculumSource · CurriculumNode · CurriculumLinkCandidate

packages/activity-catalog
  LearningActivityManifest · ActivityAdapter · ActivityEvent

packages/visual-assets
  AssetSource · AssetVariant · AssetAudit · AssetReview · RightsGrant

packages/projection-engine
  ProjectionDefinition · LocalProjectionState · TransferBundle

packages/transition-ledger
  TransitionCase · Proposal · Authorization · Event · Assessment · Revision
```

Für den bestehenden Vite-Stand ist der Alpha bewusst als statischer, isolierter Bereich unter `public/documentation/` umgesetzt. Nach dem Praxistest kann er in eine TypeScript-Domäne oder ein Monorepo überführt werden, ohne FASKA Flow oder Retro Arcade umzubauen.

## KI-Zielbild

Die spätere KI-Schicht übernimmt begrenzte Operationen:

- Sprache transkribieren;
- Beobachtung, Deutung und Frage trennen;
- Tätigkeiten, Materialien und situative Bedingungen extrahieren;
- offizielle Curriculumkandidaten anhand eines Quellenregisters vorschlagen;
- frühere Episoden als Vergleichskandidaten finden;
- alternative Erklärungen und Gegenbeispiele erzeugen;
- mehrere Anschlussrichtungen formulieren;
- Lernkarten, Spiel- und Materialentwürfe erzeugen;
- Änderungen und Grenzen protokollieren.

Sie darf nicht:

- Diagnosen oder stabile Personenmerkmale ableiten;
- Kompetenzstände ratifizieren;
- Angebote automatisch zuweisen;
- aus semantischer Ähnlichkeit Kausalität oder Kontinuität erklären;
- eine Ausgabe selbst in Bericht, Canon oder Langzeitspur übernehmen.

Die API-Anbindung wird erst nach dem verpflichtenden Credential-Gate implementiert. Das Ziel ist ein serverseitiger OpenAI-Responses-Pfad mit strikter strukturierter Ausgabe und einem nachgelagerten menschlichen Review.

## Datenschutz- und Governance-Ziel

Vor Realbetrieb:

1. Verantwortlichkeit und schulisches Mandat bestimmen.
2. Zweck und Rechtsgrundlage je Datenfamilie dokumentieren.
3. Rollen, Einsichtsrechte und Vertretung festlegen.
4. Auftragsverarbeitung und Datenregion prüfen.
5. Datenschutz-Folgenabschätzung durchführen.
6. kindgerechte Information und Widerspruch ermöglichen.
7. Lösch-, Berichtigungs-, Export- und Gegendarstellungswege implementieren.
8. Row-Level Security und private Storage-Buckets testen.
9. KI-Literacy, Transparenz- und Protokollpflichten operationalisieren.
10. reale Wirkung unabhängig von formaler Konformität beobachten.

## Nächste Iterationen

### V0.1 – belastbarer lokaler Pilot

- Browser- und Tablet-Smoke-Test;
- echte Tierasset-Prüfung;
- vollständige Inhaltsprüfung des Deutsch Party Brett;
- drei weitere fiktive Episodentypen;
- Print- und JSON-Export prüfen;
- Tastatur- und Screenreader-Runde;
- reproduzierbarer CI-Smoketest.

### V0.2 – geschützter Team-Prototyp

- Supabase Auth und organisationsgebundene Rollen;
- RLS und private Storage-Buckets;
- vollständiges, versioniertes Curriculumregister;
- Episode- und Transition-Ledger;
- Review-, Contestation- und Revision-UI;
- keine KI bis Credential-, Datenschutz- und Prozessfreigabe abgeschlossen sind.

### V0.3 – KI-Assistenz

- sichere OpenAI-Konfiguration;
- strukturierte Episode-Ausgabe;
- Quellen- und Claim-Ceiling-Prüfung;
- Gegenleser und alternative Erklärungen;
- Eval-Fälle für diagnostische Zuschreibung, unzulässige Generalisierung und erfundene Quellen;
- messbare Human-Override- und Korrekturrate.

### V0.4 – Material- und Spielkomposition

- Adapter für geprüfte Legacy-Spiele;
- kuratierte Aufgaben- und Materialbibliothek;
- personenbezogene Vorlieben nur als aktuelle, editierbare Auswahl;
- PDF-/SVG-/Druckgeneratoren;
- spielerische und analoge Rückführung in reale Lernhandlungen.

## Abnahme des ersten echten Piloten

Ein Pilot mit 5–10 fiktiven oder vollständig synthetischen Episoden ist bestanden, wenn:

- Original und Transformation getrennt bleiben;
- jede Hypothese als Hypothese sichtbar ist;
- Curriculumbezüge einzeln angenommen oder verworfen werden können;
- mindestens drei qualitativ verschiedene Angebote entstehen;
- Ablehnung und Nichtintervention funktionieren;
- eine Wirkung als neue Episode zurückkehren kann;
- keine Darstellung zum Kindprofil wird;
- keine Tierfigur ohne beide Freigaben erscheint;
- alte Spiele keine Scores in die Dokumentation übertragen;
- alle Statuswechsel rekonstruierbar bleiben.
