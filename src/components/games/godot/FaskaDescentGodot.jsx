import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaDescentGodot() {
  return (
    <GodotGameEmbed
      title="Faska Descent Pro"
      subtitle="Godot-4-6DOF-Tunnel-Shooter nach Descent/Star-Fox-Prinzip mit Waffenwechsel, Raketen, Shield-Pulse, Bosskern, Fehler-Wiederholung und Learncade-Gates fuer Deutsch, Mathe, Satzbau, Lesen, Komposita, Englisch und Sachkunde."
      src="/godot/faska-descent/index.html"
      controls="WASD/Pfeile fliegen · Touch-Stick links · Fire/Boost/Rakete/Pulse rechts · C Waffe · F Fach · L Learncade · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
