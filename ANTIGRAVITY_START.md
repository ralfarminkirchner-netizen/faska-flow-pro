# Faskar Flow in Google Antigravity starten

Dieses Paket ist eine saubere Exportkopie des aktuellen Projekts unter dem Namen **Faskar Flow**.

## 1. Projekt importieren

1. ZIP entpacken.
2. In Google Antigravity den Ordner `faskar-flow` öffnen.
3. Ein Terminal im Projektordner öffnen.

## 2. Abhängigkeiten installieren

```bash
npm install
```

## 3. Lokal starten

```bash
npm run dev -- --host 0.0.0.0
```

Danach die von Vite angezeigte URL öffnen, normalerweise:

```text
http://localhost:5173/
```

## 4. Produktionsbuild testen

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## 5. Railway-Deployment

Das Projekt ist als Vite/React-App vorbereitet. Railway kann es mit diesen Scripts starten:

- Build Command: `npm run build`
- Start Command: `npm start`

`npm start` nutzt `vite preview --host 0.0.0.0 --port ${PORT:-4173}` und ist damit für Railway-Portvariablen vorbereitet.

## 6. Wichtige Orientierung

- Haupt-App: `src/App.jsx`
- Deutsch-Modul: `src/modules/DeutschModule.jsx`
- Neue Vollbild-Arcade: `src/components/games/LearningArcade.jsx`
- Deutsch-Arcade-Fundus: `src/data/deutschArcadeFundus.js`
- Arcade-Sammlungen: `src/data/arcadeLearningPack.js`
- Beatmaker: `src/components/BeatMaker/BeatMaker.jsx`

## 7. Aktueller Stand

Die Exportkopie enthält die neuesten lokalen Änderungen:

- Spiele-Dock in der Deutsch-Arcade
- Vollbildstart für Minispiele
- Sprach-Taxi im Top-Down-Look
- Ninja-Dojo mit Shuriken-Mechanik
- Wort-Labyrinth
- neue Lesefahrt- und Satz-Lücken-Aufgaben
- Lazy-Normalisierung großer Aufgabenpools zur Performance-Entlastung

Nicht enthalten sind `node_modules`, `dist`, `.git` und lokale Cache-Ordner. Diese werden in Antigravity neu erzeugt.
