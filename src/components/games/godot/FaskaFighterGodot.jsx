import GodotGameEmbed from './GodotGameEmbed';

export default function FaskaFighterGodot() {
  return (
    <GodotGameEmbed
      title="Faska Fighter Pro"
      subtitle="Godot-4-1v1-Fighter mit Normalmodus zuerst, Best-of-3-Runden, Blocken, Guard-Breaks, Counter-Hits, Low/Mid-Mixups, Parry-Fenster, Throw/Throw-Tech, Knockdowns, wechselnden CPU-Stilen, Dash, Supermeter und zuschaltbaren Learncade-Kristallen."
      src="/godot/faska-fighter/index.html"
      controls="A/D oder Touch-Stick bewegen · W springen · S/zurueck/G blocken/parry · J Jab · K Kick · U Low · O Throw · I Super · Space Dash · L Learncade · C Fach · R Neustart"
      fallbackPath="/game/faska64"
      fallbackLabel="Stabilen Lernpark oeffnen"
    />
  );
}
