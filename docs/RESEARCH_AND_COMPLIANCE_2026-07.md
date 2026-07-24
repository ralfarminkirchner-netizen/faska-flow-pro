# Recherche- und Compliance-Notiz · 24. Juli 2026

**Zweck:** belastbare Quellen- und Entscheidungsgrundlage für die weitere Entwicklung der FASKA-Dokumentation.  
**Hinweis:** Dies ist eine technische Produktnotiz, keine abschließende Rechtsberatung.

## 1. Bildungsplan Baden-Württemberg

### Quellen

- Implementierungskonzept überarbeiteter Pläne: https://bildungsplaene-bw.de/25863460
- Bildungsplan-Portal: https://www.bildungsplaene-bw.de/
- Deutsch Grundschule V2: https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/D.V2
- Mathematik Grundschule V2: https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/M.V2
- Sachunterricht Grundschule: https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/SU

### Befund

Die offizielle Implementierungstabelle weist Deutsch und Mathematik in der Grundschule für das Schuljahr 2026/2027 als `BP2016.V2 (29.02.2024)` aus. Sachunterricht wird weiterhin als eigener Planstand geführt. Ein Produkt darf deshalb nicht von einem einzigen globalen Curriculum-Versionsfeld ausgehen.

### Produktentscheidung

```text
CurriculumSource
  id
  subject
  school_type
  version_label
  published_at
  effective_from
  effective_to?
  source_url
  source_hash
```

Jeder Kompetenz- oder Inhaltsknoten verweist auf genau eine `CurriculumSource`. Eine KI-Ausgabe darf nur Knoten aus dem aktiven, versionierten Register referenzieren. Modellwissen oder frei erzeugte Formulierungen sind keine Planquelle.

## 2. Datenschutz im schulischen Cloud-Einsatz

### Quellen

- IT.KULTUS-BW – Kollaborationsplattformen: https://it.kultus-bw.de/%2CLde/Startseite/IT-Sicherheit/Kollaborationsplattformen
- IT.KULTUS-BW – Startseite und aktuelle Datenschutzinformationen: https://it.kultus-bw.de/%2CLde/Startseite
- IT.KULTUS-BW – Vertragspartner für Cloud-Dienste: https://it.kultus-bw.de/Startseite/IT-Sicherheit/Vertragspartner%2Bfuer%2BCloud-Dienste

### Befund

Nach den Hinweisen des Landes bleibt die Schule beim Einsatz schulischer Kollaborations- oder Cloud-Plattformen Verantwortliche. Externe Verarbeitung ist grundsätzlich als Auftragsverarbeitung nach Artikel 28 DSGVO zu behandeln. Verarbeitung außerhalb des Geltungsbereichs der EU-DSGVO wird ausdrücklich problematisiert.

### Produktentscheidung

Der aktuelle Slice ist lokal und verwendet nur fiktive Daten. Vor einem Realpiloten sind verbindlich:

1. Verantwortlicher und Betreiber schriftlich festlegen.
2. Rechtsgrundlage und Zweck je Datentyp dokumentieren.
3. Auftragsverarbeitungsverträge und Unterauftragnehmer prüfen.
4. Datenstandorte und Drittlandtransfers bewerten.
5. Datenschutz-Folgenabschätzung durchführen.
6. Rollen- und Berechtigungskonzept technisch testen.
7. Lösch-, Berichtigungs-, Auskunfts-, Export-, Widerspruchs- und Gegendarstellungswege implementieren.
8. Schutz für Bilder, Audio, Selbstberichte, Beobachtungen und abgeleitete Hypothesen getrennt bestimmen.
9. Entwicklungs-, Test- und Produktionsdaten strikt trennen.
10. Keine Realpersonen in frei zugänglichen Logs, Issues, Demos oder KI-Evals verwenden.

## 3. EU AI Act

### Quellen

- Europäische Kommission – AI Act overview: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- Europäische Kommission – Navigating the AI Act: https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act
- Europäische Kommission – politische Einigung zur Vereinfachung vom 7. Mai 2026: https://digital-strategy.ec.europa.eu/en/news/eu-agrees-simplify-ai-rules-boost-innovation-and-ban-nudification-apps-protect-citizens

### Befund

