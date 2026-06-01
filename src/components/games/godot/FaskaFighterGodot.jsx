import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaFighterGodot() {
  return (
    <GodotGameEmbed
      title="Faska Fighter Pro"
      subtitle="Godot-4-1v1-Fighter mit Normalmodus zuerst, Best-of-3-Runden, Blocken, Guard-Breaks, Counter-Hits, Low/Mid-Mixups, Dash, Supermeter, CPU-Druck und zuschaltbaren Learncade-Kristallen."
      src="/godot/faska-fighter/index.html"
      controls="A/D oder Touch-Stick bewegen · W springen · S/zurueck/G blocken · J Jab · K Kick · U Low · I Super · Space Dash · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
