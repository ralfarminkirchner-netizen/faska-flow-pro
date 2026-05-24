# Projektkontext: Faskar Flow

Faskar Flow ist eine hochwertige, kindgerechte Lern-App auf React/Vite-Basis. Der Fokus liegt auf echter pädagogischer Tiefe statt dekorativer Klickflächen: viele sinnvolle Minispiele, Deutsch/Wortarten/Lesen, Mathe, Sachunterricht, Ethik, Musik, Fortschritt, Figuren, Sound und Animationen.

## Aktuelle Prioritäten

- Die schöne, handgezeichnete Gestaltung erhalten und weiter verfeinern.
- Spiele als echte Mechaniken bauen: Fahren, Springen, Zielen, Labyrinth, Sammeln, Sortieren, Kombinieren.
- Deutschspiele mit Wortarten, Satzbau, Leselernen Klasse 1, Komposita, Beispielsätzen und großem Aufgabenfundus verknüpfen.
- Spiele nicht dauerhaft in eingebetteten kleinen Fenstern laufen lassen, sondern nach Auswahl als Vollbild-Stage öffnen.
- Performance beachten: große Pools nicht unnötig rendern oder normalisieren.
- Inhalte nicht in der App erklären, sondern Qualität durch Interaktion zeigen.

## Bereits eingebaut

- Deutsch-Arcade mit Spiele-Dock.
- Vollbild-Overlay für einzelne Minispiele.
- Sprach-Taxi: Top-Down fahren, Wort/Ziel lesen, richtiges Ziel ansteuern.
- Ninja-Dojo: Shuriken auf passende Antwortkarten werfen.
- Wort-Labyrinth: Figur durch Wege zum richtigen Ausgang steuern.
- Bestehende Modi: Wortarten-Parkour, Schneeball-Wörter, Satz-Tore, Sprach-Schatz.
- Neue Fundus-Sammlungen: Lesefahrten und Satz-Lücken.

## Wichtige Dateien

- `src/components/games/LearningArcade.jsx`: Vollbild-Dock und Canvas-Minispiele.
- `src/data/deutschArcadeFundus.js`: generierter Deutsch-Aufgabenpool.
- `src/data/arcadeLearningPack.js`: Sammlungen für die Arcade.
- `src/modules/DeutschModule.jsx`: Einstieg ins Deutsch-Modul.
- `src/App.jsx`: App-Shell und Fachnavigation.

## Nächste sinnvolle Ausbauschritte

1. Sprach-Taxi weiter ausbauen: mehrere Lieferungen pro Runde, Countdown, Karte mit Hindernissen, Bonusziele.
2. Ninja-Dojo als eigenes Growing-Ninja-Spiel separieren, wenn daraus ein eigenes Projekt werden soll.
3. Labyrinth mit Leveln, Schlüsseln, Toren und Wortarten-Farbcodes erweitern.
4. Komposita-Katana und Wortarten-Jump als weitere Dock-Spiele ergänzen.
5. Beatmaker weiter Richtung MPC/GarageBand/Fruity-Loops erweitern.
6. Railway/GitHub nach finalem Stand neu deployen.