Die allgemeine Anwendbarkeit des AI Act beginnt grundsätzlich am 2. August 2026; einzelne Pflichten gelten bereits. Die Kommission berichtet im Mai 2026 über eine politische Einigung, nach der Regeln für bestimmte Hochrisikobereiche einschließlich Bildung ab 2. Dezember 2027 gelten sollen. Der genaue Produktstatus und der endgültig geltende Zeitplan müssen vor Inbetriebnahme erneut rechtlich geprüft werden.

### Produktentscheidung

Die FASKA-Dokumentation wird bewusst **nicht** als automatisches Aufnahme-, Einstufungs-, Prüfungs-, Benotungs- oder Zuweisungssystem konzipiert.

Nicht zulässig:

- automatische Kompetenzentscheidung;
- Ranking oder Risikowert für Kinder;
- automatische Auswahl eines Lernwegs mit bindender Wirkung;
- Diagnose- oder Identitätsinferenz;
- Ableitung schulischer Rechte, Zugänge oder Nachteile aus Modelloutputs;
- Nutzung eines KI-Scores als Freigabeentscheidung.

Zulässiges Zielbild:

- vorbereitende Strukturierung;
- Quellen- und Typentrennung;
- Kandidaten für menschliche Prüfung;
- alternative Erklärungen und Gegenbeispiele;
- dokumentierte, widerrufliche Materialvorschläge;
- Transparenz über Modell, Prompt, Quellen, Unsicherheit und Review.

Diese Produktbegrenzung ersetzt keine formale Klassifizierungsprüfung.

## 4. Barrierefreiheit

### Quelle

- WCAG 2.2, W3C Recommendation: https://www.w3.org/TR/WCAG22/
- W3C-Überblick: https://www.w3.org/WAI/standards-guidelines/wcag/

### Befund

WCAG 2.2 ist seit Oktober 2023 W3C Recommendation und wurde 2025 als ISO/IEC 40500:2025 anerkannt. Die zusätzlichen Kriterien betreffen unter anderem Fokus, Berührungsziele und kognitive Zugänglichkeit.

### Produktentscheidung

Zielniveau ist WCAG 2.2 AA. Der Alpha enthält bereits:

- semantische Überschriften;
- Skip-Link;
- Tastaturbedienung für Hauptfunktionen;
- sichtbare Fokuszustände;
- reduzierte Bewegung über Systemeinstellung;
- keine alleinige Farbcodierung von Status;
- mobile und Tablet-Layouts;
- Vorlesefunktion für Eingabetext.

Noch zu testen:

- Screenreader-Reihenfolge;
- Dialogfokus und Rückkehrfokus;
- Zoom auf 200–400 Prozent;
- Kontrastmessung;
- Berührungszielgrößen;
- Fehlermeldungen und Formularbeschriftungen;
- Bedienung ohne Drag-and-drop;
- Druckausgabe und alternative Textdarstellungen der Lernspur.

## 5. Supabase-Zielarchitektur

### Quellen

- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Storage Access Control: https://supabase.com/docs/guides/storage/security/access-control
- Storage Schema: https://supabase.com/docs/guides/storage/schema/design
- pgvector: https://supabase.com/docs/guides/database/extensions/pgvector

### Befund

Supabase weist darauf hin, dass RLS für alle Tabellen in exponierten Schemas aktiviert werden muss. Storage-Zugriff wird ebenfalls über RLS-Policies gesteuert. Service-Rollen dürfen nie im Browser exponiert werden. pgvector eignet sich für Kandidatensuche, aber semantische Nähe ist keine fachliche oder pädagogische Gleichheit.

### Produktentscheidung

- jede Tabelle RLS-geschützt;
- organisations- und rollenbezogene Policies;
- private Storage-Buckets;
- Service-Role nur in serverseitigen Funktionen;
- keine Autorisierungsdaten aus veränderbarem `raw_user_meta_data`;
- sensible Payloads getrennt von allgemeineren Metadaten;
- Embeddings nur auf dafür freigegebenen, minimierten Textrepräsentationen;
- jeder Ähnlichkeitstreffer bleibt Kandidat mit Quellenverweis;
- keine automatische Homologie, Ursache oder Personenidentität aus Vektornähe.

## 6. OpenAI-Zielintegration

### Quellen

- Structured Outputs: https://openai.com/index/introducing-structured-outputs-in-the-api/
- Function Calling / Agents platform overview: https://help.openai.com/en/articles/8555517

### Befund

