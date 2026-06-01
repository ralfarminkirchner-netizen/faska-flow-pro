import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaMansionGodot() {
  return (
    <GodotGameEmbed
      title="Faska Mansion Pro"
      subtitle="Godot-4-Top-Down-Survival-Horror nach Resident-Evil-Prinzip mit Safe-Rooms, knapper Munition, Beweisen, Schluesseln, Fallen, Gegnerdruck, Zielpfeil, Minimap, Fehler-Wiederholung und Learncade-Siegeln fuer Wortarten, Lesen, Satzbau, Komposita, Mathe und Englisch."
      src="/godot/faska-mansion/index.html"
      controls="WASD/Pfeile laufen · J/Z Schuss · K/X Ausweichen · E/C Interaktion · R Reload · L Learncade · F Fach wechseln"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
