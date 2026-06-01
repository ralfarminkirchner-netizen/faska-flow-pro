import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaSixtyFourGodot() {
  return (
    <GodotGameEmbed
      title="Faska 64 Godot-Prototyp"
      subtitle="Optionaler 3D-Abschluss-Prototyp. Die stabile Lernpark-Fassung liegt auf /game/faska64."
      src="/godot/faska64/index.html"
      controls="WASD/Pfeile laufen · Space/A Sprung · Antwort-Tor 1/2/3 suchen · J/X Spin · L Normal/Lernen · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark starten"
    />
  );
}
