import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaBrawlerGodot() {
  return (
    <GodotGameEmbed
      title="Faska Brawler Pro"
      src="/godot/faska-brawler/index.html"
      subtitle="Godot-4-2.5D-Beat-em-up nach Final-Fight-/Streets-of-Rage-Prinzip mit Lanes, Kombos, Launcher/Air-Hits, Style-Rang, Guard/Parry, Wuerfen, Waffen, Shield- und Duelist-Gegnern, Perfect-Wave-Boni, zerstoerbaren Props, Bosswellen, Lernserien und Learncade-Antworttoren."
      controls="WASD/Pfeile laufen · J Hieb · K Kick · O Launcher · U Wurf · G Block/Parry · Space Rolle · I Super · L Lernmodus · C Fach · R Neustart"
      fallbackPath="/game/brawler-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
