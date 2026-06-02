import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaMansionGodot() {
  return (
    <GodotGameEmbed
      title="Faska Mansion Pro"
      subtitle="Godot-4-Top-Down-Survival-Horror nach Resident-Evil-Prinzip mit Safe-Rooms, knapper Munition, echter Reload-Spannung, durchsuchbaren Moebeln, Geraeuschdruck, aufbrechenden Tueren, Beweisen, Schluesseln, Fallen, Zielpfeil, Minimap und Learncade-Siegeln."
      src="/godot/faska-mansion/index.html"
      controls="WASD/Pfeile laufen · J/Z Schuss · K/X Ausweichen · E/C Interaktion · R Reload · L Learncade · F Fach wechseln"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
