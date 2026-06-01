import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaRallyGodot() {
  return (
    <GodotGameEmbed
      title="Faska Rally Pro"
      subtitle="Godot-4-Pseudo-3D-Rally nach Sega-Rally/OutRun-Prinzip mit Kurvenphysik, Rivalen, Sektor-Gates, Fehler-Wiederholung und Learncade-Antwortspuren fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch."
      src="/godot/faska-rally/index.html"
      controls="WASD/Pfeile fahren · Joystick links · Gas/Bremse/Boost rechts · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
