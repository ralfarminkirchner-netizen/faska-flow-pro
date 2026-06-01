import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaBombMazeGodot() {
  return (
    <GodotGameEmbed
      title="Faska Bomb Maze Godot"
      subtitle="Grid-Bomber mit Powerups, Gegnerdruck, Raumfortschritt sowie Learncade fuer Wortarten, Mathe und Satzbau."
      src="/godot/faska-bomb-maze/index.html"
      controls="WASD/Pfeile oder Joystick bewegen · Space/B Bombe · L Learncade · C Fach · R Neustart"
    />
  );
}
