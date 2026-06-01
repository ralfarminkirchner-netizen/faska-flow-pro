import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaSkyRailGodot() {
  return (
    <GodotGameEmbed
      title="Faska Sky Rail Pro"
      src="/godot/faska-sky-rail/index.html"
      subtitle="Godot-On-Rails-Shooter nach Star-Fox-/Panzer-Dragoon-Prinzip mit Pulsefire, Lock-on-Salven, Nova, Wingman, Ringen, Supplies, Bossphasen und Learncade-Gates."
      controls="WASD/Pfeile fliegen · J/Klick Pulse · Space/K halten und loslassen fuer Lock-on · N Nova · E Wingman · L Learncade · C/Tab Fach · R Neustart"
      fallbackPath="/game/sky-rail-react"
      fallbackLabel="React-Version oeffnen"
    />
  );
}
