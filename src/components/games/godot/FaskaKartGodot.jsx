import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaKartGodot() {
  return (
    <GodotGameEmbed
      title="Faska Kart Pro"
      subtitle="Godot-4-Arcade-Kart nach Mario-Kart-Prinzip mit Rundkurs, Drift-Mini-Turbo, Rivalen, Itemboxen, Rocket/Shield/Oel, Fehler-Wiederholung und Learncade-Gates fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch."
      src="/godot/faska-kart/index.html"
      controls="WASD/Pfeile fahren · Joystick links · Gas/Bremse/Drift/Item rechts · C Fach · L Learncade · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
