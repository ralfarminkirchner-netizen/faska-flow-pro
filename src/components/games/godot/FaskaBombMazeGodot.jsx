import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaBombMazeGodot() {
  return (
    <GodotGameEmbed
      title="Faska Bomb Maze Pro"
      subtitle="Godot-4-Grid-Bomber nach Bomberman-Prinzip mit Bomb-Kick, Dash, Kettenreaktionen, Blast-Vorschau, Jaegern, Guards, Runnern, Tank-Gegnern, Schilden, Zeit- und Dash-Powerups, Raumzielen, Antwortfeldern, Lernserien, Fehler-Wiederholung und Learncade fuer Wortarten, Mathe, Satzbau, Komposita und Englisch."
      src="/godot/faska-bomb-maze/index.html"
      controls="WASD/Pfeile oder Joystick bewegen · Space/B Bombe · Shift/X Dash · in Bombe laufen zum Kicken · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark starten"
    />
  );
}
