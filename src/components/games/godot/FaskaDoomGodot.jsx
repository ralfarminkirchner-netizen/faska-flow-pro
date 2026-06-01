import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaDoomGodot() {
  return (
    <GodotGameEmbed
      title="Faska Doom Pro"
      subtitle="Godot-4-Raycaster-Shooter mit Reaktor-Schluesseln, Gegnerdruck, Ammo/Armor, Granaten, Dash, Minimap und Learncade-Terminals fuer Wortarten, Mathe, Satzbau und Englisch."
      src="/godot/faska-doom/index.html"
      controls="W/S oder Touch-Stick vor/zurueck · A/D strafe · Pfeile/Q/E oder Touch ziehen drehen · J/Space Feuer · K Granate · Shift Dash · L Learncade · C Fach · R Neustart"
    />
  );
}
