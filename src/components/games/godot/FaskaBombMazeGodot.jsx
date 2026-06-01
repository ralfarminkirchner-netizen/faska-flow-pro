import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaBombMazeGodot() {
  return (
    <GodotGameEmbed
      title="Faska Bomb Maze Pro"
      subtitle="Godot-4-Grid-Bomber nach Bomberman-Prinzip mit Kettenreaktionen, Blast-Vorschau, Gegnerrollen, Raumzielen, Powerups, Antwortfeldern, Fehler-Wiederholung und Learncade fuer Wortarten, Mathe, Satzbau, Komposita und Englisch."
      src="/godot/faska-bomb-maze/index.html"
      controls="WASD/Pfeile oder Joystick bewegen · Space/B Bombe · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark starten"
    />
  );
}
