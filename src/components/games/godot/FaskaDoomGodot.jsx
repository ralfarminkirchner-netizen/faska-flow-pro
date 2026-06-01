import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaDoomGodot() {
  return (
    <GodotGameEmbed
      title="Faska Doom Pro"
      subtitle="Godot-4-Raycaster-Shooter mit Reaktor-Schluesseln, Gegnerdruck, Ammo/Armor, Granaten, Dash, Minimap, Fehler-Wiederholung und Learncade-Terminals fuer Wortarten, Mathe, Satzbau, Lesen, Komposita und Englisch."
      src="/godot/faska-doom/index.html"
      controls="W/S oder Touch-Stick vor/zurueck · A/D strafe · Pfeile/Q/E oder Touch ziehen drehen · J/Space Feuer · K Granate · Shift Dash · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
