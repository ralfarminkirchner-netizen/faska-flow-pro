# Animal Friends · technischer Freistellungs-Audit

**Datum:** 24. Juli 2026  
**Status:** technische Vorprüfung, **keine** künstlerische oder rechtliche Freigabe  
**Werkzeug:** `scripts/audit-animal-friends.py`  
**Maschinenlesbarer Bericht:** `public/catalog/visual-assets/animal-friends-audit.json`

## Ergebnis

| Motiv | Technischer Befund | Auffälligkeit |
|---|---|---|
| Ella Elefant | Nachbearbeitung | möglicher heller Saum an halbtransparenten Kanten, Indikator 29 % |
| Pino Pinguin | technischer Kandidat | keine automatische Auffälligkeit |
| Mika Katze | technischer Kandidat | keine automatische Auffälligkeit |
| Balu Hund | Nachbearbeitung | möglicher heller Saum an halbtransparenten Kanten, Indikator 20 % |
| Kiki Känguru | technischer Kandidat | keine automatische Auffälligkeit |
| Bruno Bär | technischer Kandidat | keine automatische Auffälligkeit |
| Luna Hase | technischer Kandidat | keine automatische Auffälligkeit |
| Fina Fuchs | technischer Kandidat | keine automatische Auffälligkeit |
| Roni Waschbär | technischer Kandidat | keine automatische Auffälligkeit |
| Dari Reh | technischer Kandidat | keine automatische Auffälligkeit |
| Nuri Fledermaus | technischer Kandidat | keine automatische Auffälligkeit |

Alle elf geprüften Varianten:

- sind 360 × 360 Pixel groß;
- besitzen einen transparenten Hintergrund;
- berühren mit sichtbaren Pixeln nicht den Außenrand;
- waren im CI-Checkout verfügbar.

Zusammenfassung:

```text
9 technische Kandidaten
2 Varianten zur Nachbearbeitung
0 fehlende Dateien
```

## Bedeutung von „technischer Kandidat“

Der Status bedeutet ausschließlich, dass der automatisierte Indikator in dieser Version keine der definierten Auffälligkeiten überschritten hat. Er bedeutet nicht:

- dass die Freistellung visuell sicher perfekt ist;
- dass das Motiv in jeder Druckgröße funktioniert;
- dass innenliegende Schnittfehler ausgeschlossen sind;
- dass die künstlerische Qualität bewertet wurde;
- dass Nutzungs- oder Veröffentlichungsrechte bestätigt sind;
- dass das Motiv automatisch in Kinderansichten oder Materialien erscheinen darf.

## Verbindlicher Freigabepfad

```text
technical_recommendation = candidate
AND
visual_review = accepted
AND
rights_confirmed = true
```

Erst wenn alle drei Bedingungen erfüllt sind, darf eine konkrete Variante in der Dokumentations-Alpha als Tierweltmotiv erscheinen. Die Browseroberfläche blockiert eine menschliche `accepted`-Entscheidung für technisch als `rework` markierte Varianten.

## Nachbearbeitung

Für Ella Elefant und Balu Hund soll eine neue Cutout-Version erzeugt werden. Die alte Version wird nicht überschrieben, sondern bleibt als Herkunftsreferenz erhalten.

Empfohlener Ablauf:

1. Original und gegenwärtige Cutout-Version vergleichen.
2. Hellen Rand beziehungsweise halbtransparente Außenpixel gezielt prüfen.
3. Randmaske manuell nacharbeiten, ohne Innenkonturen oder zeichnerische Details zu zerstören.
4. Neue Variante mit eigener Versionsnummer exportieren.
5. Technischen Audit erneut ausführen.
6. Danach menschliche Sichtprüfung auf hellem, dunklem und gemustertem Hintergrund durchführen.
7. Rechtebestätigung separat dokumentieren.

## Grenzen des Verfahrens

Der Algorithmus prüft Transparenz, sichtbare Motivfläche, Randkontakt, Sicherheitsabstand, Auflösung und einen einfachen hellen-Saum-Indikator. Er erkennt unter anderem nicht zuverlässig:

- abgeschnittene anatomische oder zeichnerische Teile, sofern sie nicht den Bildrand berühren;
- unerwünschte transparente Löcher im Motiv;
- semantisch falsche Masken;
- farbige statt helle Halos;
- unerwünschte Teile anderer Motive;
- ästhetische Unruhe oder unpassende Skalierung;
- Rechte, Einwilligung oder zulässige Nutzungszwecke.

Der Audit ist deshalb ein vorgeschalteter Fehlerfilter, kein Freigabeautomat.
