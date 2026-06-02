import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaKartGodot() {
  return (
    <GodotGameEmbed
      title="Faska Kart Pro"
      subtitle="Godot-4-Arcade-Kart nach Mario-Kart-Prinzip mit Rundkurs, Platzierung, Drift-Tiers, Slipstream, Rivalen mit Stun/Rubberbanding, homing Rockets, Shock, Shield, Oel, Coins, Fehler-Wiederholung und Learncade-Gates fuer mehrere Faecher."
      src="/godot/faska-kart/index.html"
      controls="WASD/Pfeile fahren · Joystick links · Gas/Bremse/Drift/Item rechts · C Fach · L Learncade · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
