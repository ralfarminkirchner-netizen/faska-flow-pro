import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaBrawlerGodot() {
  return (
    <GodotGameEmbed
      title="Faska Brawler Pro"
      src="/godot/faska-brawler/index.html"
      subtitle="Godot-4-2.5D-Beat-em-up nach Final-Fight-/Streets-of-Rage-Prinzip mit Lanes, Kombos, Guard/Parry, Wuerfen, Waffen, zerstoerbaren Props, Rollen, Bosswellen und Learncade-Antworttoren."
      controls="WASD/Pfeile laufen · J Hieb · K Kick · U Wurf · G Block/Parry · Space Rolle · I Super · L Lernmodus · C Fach · R Neustart"
      fallbackPath="/game/brawler-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
