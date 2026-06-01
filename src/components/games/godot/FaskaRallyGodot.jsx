import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaRallyGodot() {
  return (
    <GodotGameEmbed
      title="Faska Rally Pro"
      subtitle="Godot-4-Pseudo-3D-Rally nach Sega-Rally/OutRun-Prinzip mit grosser Fullscreen-Streckenprojektion, Driftwertung, Near-Miss-Boni, Ueberholungen, Boost-Pads, Oel/Matsch/Pylonen, Sektor-Splits und Learncade-Antwortspuren fuer mehrere Faecher."
      src="/godot/faska-rally/index.html"
      controls="WASD/Pfeile fahren · Joystick links · Gas/Bremse/Boost rechts · Space Boost · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