Structured Outputs können Modellantworten an ein vorgegebenes JSON-Schema binden. Das verhindert jedoch keine inhaltlichen Fehler innerhalb der Werte. Refusals, Abbruchzustände und fachliche Fehler müssen weiterhin behandelt werden.

### Produktentscheidung

Die API-Anbindung wird erst nach dem verpflichtenden Credential-Gate umgesetzt. Danach gilt:

- serverseitige Responses-API;
- strikte strukturierte Ausgabe;
- kleine, getrennte Operationen statt eines allwissenden Agents;
- keine parallelen, unkontrollierten Tool-Aufrufe für statusrelevante Schritte;
- Eingabequellen, Modell, Promptversion, Schema, Ausgabe und Review werden protokolliert;
- Outputstatus immer `proposal`;
- menschliche Übernahme erzeugt ein eigenes Autorisierungsereignis;
- Prompt- und Eval-Fälle testen ausdrücklich diagnostische Zuschreibung, Generalisierung, erfundene Quellen, falsche Planstellen und fehlende Alternativen.

## 7. Recherche zum älteren Lernspiel

### Quelle

- Repository `ralfarminkirchner-netizen/deutsch-party-brett`

### Statische Befunde

- eigenständiger Start-, Setup-, Brett-, Minigame- und Ergebnisfluss;
- Task-Generator getrennt von Rendering;
- zentrales Minigame-Register;
- gemeinsames Interface mit `id`, deutschem Namen, Topics und `setup(container, task, onComplete)`;
- zahlreiche Sprachmechaniken, darunter Wortarten, Artikel, Satzordnung, Lückentext, Rechtschreibung, Reime, Silben, Geschichten, Dialoge, Kreuzworträtsel und Labyrinthe.

### Noch nicht belegt

- aktueller Browserlauf;
- mobile und Touch-Bedienung;
- Barrierefreiheit;
- vollständige Rechtekette aller Assets;
- fachliche Qualität sämtlicher Aufgaben;
- reale Unterrichtswirkung;
- Eignung jeder Mechanik für alle Altersgruppen.

### Produktentscheidung

Das Spiel wird nicht eingebettet, sondern als `external_adapter` registriert. Erst nach Laufzeit-, Inhalts-, Rechte- und Unterrichtstest können einzelne Mechaniken den Status `accepted` erhalten.

## 8. Recherche zu den Tiermotiven

### Quellen im Repository

- `scripts/extract-animal-friends.py`
- `public/animal-friends/`
- `public/catalog/visual-assets/animal-friends.json`

### Befund

Elf Motive sind namentlich registriert. Der vorhandene Extraktionspfad erzeugt WebP- und PNG-Varianten. Bislang fehlten eine formale Qualitätsprüfung, getrennte Rechtebestätigung und ein expliziter Verwendungsstatus.

### Produktentscheidung

Der neue Katalog startet für alle Motive mit:

```text
review_status = review_required
rights_status = creator_confirmation_required
automatic_acceptance = false
```

Der neue Python- und Browser-Audit berechnet nur technische Hinweise. Ein Motiv wird erst nutzbar, wenn eine Person die Freistellung akzeptiert und die Rechte bestätigt.

## 9. Offene Entscheidungen vor einem Realpiloten

- institutioneller Verantwortlicher;
- konkreter Nutzerkreis und Rollen;
- Rechtsgrundlage je Verarbeitung;
- Hosting- und Datenregion;
- Aufbewahrungs- und Löschfristen;
- Einwilligungs- versus Aufgaben-/Schulrechtskonzept;
- kindgerechte Beteiligungs- und Widerspruchsoberfläche;
- Umfang von Foto, Audio und Transkription;
- Curriculum-Lizenz- und Importverfahren;
- Freigabeprozess für schulinterne Materialien;
- OpenAI-Credential-Entscheidung und Datenverarbeitungskonfiguration;
- unabhängige Datenschutz- und Sicherheitsprüfung;
- Evaluation mit synthetischen Fällen vor jeder realen Episode.

## 10. Aktueller Freigabestatus

```text
Lokale fiktive Demonstration: zulässig als Entwicklungsartefakt
Reale Kinderdaten: blockiert
Cloudspeicherung: blockiert
OpenAI-API-Aufruf: blockiert bis Credential- und Datenschutz-Gate
Automatische Bewertung: architektonisch verboten
Tierverwendung: einzeln durch Qualitäts- und Rechtegate blockiert
Legacy-Spielübernahme: blockiert bis Audit und Adaptertest
```
